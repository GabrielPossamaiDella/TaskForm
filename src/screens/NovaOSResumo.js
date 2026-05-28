import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES, RAIO } from '../styles/temas';

export default function NovaOSResumo({ navigation }) {
  const { osAtual, finalizarOS } = useApp();
  const [salvando, setSalvando] = useState(false);

  const totalPecas = osAtual.pecas.reduce((acc, p) => acc + parseFloat(p.valor || 0), 0);
  const maoDeObra = parseFloat(osAtual.valorMaoDeObra || 0);
  const totalGeral = maoDeObra + totalPecas;

  const handleFinalizar = async () => {
    if (!osAtual.cliente) {
      Alert.alert('Cliente obrigatório', 'Selecione um cliente antes de finalizar a OS.');
      return;
    }
    setSalvando(true);
    try {
      await finalizarOS();
      Alert.alert('Sucesso', 'Ordem de Serviço salva com sucesso!');
      navigation.navigate('Home', { screen: 'Painel' });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a OS.');
    } finally {
      setSalvando(false);
    }
  };

  const LinhaResumo = ({ label, valor, destaque }) => (
    <View style={styles.linhaResumo}>
      <Text style={[styles.linhaLabel, destaque && styles.linhaLabelDestaque]}>{label}</Text>
      <Text style={[styles.linhaValor, destaque && styles.linhaValorDestaque]}>{valor}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Confirmação do cliente e equipamento */}
        <View style={styles.card}>
          <View style={styles.cardTituloRow}>
            <Ionicons name="person-outline" size={16} color={CORES.secundaria} />
            <Text style={styles.cardTitulo}>CLIENTE</Text>
          </View>
          <Text style={styles.cardValor}>{osAtual.cliente?.nome || 'Não selecionado'}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTituloRow}>
            <Ionicons name="settings-outline" size={16} color={CORES.secundaria} />
            <Text style={styles.cardTitulo}>EQUIPAMENTO</Text>
          </View>
          <Text style={styles.cardValor}>{osAtual.maquina || '—'}</Text>
          {osAtual.defeito ? <Text style={styles.cardSub}>{osAtual.defeito}</Text> : null}
        </View>

        {/* Financeiro */}
        <View style={styles.cardFinanceiro}>
          <Text style={styles.financeiroTitulo}>RESUMO FINANCEIRO</Text>

          <LinhaResumo label="Mão de Obra" valor={`R$ ${maoDeObra.toFixed(2)}`} />
          <LinhaResumo label={`Peças (${osAtual.pecas.length})`} valor={`R$ ${totalPecas.toFixed(2)}`} />

          <View style={styles.divisor} />

          <LinhaResumo label="TOTAL GERAL" valor={`R$ ${totalGeral.toFixed(2)}`} destaque />
        </View>

        {/* Detalhamento de peças */}
        {osAtual.pecas.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardTituloRow}>
              <Ionicons name="construct-outline" size={16} color={CORES.secundaria} />
              <Text style={styles.cardTitulo}>DETALHAMENTO DAS PEÇAS</Text>
            </View>
            {osAtual.pecas.map((p, i) => (
              <View key={p.id || i} style={styles.itemPeca}>
                <Text style={styles.nomePeca}>{p.nome}</Text>
                <Text style={styles.valorPeca}>R$ {parseFloat(p.valor).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.btnFinalizar, salvando && { opacity: 0.7 }]}
          onPress={handleFinalizar}
          disabled={salvando}
        >
          {salvando
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.btnFinalizarTxt}>FINALIZAR E SALVAR</Text>
              </>
          }
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CORES.fundo },
  container: { padding: 20, flexGrow: 1 },
  card: {
    backgroundColor: CORES.branco, borderRadius: RAIO.card, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: CORES.divisor, elevation: 1,
  },
  cardTituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitulo: { fontSize: 11, fontWeight: 'bold', color: CORES.secundaria, letterSpacing: 1, marginLeft: 6 },
  cardValor: { fontSize: 16, fontWeight: 'bold', color: CORES.textoPrincipal },
  cardSub: { fontSize: 13, color: CORES.textoSecundario, marginTop: 4 },

  cardFinanceiro: {
    backgroundColor: CORES.primaria, borderRadius: RAIO.card, padding: 20,
    marginBottom: 12, elevation: 2,
  },
  financeiroTitulo: { fontSize: 11, fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 16 },
  linhaResumo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  linhaLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  linhaValor: { fontSize: 14, color: CORES.branco, fontWeight: '600' },
  linhaLabelDestaque: { fontSize: 16, color: CORES.branco, fontWeight: 'bold' },
  linhaValorDestaque: { fontSize: 22, color: CORES.branco, fontWeight: 'bold' },
  divisor: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 12 },

  itemPeca: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6, borderBottomWidth: 1, borderColor: CORES.divisor,
  },
  nomePeca: { fontSize: 14, color: CORES.textoPrincipal, flex: 1 },
  valorPeca: { fontSize: 14, fontWeight: '600', color: CORES.primaria },

  btnFinalizar: {
    backgroundColor: CORES.secundaria, borderRadius: RAIO.botao, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 10, elevation: 2,
  },
  btnFinalizarTxt: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
});
