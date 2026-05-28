import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';
import StepProgress from '../components/StepProgress';

const HEADER_BG = '#1A237E';

export default function NovaOSServicos({ navigation }) {
  const { osAtual, atualizarOS, adicionarPecaOS, removerPecaOS } = useApp();
  const insets = useSafeAreaInsets();
  const [nomePeca, setNomePeca] = useState('');
  const [valorPeca, setValorPeca] = useState('');

  const handleAdicionarPeca = () => {
    if (!nomePeca.trim() || !valorPeca.trim()) return;
    adicionarPecaOS({ nome: nomePeca.trim(), valor: valorPeca, id: `${Date.now()}` });
    setNomePeca('');
    setValorPeca('');
  };

  const handleProximo = () => {
    navigation.navigate('NovaOSResumo');
  };

  const totalPecas = osAtual.pecas.reduce((a, p) => a + parseFloat(p.valor || 0), 0);
  const maoDeObra = parseFloat(osAtual.valorMaoDeObra || 0);

  return (
    <View style={styles.safe}>
      <View style={{ backgroundColor: HEADER_BG, paddingTop: insets.top }}>
        <StepProgress current={3} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <View style={styles.contentArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            {/* Serviço executado */}
            <View style={styles.card}>
              <View style={styles.cardTituloRow}>
                <View style={styles.cardIcone}>
                  <Ionicons name="build-outline" size={13} color={HEADER_BG} />
                </View>
                <Text style={styles.cardTitulo}>SERVIÇO EXECUTADO</Text>
              </View>
              <TextInput
                style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
                value={osAtual.servico}
                onChangeText={txt => atualizarOS({ servico: txt })}
                multiline
                placeholder="Descreva o serviço realizado..."
                placeholderTextColor={CORES.placeholder}
              />
            </View>

            {/* Mão de obra */}
            <View style={styles.card}>
              <View style={styles.cardTituloRow}>
                <View style={styles.cardIcone}>
                  <Ionicons name="cash-outline" size={13} color={HEADER_BG} />
                </View>
                <Text style={styles.cardTitulo}>VALOR DA MÃO DE OBRA</Text>
              </View>
              <TextInput
                style={styles.input}
                value={String(osAtual.valorMaoDeObra)}
                onChangeText={txt => atualizarOS({ valorMaoDeObra: txt })}
                keyboardType="numeric"
                placeholder="0,00"
                placeholderTextColor={CORES.placeholder}
              />
            </View>

            {/* Peças */}
            <View style={styles.card}>
              <View style={styles.cardTituloRow}>
                <View style={styles.cardIcone}>
                  <Ionicons name="construct-outline" size={13} color={HEADER_BG} />
                </View>
                <Text style={styles.cardTitulo}>PEÇAS / MATERIAIS</Text>
              </View>

              <View style={styles.rowAddPeca}>
                <TextInput
                  style={[styles.input, { flex: 2, marginRight: 8 }]}
                  placeholder="Nome da peça"
                  placeholderTextColor={CORES.placeholder}
                  value={nomePeca}
                  onChangeText={setNomePeca}
                />
                <TextInput
                  style={[styles.input, { width: 90 }]}
                  placeholder="R$"
                  placeholderTextColor={CORES.placeholder}
                  value={valorPeca}
                  onChangeText={setValorPeca}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.btnAdicionar} onPress={handleAdicionarPeca}>
                <Ionicons name="add-circle-outline" size={16} color={HEADER_BG} style={{ marginRight: 6 }} />
                <Text style={styles.btnAdicionarTxt}>ADICIONAR NA LISTA</Text>
              </TouchableOpacity>

              {osAtual.pecas.length > 0 && (
                <View style={styles.listaPecas}>
                  {osAtual.pecas.map((item) => (
                    <View key={item.id} style={styles.itemPeca}>
                      <Text style={styles.nomePeca} numberOfLines={1}>{item.nome}</Text>
                      <Text style={styles.valorPecaTxt}>R$ {parseFloat(item.valor).toFixed(2)}</Text>
                      <TouchableOpacity
                        onPress={() => removerPecaOS(item.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={{ marginLeft: 8 }}
                      >
                        <Feather name="trash-2" size={15} color="#DC3545" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Mini resumo */}
            {(maoDeObra > 0 || osAtual.pecas.length > 0) && (
              <View style={styles.cardResumo}>
                <View style={styles.resumoRow}>
                  <Text style={styles.resumoLabel}>Mão de obra</Text>
                  <Text style={styles.resumoValor}>R$ {maoDeObra.toFixed(2)}</Text>
                </View>
                {osAtual.pecas.length > 0 && (
                  <View style={styles.resumoRow}>
                    <Text style={styles.resumoLabel}>Peças ({osAtual.pecas.length})</Text>
                    <Text style={styles.resumoValor}>R$ {totalPecas.toFixed(2)}</Text>
                  </View>
                )}
                <View style={styles.resumoDivisor} />
                <View style={styles.resumoRow}>
                  <Text style={styles.resumoTotalLabel}>TOTAL PARCIAL</Text>
                  <Text style={styles.resumoTotalValor}>R$ {(maoDeObra + totalPecas).toFixed(2)}</Text>
                </View>
              </View>
            )}

          </ScrollView>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color={CORES.textoSecundario} />
            <Text style={styles.btnVoltarTxt}>VOLTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnProximo} onPress={handleProximo}>
            <Text style={styles.btnProximoTxt}>IR PARA RESUMO</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F8' },
  kav: { flex: 1 },

  contentArea: {
    flex: 1, backgroundColor: '#F0F2F8',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -8,
  },
  scroll: { padding: 20, paddingBottom: 10 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardIcone: {
    width: 26, height: 26, borderRadius: 8, backgroundColor: '#EEF0FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  cardTitulo: { fontSize: 10, fontWeight: '800', color: HEADER_BG, letterSpacing: 1 },

  input: {
    backgroundColor: '#F8F8F8', borderWidth: 1, borderColor: '#E8E8E8',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: CORES.textoPrincipal,
  },
  rowAddPeca: { flexDirection: 'row', marginBottom: 10 },
  btnAdicionar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: HEADER_BG, borderRadius: 12,
    padding: 11, borderStyle: 'dashed',
  },
  btnAdicionarTxt: { color: HEADER_BG, fontWeight: '700', fontSize: 13 },

  listaPecas: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 8 },
  itemPeca: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  nomePeca: { flex: 1, fontSize: 14, color: '#333' },
  valorPecaTxt: { fontSize: 14, fontWeight: '700', color: HEADER_BG },

  cardResumo: {
    backgroundColor: HEADER_BG, borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: HEADER_BG, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  resumoLabel: { fontSize: 13, color: 'rgba(255,255,255,0.55)' },
  resumoValor: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  resumoDivisor: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 8 },
  resumoTotalLabel: { fontSize: 13, fontWeight: '800', color: '#fff' },
  resumoTotalValor: { fontSize: 16, fontWeight: '800', color: '#fff' },

  footer: {
    flexDirection: 'row', padding: 20, paddingTop: 12, gap: 10,
    backgroundColor: '#F0F2F8', borderTopWidth: 1, borderTopColor: '#E8E8E8',
  },
  btnVoltar: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  btnVoltarTxt: { color: CORES.textoSecundario, fontWeight: '700', marginLeft: 6 },
  btnProximo: {
    flex: 1, backgroundColor: HEADER_BG, borderRadius: 12, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  btnProximoTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
