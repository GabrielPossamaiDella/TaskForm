import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';

export default function NovaOSResumo({ navigation }) {
  const { osAtual, finalizarOS } = useApp();

  const calcularTotalPecas = () => {
    return osAtual.pecas.reduce((acc, peca) => acc + parseFloat(peca.valor || 0), 0);
  };

  const totalPecas = calcularTotalPecas();
  const maoDeObra = parseFloat(osAtual.valorMaoDeObra || 0);
  const totalGeral = maoDeObra + totalPecas;

  const handleFinalizar = async () => {
    try {
      await finalizarOS();
      Alert.alert('Sucesso', 'Ordem de Serviço salva com sucesso!');
      navigation.navigate('Painel'); // Volta para a aba principal
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a OS.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.titulo}>Resumo Financeiro</Text>

        <View style={styles.cardFinanceiro}>
          <View style={styles.linhaResumo}>
            <Text style={styles.textoLinha}>Mão de Obra:</Text>
            <Text style={styles.valorLinha}>R$ {maoDeObra.toFixed(2)}</Text>
          </View>
          
          <View style={styles.linhaResumo}>
            <Text style={styles.textoLinha}>Total em Peças ({osAtual.pecas.length}):</Text>
            <Text style={styles.valorLinha}>R$ {totalPecas.toFixed(2)}</Text>
          </View>

          <View style={styles.divisorBlue} />

          <View style={styles.linhaTotal}>
            <Text style={styles.textoTotal}>TOTAL GERAL:</Text>
            <Text style={styles.valorTotal}>R$ {totalGeral.toFixed(2)}</Text>
          </View>
        </View>

        {osAtual.pecas.length > 0 && (
          <View style={styles.detalhamento}>
            <Text style={styles.labelDetalhe}>Detalhamento das Peças:</Text>
            {osAtual.pecas.map((peca, index) => (
              <Text key={index} style={styles.textoPeca}>
                • {peca.nome}: R$ {parseFloat(peca.valor).toFixed(2)}
              </Text>
            ))}
          </View>
        )}

        {/* AQUI ESTÁ A CORREÇÃO DO BOTÃO FANTASMA */}
        <TouchableOpacity style={styles.botaoFinalizarAbsoluto} onPress={handleFinalizar}>
          <Text style={styles.textoBotaoBranco}>FINALIZAR E SALVAR</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CORES.fundo },
  container: { padding: 20, flexGrow: 1 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: CORES.primaria, marginBottom: 15 },
  cardFinanceiro: { backgroundColor: CORES.primaria, borderRadius: 12, padding: 20, elevation: 4 },
  linhaResumo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  textoLinha: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  valorLinha: { color: CORES.branco, fontSize: 14, fontWeight: 'bold' },
  divisorBlue: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
  linhaTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textoTotal: { color: CORES.branco, fontSize: 16, fontWeight: 'bold' },
  valorTotal: { color: CORES.branco, fontSize: 22, fontWeight: 'bold' },
  detalhamento: { marginTop: 20 },
  labelDetalhe: { fontSize: 14, fontWeight: 'bold', color: CORES.textoSecundario, marginBottom: 10 },
  textoPeca: { fontSize: 14, color: CORES.textoPrincipal, marginBottom: 5 },
  
  // Estilo blindado para o botão não sumir
  botaoFinalizarAbsoluto: {
    backgroundColor: CORES.secundaria, // Roxo do Figma
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 40,
    elevation: 3, // Dá uma sombrinha
  },
  textoBotaoBranco: {
    color: '#FFFFFF', // Força o branco puro
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1
  }
});