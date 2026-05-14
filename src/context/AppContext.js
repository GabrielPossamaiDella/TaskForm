import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [listaOS, setListaOS] = useState([]);
  
  // Estado inicial limpo para facilitar o reset
  const osInicial = {
    cliente: null, maquina: '', defeito: '', servico: '', tempo: '', valorMaoDeObra: 120, pecas: [], total: 0
  };
  const [osAtual, setOsAtual] = useState(osInicial);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedClientes = await AsyncStorage.getItem('@clientes');
      const savedOS = await AsyncStorage.getItem('@lista_os');
      
      if (savedClientes) setClientes(JSON.parse(savedClientes));
      if (savedOS) setListaOS(JSON.parse(savedOS));
    } catch (e) {
      console.error("Erro ao carregar dados offline", e);
    }
  };

  // --- CRUD DE CLIENTES ---
  const adicionarCliente = async (novo) => {
    const novaLista = [...clientes, { ...novo, id: Math.random().toString() }];
    setClientes(novaLista);
    await AsyncStorage.setItem('@clientes', JSON.stringify(novaLista));
  };

  const editarCliente = async (id, dadosAtualizados) => {
    const novaLista = clientes.map(c => c.id === id ? { ...c, ...dadosAtualizados } : c);
    setClientes(novaLista);
    await AsyncStorage.setItem('@clientes', JSON.stringify(novaLista));
  };

  const excluirCliente = async (id) => {
    const novaLista = clientes.filter(c => c.id !== id);
    setClientes(novaLista);
    await AsyncStorage.setItem('@clientes', JSON.stringify(novaLista));
  };

  // --- CRUD DE ORDEM DE SERVIÇO ---
  const atualizarOS = (dados) => setOsAtual(prev => ({ ...prev, ...dados }));

  const adicionarPecaOS = (novaPeca) => {
    setOsAtual(prev => ({ ...prev, pecas: [...prev.pecas, novaPeca] }));
  };

  // Prepara o formulário com os dados da OS selecionada
  const carregarOSParaEdicao = (os) => {
    setOsAtual(os);
  };

  const excluirOS = async (id) => {
    const novaLista = listaOS.filter(os => os.id !== id);
    setListaOS(novaLista);
    await AsyncStorage.setItem('@lista_os', JSON.stringify(novaLista));
  };

  const finalizarOS = async () => {
    try {
      const somaPecas = osAtual.pecas.reduce((acc, p) => acc + parseFloat(p.valor || 0), 0);
      const totalFinal = parseFloat(osAtual.valorMaoDeObra || 0) + somaPecas;

      let novaListaOS;

      // Se a osAtual tem um ID, significa que estamos EDITANDO uma OS existente
      if (osAtual.id) {
        const osAtualizada = { ...osAtual, total: totalFinal };
        novaListaOS = listaOS.map(os => os.id === osAtual.id ? osAtualizada : os);
      } 
      // Se não tem ID, é uma NOVA OS
      else {
        const novaOS = {
          ...osAtual,
          id: Math.random().toString(),
          data: new Date().toLocaleDateString('pt-BR'),
          status: 'Concluída',
          os_number: `#${Math.floor(100000 + Math.random() * 900000)}`, // Gera um número aleatório de 6 dígitos
          total: totalFinal
        };
        novaListaOS = [novaOS, ...listaOS];
      }
      
      setListaOS(novaListaOS);
      await AsyncStorage.setItem('@lista_os', JSON.stringify(novaListaOS));
      
      // Reseta o formulário
      setOsAtual(osInicial);
    } catch (e) {
      console.error("Erro ao finalizar OS offline", e);
    }
  };

  return (
    <AppContext.Provider value={{ 
      clientes, adicionarCliente, editarCliente, excluirCliente,
      osAtual, atualizarOS, adicionarPecaOS, listaOS, finalizarOS,
      excluirOS, carregarOSParaEdicao
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);