import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { CORES, ESTILOS_COMUNS } from '../styles/temas';

export default function DetalhesOS({ route, navigation }) {
  const { osSelecionada } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho de Status */}
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.labelStatus}>STATUS DA ORDEM</Text>
            <Text style={styles.dataText}>Realizada em {osSelecionada.data}</Text>
          </View>
          <View style={styles.badgeConcluido}>
            <Text style={styles.textoBadge}>CONCLUÍDA</Text>
          </View>
        </View>

        {/* Card Principal: Cliente e Equipamento */}
        <View style={styles.cardPrincipal}>
          <View style={styles.section}>
            <Text style={styles.labelCard}>CLIENTE</Text>
            <Text style={styles.infoNome}>{osSelecionada.cliente?.nome || "Cliente Avulso"}</Text>
            <Text style={styles.infoSub}>{osSelecionada.cliente?.documento || "Documento não informado"}</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.section}>
            <Text style={styles.labelCard}>EQUIPAMENTO</Text>
            <Text style={styles.infoDestaque}>{osSelecionada.maquina}</Text>
            <Text style={styles.labelInterno}>Defeito/Serviço Executado:</Text>
            <Text style={styles.infoTexto}>{osSelecionada.servico || osSelecionada.defeito}</Text>
          </View>
        </View>

        {/* Listagem de Peças com visual de Cupom */}
        <View style={styles.secaoPecas}>
          <Text style={styles.tituloSecao}>Peças e Materiais</Text>
          {osSelecionada.pecas && osSelecionada.pecas.length > 0 ? (
            osSelecionada.pecas.map((item, index) => (
              <View key={index} style={styles.linhaPeca}>
                <Text style={styles.nomePeca}>{item.nome}</Text>
                <Text style={styles.valorPeca}>R$ {parseFloat(item.valor).toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.textoVazio}>Nenhuma peça utilizada neste atendimento.</Text>
          )}
        </View>

        {/* Resumo Financeiro Destacado */}
        <View style={styles.cardFinanceiro}>
          <View style={styles.linhaFinanceira}>
            <Text style={styles.labelFin}>Mão de Obra</Text>
            <Text style={styles.valorFin}>R$ {parseFloat(osSelecionada.valorMaoDeObra || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.linhaFinanceira}>
            <Text style={styles.labelFin}>Total Peças</Text>
            <Text style={styles.valorFin}>
              R$ {(osSelecionada.pecas?.reduce((acc, p) => acc + parseFloat(p.valor), 0) || 0).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.divisor, { backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 }]} />
          <View style={styles.linhaFinanceira}>
            <Text style={styles.labelTotal}>TOTAL GERAL</Text>
            <Text style={styles.valorTotal}>R$ {parseFloat(osSelecionada.total).toFixed(2)}</Text>
          </View>
        </View>

        {/* Botão de Retorno */}
        <TouchableOpacity 
          style={[ESTILOS_COMUNS.botaoPadrão, styles.botaoVoltar]}
          onPress={() => navigation.goBack()}
        >
          <Text style={ESTILOS_COMUNS.textoBotao}>VOLTAR AO PAINEL</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CORES.fundo },
  container: { flex: 1, padding: 20 },
  
  statusHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  labelStatus: { fontSize: 10, fontWeight: 'bold', color: CORES.textoSecundario, letterSpacing: 1 },
  dataText: { fontSize: 14, color: CORES.textoPrincipal, marginTop: 2 },
  badgeConcluido: { 
    backgroundColor: CORES.sucesso, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  textoBadge: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  cardPrincipal: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 20, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  section: { marginVertical: 5 },
  labelCard: { fontSize: 11, fontWeight: 'bold', color: CORES.secundaria, marginBottom: 5 },
  infoNome: { fontSize: 20, fontWeight: 'bold', color: CORES.primaria },
  infoSub: { fontSize: 13, color: CORES.textoSecundario, marginTop: 2 },
  infoDestaque: { fontSize: 18, fontWeight: '700', color: CORES.textoPrincipal },
  labelInterno: { fontSize: 12, fontWeight: 'bold', color: CORES.textoSecundario, marginTop: 15 },
  infoTexto: { fontSize: 15, color: CORES.textoPrincipal, lineHeight: 22, marginTop: 5 },
  divisor: { height: 1, backgroundColor: CORES.cinzaLinha, marginVertical: 15 },

  secaoPecas: { marginTop: 30 },
  tituloSecao: { fontSize: 16, fontWeight: 'bold', color: CORES.textoPrincipal, marginBottom: 15 },
  linhaPeca: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: CORES.secundaria
  },
  nomePeca: { fontSize: 14, color: CORES.textoPrincipal },
  valorPeca: { fontSize: 14, fontWeight: 'bold', color: CORES.textoPrincipal },
  textoVazio: { fontStyle: 'italic', color: CORES.placeholder, textAlign: 'center' },

  cardFinanceiro: { 
    backgroundColor: CORES.primaria, 
    borderRadius: 15, 
    padding: 25, 
    marginTop: 30,
    elevation: 6
  },
  linhaFinanceira: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  labelFin: { color: '#fff', opacity: 0.7, fontSize: 14 },
  valorFin: { color: '#fff', fontSize: 14, fontWeight: '600' },
  labelTotal: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  valorTotal: { color: CORES.sucesso, fontWeight: 'bold', fontSize: 28 },

  botaoVoltar: { backgroundColor: CORES.secundaria, marginTop: 30 }
});