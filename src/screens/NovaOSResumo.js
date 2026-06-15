import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';
import StepProgress from '../components/StepProgress';
import { formatarMoeda } from '../utils/format';
import { capturarLocalizacao, calcularDeslocamento } from '../utils/geo';

const HEADER_BG = '#2563EB';

export default function NovaOSResumo({ navigation }) {
  const { osAtual, finalizarOS, atualizarOS, config } = useApp();
  const insets = useSafeAreaInsets();
  const [salvando, setSalvando] = useState(false);
  const [buscandoLocal, setBuscandoLocal] = useState(false);

  // Ao abrir o resumo, captura a localizacao e calcula o deslocamento (se houver base configurada)
  useEffect(() => {
    let ativo = true;
    (async () => {
      if (osAtual.latitude != null && osAtual.deslocamentoValor != null) return; // ja calculado
      if (config?.baseLatitude == null) return; // sem base definida nas configuracoes
      setBuscandoLocal(true);
      const geo = await capturarLocalizacao();
      if (ativo && geo) {
        const d = calcularDeslocamento(config, geo.latitude, geo.longitude);
        atualizarOS({
          latitude: geo.latitude, longitude: geo.longitude,
          deslocamentoKm: d.kmCobrado, deslocamentoValor: d.valor,
        });
      }
      if (ativo) setBuscandoLocal(false);
    })();
    return () => { ativo = false; };
  }, []);

  const totalPecas = osAtual.pecas.reduce((a, p) => a + parseFloat(p.valor || 0), 0);
  const maoDeObra = parseFloat(osAtual.valorMaoDeObra || 0);
  const deslocamento = parseFloat(osAtual.deslocamentoValor || 0);
  const totalGeral = maoDeObra + totalPecas + deslocamento;

  const handleFinalizar = async () => {
    if (!osAtual.cliente) {
      Alert.alert('Cliente obrigatório', 'Volte e selecione um cliente.');
      return;
    }
    setSalvando(true);
    try {
      await finalizarOS();
      Toast.show({ type: 'success', text1: 'OS salva!', text2: 'Ordem de Serviço registrada com sucesso.', visibilityTime: 3000 });
      navigation.navigate('Home', { screen: 'Painel' });
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a OS.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={styles.safe}>
      <View style={{ backgroundColor: HEADER_BG, paddingTop: insets.top }}>
        <StepProgress current={4} />
      </View>

      <View style={styles.contentArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Card Cliente */}
          <View style={styles.card}>
            <View style={styles.cardTituloRow}>
              <View style={styles.cardIcone}>
                <Ionicons name="person" size={13} color={HEADER_BG} />
              </View>
              <Text style={styles.cardTitulo}>CLIENTE</Text>
            </View>
            <Text style={styles.cardValor}>{osAtual.cliente?.nome || 'Não selecionado'}</Text>
            {osAtual.cliente?.telefone ? (
              <Text style={styles.cardSub}>{osAtual.cliente.telefone}</Text>
            ) : null}
          </View>

          {/* Card Equipamento */}
          <View style={styles.card}>
            <View style={styles.cardTituloRow}>
              <View style={styles.cardIcone}>
                <Ionicons name="settings-outline" size={13} color={HEADER_BG} />
              </View>
              <Text style={styles.cardTitulo}>EQUIPAMENTO</Text>
            </View>
            <Text style={styles.cardValor}>{osAtual.maquina || '—'}</Text>
            {osAtual.defeito ? <Text style={styles.cardSub}>{osAtual.defeito}</Text> : null}
            {osAtual.servico ? <Text style={styles.cardSub}>{osAtual.servico}</Text> : null}
          </View>

          {/* Peças */}
          {osAtual.pecas.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardTituloRow}>
                <View style={styles.cardIcone}>
                  <Ionicons name="construct-outline" size={13} color={HEADER_BG} />
                </View>
                <Text style={styles.cardTitulo}>PEÇAS ({osAtual.pecas.length})</Text>
              </View>
              {osAtual.pecas.map((p, i) => (
                <View key={p.id || i} style={[styles.pecaRow, i === osAtual.pecas.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.pecaNome}>{p.nome}</Text>
                  <Text style={styles.pecaValor}>R$ {formatarMoeda(p.valor)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Card Financeiro — fundo escuro */}
          <View style={styles.cardFinanceiro}>
            {maoDeObra > 0 && (
              <View style={styles.finRow}>
                <Text style={styles.finLabel}>Mão de Obra</Text>
                <Text style={styles.finValor}>R$ {formatarMoeda(maoDeObra)}</Text>
              </View>
            )}
            {osAtual.pecas.length > 0 && (
              <View style={styles.finRow}>
                <Text style={styles.finLabel}>Peças ({osAtual.pecas.length})</Text>
                <Text style={styles.finValor}>R$ {formatarMoeda(totalPecas)}</Text>
              </View>
            )}
            {buscandoLocal && (
              <View style={styles.finRow}>
                <Text style={styles.finLabel}>Deslocamento</Text>
                <Text style={styles.finValor}>calculando...</Text>
              </View>
            )}
            {deslocamento > 0 && (
              <View style={styles.finRow}>
                <Text style={styles.finLabel}>Deslocamento ({osAtual.deslocamentoKm} km)</Text>
                <Text style={styles.finValor}>R$ {formatarMoeda(deslocamento)}</Text>
              </View>
            )}
            {(maoDeObra > 0 || osAtual.pecas.length > 0 || deslocamento > 0 || buscandoLocal) && (
              <View style={styles.finDivisor} />
            )}
            <View style={styles.finRow}>
              <Text style={styles.finTotalLabel}>TOTAL GERAL</Text>
              <Text style={styles.finTotalValor}>R$ {formatarMoeda(totalGeral)}</Text>
            </View>
          </View>

        </ScrollView>

        {/* Rodapé fixo com as ações */}
        <View style={[styles.footer, { paddingBottom: 20 + insets.bottom }]}>
          <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color={CORES.textoSecundario} />
            <Text style={styles.btnVoltarTxt}>REVISAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnFinalizar, salvando && { opacity: 0.7 }]}
            onPress={handleFinalizar}
            disabled={salvando}
            activeOpacity={0.85}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.btnFinalizarTxt}>FINALIZAR E SALVAR</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F8' },

  contentArea: {
    flex: 1, backgroundColor: '#F0F2F8',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -8,
  },
  scroll: { padding: 20, paddingBottom: 30 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardIcone: {
    width: 26, height: 26, borderRadius: 8, backgroundColor: '#DBEAFE',
    justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  cardTitulo: { fontSize: 12, fontWeight: '800', color: HEADER_BG, letterSpacing: 1 },
  cardValor: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardSub: { fontSize: 13, color: '#666', marginTop: 4, lineHeight: 18 },

  pecaRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  pecaNome: { flex: 1, fontSize: 13, color: '#333' },
  pecaValor: { fontSize: 13, fontWeight: '700', color: HEADER_BG },

  // CARD FINANCEIRO
  cardFinanceiro: {
    backgroundColor: HEADER_BG, borderRadius: 16, padding: 20, marginBottom: 16,
    shadowColor: HEADER_BG, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  finRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  finLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  finValor: { fontSize: 13, color: '#fff', fontWeight: '700' },
  finDivisor: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 12 },
  finTotalLabel: { fontSize: 14, fontWeight: '800', color: '#fff' },
  finTotalValor: { fontSize: 26, fontWeight: '800', color: '#fff' },

  footer: {
    flexDirection: 'row', padding: 20, paddingTop: 12, gap: 10,
    backgroundColor: '#F0F2F8', borderTopWidth: 1, borderTopColor: '#E8E8E8',
  },
  btnFinalizar: {
    flex: 1, backgroundColor: '#22C55E', borderRadius: 12, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#22C55E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  btnFinalizarTxt: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  btnVoltar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  btnVoltarTxt: { color: CORES.textoSecundario, fontWeight: '700', fontSize: 14, marginLeft: 6 },
});
