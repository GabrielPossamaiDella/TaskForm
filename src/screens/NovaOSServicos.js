import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { CORES, ESTILOS_COMUNS, RAIO } from '../styles/temas';

export default function NovaOSServicos({ navigation }) {
  const { osAtual, atualizarOS, adicionarPecaOS } = useApp();
  const [nomePeca, setNomePeca] = useState('');
  const [valorPeca, setValorPeca] = useState('');

  const handleAdicionarPeca = () => {
    if (nomePeca && valorPeca) {
      adicionarPecaOS({ nome: nomePeca, valor: valorPeca, id: Math.random().toString() });
      setNomePeca('');
      setValorPeca('');
    }
  };

  return (
    // KeyboardAvoidingView empurra o conteúdo para cima quando o teclado abre
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.servicoBox}>
          <Text style={styles.label}>Serviço Executado</Text>
          <TextInput 
            style={[ESTILOS_COMUNS.inputModerno, { height: 80, textAlignVertical: 'top' }]} 
            value={osAtual.servico} 
            onChangeText={(txt) => atualizarOS({ servico: txt })} 
            multiline 
          />
        </View>

        <View style={styles.valorBox}>
          <Text style={styles.label}>Valor da Mão de Obra (R$)</Text>
          <TextInput 
            style={ESTILOS_COMUNS.inputModerno} 
            value={String(osAtual.valorMaoDeObra)} 
            onChangeText={(txt) => atualizarOS({ valorMaoDeObra: txt })} 
            keyboardType="numeric" 
          />
        </View>

        <View style={styles.divisor} />

        <Text style={styles.label}>Adicionar Peças / Materiais</Text>
        <View style={styles.row}>
          <TextInput 
            style={[ESTILOS_COMUNS.inputModerno, { flex: 2, marginBottom: 0 }]} 
            placeholder="Peça" 
            value={nomePeca} 
            onChangeText={setNomePeca} 
          />
          <TextInput 
            style={[ESTILOS_COMUNS.inputModerno, { flex: 1, marginLeft: 10, marginBottom: 0 }]} 
            placeholder="R$" 
            value={valorPeca} 
            onChangeText={setValorPeca} 
            keyboardType="numeric" 
          />
        </View>
        
        <TouchableOpacity style={styles.btnAdicionar} onPress={handleAdicionarPeca}>
          <Text style={styles.txtAdicionar}>+ ADICIONAR NA LISTA</Text>
        </TouchableOpacity>

        {osAtual.pecas.map((item) => (
          <View key={item.id} style={styles.itemPeca}>
            <Text style={styles.nomePeca}>{item.nome}</Text>
            <Text style={styles.valorPeca}>R$ {parseFloat(item.valor).toFixed(2)}</Text>
          </View>
        ))}

      </ScrollView>

      {/* Footer Fixo */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[ESTILOS_COMUNS.botaoPadrão, styles.botaoProximo]} 
          onPress={() => navigation.navigate('NovaOSResumo')}
        >
          {/* A cor branca do texto agora aparece pois o fundo é primaria */}
          <Text style={{ color: CORES.branco, fontWeight: 'bold' }}>IR PARA RESUMO</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, backgroundColor: CORES.fundo },
  label: { fontSize: 14, fontWeight: 'bold', color: CORES.textoSecundario, marginTop: 15, marginBottom: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  btnAdicionar: { backgroundColor: CORES.secundaria, padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  txtAdicionar: { color: '#fff', fontWeight: 'bold' },
  itemPeca: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: '#eee' },
  nomePeca: { color: CORES.textoPrincipal },
  valorPeca: { fontWeight: 'bold', color: CORES.sucesso },
  divisor: { height: 1, backgroundColor: '#ddd', marginVertical: 20 },
  servicoBox: { backgroundColor: CORES.branco, borderWidth: 1, borderColor: CORES.secundaria, borderRadius: RAIO ? RAIO.card : 10, padding: 12, marginBottom: 12 },
  valorBox: { backgroundColor: CORES.branco, borderWidth: 1, borderColor: CORES.secundaria, borderRadius: RAIO ? RAIO.card : 10, padding: 12, marginBottom: 12 },
  footer: { padding: 20, backgroundColor: CORES.branco, borderTopWidth: 1, borderColor: '#eee' },
  botaoProximo: { backgroundColor: CORES.primaria, padding: 15, borderRadius: 10, alignItems: 'center' } // Corrigido a cor de fundo
});