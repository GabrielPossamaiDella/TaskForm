import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchClientes, upsertCliente, deleteCliente,
  fetchOS, upsertOS, deleteOS,
  fetchConfig, salvarConfig as salvarConfigRemoto,
} from '../services/dataService';
import { capturarLocalizacao, calcularDeslocamento } from '../utils/geo';

const gerarId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const CACHE_CLIENTES = '@clientes';
const CACHE_OS = '@lista_os';
const CACHE_CONFIG = '@config';
const PENDING_KEY = '@pending_sync';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [listaOS, setListaOS] = useState([]);
  const [config, setConfig] = useState(null);
  const [online, setOnline] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);

  const osInicial = {
    cliente: null, maquina: '', defeito: '', servico: '', tempo: '', valorMaoDeObra: '', pecas: [], total: 0
  };
  const [osAtual, setOsAtual] = useState(osInicial);

  useEffect(() => {
    iniciar();
  }, []);

  // ---------- CACHE LOCAL (offline) ----------
  const persistClientes = async (lista) => {
    setClientes(lista);
    await AsyncStorage.setItem(CACHE_CLIENTES, JSON.stringify(lista));
  };
  const persistOS = async (lista) => {
    setListaOS(lista);
    await AsyncStorage.setItem(CACHE_OS, JSON.stringify(lista));
  };

  // ---------- FILA DE SINCRONIZACAO (escritas feitas offline) ----------
  const getPending = async () => JSON.parse((await AsyncStorage.getItem(PENDING_KEY)) || '[]');
  const setPending = async (arr) => AsyncStorage.setItem(PENDING_KEY, JSON.stringify(arr));
  const enqueue = async (item) => {
    const q = await getPending();
    q.push(item);
    await setPending(q);
    setOnline(false);
  };

  const flushPending = async () => {
    const q = await getPending();
    if (!q.length) return;
    const restantes = [];
    for (const item of q) {
      try {
        if (item.entity === 'cliente' && item.op === 'upsert') await upsertCliente(item.payload);
        else if (item.entity === 'cliente' && item.op === 'delete') await deleteCliente(item.id);
        else if (item.entity === 'os' && item.op === 'upsert') await upsertOS(item.payload);
        else if (item.entity === 'os' && item.op === 'delete') await deleteOS(item.id);
      } catch (e) {
        restantes.push(item); // segue offline -> mantem na fila
      }
    }
    await setPending(restantes);
  };

  // ---------- BOOT + SYNC ----------
  const iniciar = async () => {
    // 1) Carrega o cache primeiro: app abre instantaneo e funciona offline
    try {
      const cCli = await AsyncStorage.getItem(CACHE_CLIENTES);
      const cOS = await AsyncStorage.getItem(CACHE_OS);
      const cCfg = await AsyncStorage.getItem(CACHE_CONFIG);
      if (cCli) setClientes(JSON.parse(cCli));
      if (cOS) setListaOS(JSON.parse(cOS));
      if (cCfg) setConfig(JSON.parse(cCfg));
    } catch (e) {
      console.warn('Falha ao ler cache local', e);
    }
    // 2) Tenta sincronizar com o Supabase
    await sincronizar();
  };

  const sincronizar = async () => {
    setSincronizando(true);
    try {
      await flushPending();
      const [cls, oss, cfg] = await Promise.all([fetchClientes(), fetchOS(), fetchConfig()]);
      await persistClientes(cls);
      await persistOS(oss);
      setConfig(cfg);
      await AsyncStorage.setItem(CACHE_CONFIG, JSON.stringify(cfg));
      setOnline(true);
      return true;
    } catch (e) {
      setOnline(false); // sem conexao: segue com o cache
      return false;
    } finally {
      setSincronizando(false);
    }
  };

  // ---------- CONFIGURACOES (local base, raio, valor/km) ----------
  const salvarConfig = async (novaConfig) => {
    setConfig(novaConfig);
    await AsyncStorage.setItem(CACHE_CONFIG, JSON.stringify(novaConfig));
    const salvo = await salvarConfigRemoto(novaConfig); // lanca se offline -> tela trata
    setConfig(salvo);
    await AsyncStorage.setItem(CACHE_CONFIG, JSON.stringify(salvo));
    return salvo;
  };

  // ---------- CRUD DE CLIENTES ----------
  const adicionarCliente = async (novo) => {
    const cliente = { ...novo, id: gerarId(), sincronizada: false };
    const nova = [...clientes, cliente];
    await persistClientes(nova);
    try {
      const salvo = await upsertCliente(cliente);
      await persistClientes(nova.map(c => (c.id === cliente.id ? { ...c, serverId: salvo.serverId, sincronizada: true } : c)));
      setOnline(true);
    } catch (e) {
      await enqueue({ entity: 'cliente', op: 'upsert', payload: cliente });
    }
  };

  const editarCliente = async (id, dadosAtualizados) => {
    const nova = clientes.map(c => (c.id === id ? { ...c, ...dadosAtualizados, sincronizada: false } : c));
    await persistClientes(nova);
    const alvo = nova.find(c => c.id === id);
    try {
      await upsertCliente(alvo);
      await persistClientes(nova.map(c => (c.id === id ? { ...c, sincronizada: true } : c)));
      setOnline(true);
    } catch (e) {
      await enqueue({ entity: 'cliente', op: 'upsert', payload: alvo });
    }
  };

  const excluirCliente = async (id) => {
    const nova = clientes.filter(c => c.id !== id);
    await persistClientes(nova);
    try {
      await deleteCliente(id);
      setOnline(true);
    } catch (e) {
      await enqueue({ entity: 'cliente', op: 'delete', id });
    }
  };

  // ---------- ORDEM DE SERVICO (rascunho em memoria) ----------
  const atualizarOS = (dados) => setOsAtual(prev => ({ ...prev, ...dados }));
  const adicionarPecaOS = (novaPeca) => setOsAtual(prev => ({ ...prev, pecas: [...prev.pecas, novaPeca] }));
  const removerPecaOS = (pecaId) => setOsAtual(prev => ({ ...prev, pecas: prev.pecas.filter(p => p.id !== pecaId) }));
  const carregarOSParaEdicao = (os) => setOsAtual(os);

  // ---------- CRUD DE ORDEM DE SERVICO (persistido) ----------
  // Envia a OS ao servidor e, ao confirmar, marca como sincronizada na lista.
  const enviarOSeMarcar = async (osAlvo, listaBase) => {
    try {
      await upsertOS(osAlvo);
      await persistOS(listaBase.map(os => (os.id === osAlvo.id ? { ...os, sincronizada: true } : os)));
      setOnline(true);
    } catch (e) {
      await enqueue({ entity: 'os', op: 'upsert', payload: osAlvo });
    }
  };

  const excluirOS = async (id) => {
    const nova = listaOS.filter(os => os.id !== id);
    await persistOS(nova);
    try {
      await deleteOS(id);
      setOnline(true);
    } catch (e) {
      await enqueue({ entity: 'os', op: 'delete', id });
    }
  };

  const atualizarStatusOS = async (id, novoStatus) => {
    const nova = listaOS.map(os => (os.id === id ? { ...os, status: novoStatus, sincronizada: false } : os));
    await persistOS(nova);
    const alvo = nova.find(os => os.id === id);
    await enviarOSeMarcar(alvo, nova);
  };

  const finalizarOS = async () => {
    if (!osAtual.cliente) {
      throw new Error('Cliente obrigatório para finalizar OS');
    }

    const somaPecas = osAtual.pecas.reduce((acc, p) => acc + parseFloat(p.valor || 0), 0);

    // Localizacao do atendimento: usa a ja capturada (tela de Resumo) ou captura agora
    let lat = osAtual.latitude ?? null;
    let lng = osAtual.longitude ?? null;
    if (lat == null || lng == null) {
      const geo = await capturarLocalizacao();
      if (geo) { lat = geo.latitude; lng = geo.longitude; }
    }

    // Deslocamento (KM rodado) com base na config da empresa
    const desl = calcularDeslocamento(config, lat, lng);
    const totalFinal = parseFloat(osAtual.valorMaoDeObra || 0) + somaPecas + desl.valor;

    let novaListaOS;
    let osSalva;

    const camposGeo = {
      latitude: lat,
      longitude: lng,
      deslocamentoKm: desl.kmCobrado,
      deslocamentoValor: desl.valor,
    };

    if (osAtual.id) {
      // Editando OS existente
      osSalva = { ...osAtual, ...camposGeo, total: totalFinal, sincronizada: false };
      novaListaOS = listaOS.map(os => (os.id === osAtual.id ? osSalva : os));
    } else {
      // Nova OS
      osSalva = {
        ...osAtual,
        id: gerarId(),
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'Aberta',
        os_number: `#${String(Date.now()).slice(-6)}`,
        total: totalFinal,
        ...camposGeo,
        sincronizada: false,
      };
      novaListaOS = [osSalva, ...listaOS];
    }

    await persistOS(novaListaOS);
    await enviarOSeMarcar(osSalva, novaListaOS);
    setOsAtual(osInicial);
  };

  return (
    <AppContext.Provider value={{
      clientes, adicionarCliente, editarCliente, excluirCliente,
      osAtual, atualizarOS, adicionarPecaOS, removerPecaOS, listaOS, finalizarOS,
      excluirOS, carregarOSParaEdicao, atualizarStatusOS,
      online, sincronizando, sincronizar,
      config, salvarConfig,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
