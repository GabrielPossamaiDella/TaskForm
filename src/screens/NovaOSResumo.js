import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { CORES, ESTILOS_COMUNS } from '../styles/temas';

export default function NovaOSResumo({ navigation }) {
  const { osAtual, finalizarOS } = useApp();

  // Cálculo da soma das peças
  const totalPecas = osAtual.pecas.reduce((acc, p) => acc + parseFloat(p.valor || 0), 0);
  const totalGeral = parseFloat(osAtual.valorMaoDeObra || 0) + totalPecas;

  const handleFinalizar = () => {
    finalizarOS();
    Alert.alert("Sucesso", "Ordem de Serviço finalizada!", [{ text: "OK", onPress: () => navigation.navigate('Home') }]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Resumo Financeiro</Text>

      <View style={styles.card}>
        <View style={styles.linha}>
          <Text style={styles.txtLabel}>Mão de Obra:</Text>
          <Text style={styles.txtValor}>R$ {parseFloat(osAtual.valorMaoDeObra).toFixed(2)}</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.txtLabel}>Total em Peças ({osAtual.pecas.length}):</Text>
          <Text style={styles.txtValor}>R$ {totalPecas.toFixed(2)}</Text>
        </View>

        <View style={[styles.linha, styles.linhaTotal]}>
          <Text style={styles.txtTotalLabel}>TOTAL GERAL:</Text>
          <Text style={styles.txtTotalValor}>R$ {totalGeral.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.labelSub}>Detalhamento das Peças:</Text>
      {osAtual.pecas.map(p => (
        <Text key={p.id} style={styles.txtDetalhe}>• {p.nome}: R$ {parseFloat(p.valor).toFixed(2)}</Text>
      ))}

      <TouchableOpacity style={styles.btnFinalizar} onPress={handleFinalizar}>
        <Text style={ESTILOS_COMUNS.textoBotao}>FINALIZAR E SALVAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo, padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: CORES.primaria, marginBottom: 20 },
  card: { backgroundColor: CORES.primaria, padding: 20, borderRadius: 12, elevation: 5 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  txtLabel: { color: '#fff', opacity: 0.8 },
  txtValor: { color: '#fff', fontWeight: 'bold' },
  linhaTotal: { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.2)', paddingTop: 15, marginTop: 5 },
  txtTotalLabel: { color: CORES.sucesso, fontWeight: 'bold', fontSize: 18 },
  txtTotalValor: { color: CORES.sucesso, fontWeight: 'bold', fontSize: 22 },
  labelSub: { fontSize: 14, fontWeight: 'bold', color: CORES.textoSecundario, marginTop: 25, marginBottom: 10 },
  txtDetalhe: { fontSize: 14, color: CORES.textoPrincipal, marginBottom: 5 },
  btnFinalizar: { backgroundColor: CORES.sucesso, padding: 18, borderRadius: 10, marginTop: 40, alignItems: 'center' }
});