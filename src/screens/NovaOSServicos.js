import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useApp } from '../context/AppContext';
import { CORES, ESTILOS_COMUNS } from '../styles/temas';

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
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Serviço Executado</Text>
        <TextInput 
          style={[ESTILOS_COMUNS.input, { height: 80 }]} 
          value={osAtual.servico} 
          onChangeText={(txt) => atualizarOS({ servico: txt })} 
          multiline 
        />

        <Text style={styles.label}>Valor da Mão de Obra (R$)</Text>
        <TextInput 
          style={ESTILOS_COMUNS.input} 
          value={String(osAtual.valorMaoDeObra)} 
          onChangeText={(txt) => atualizarOS({ valorMaoDeObra: txt })} 
          keyboardType="numeric" 
        />

        <View style={styles.divisor} />

        <Text style={styles.label}>Adicionar Peças / Materiais</Text>
        <View style={styles.row}>
          <TextInput 
            style={[ESTILOS_COMUNS.input, { flex: 2 }]} 
            placeholder="Peça" 
            value={nomePeca} 
            onChangeText={setNomePeca} 
          />
          <TextInput 
            style={[ESTILOS_COMUNS.input, { flex: 1, marginLeft: 10 }]} 
            placeholder="R$" 
            value={valorPeca} 
            onChangeText={setValorPeca} 
            keyboardType="numeric" 
          />
        </View>
        
        <TouchableOpacity style={styles.btnAdicionar} onPress={handleAdicionarPeca}>
          <Text style={styles.txtAdicionar}>+ ADICIONAR NA LISTA</Text>
        </TouchableOpacity>

        {/* Lista de peças adicionadas */}
        {osAtual.pecas.map((item) => (
          <View key={item.id} style={styles.itemPeca}>
            <Text style={styles.nomePeca}>{item.nome}</Text>
            <Text style={styles.valorPeca}>R$ {parseFloat(item.valor).toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.botaoProximo} onPress={() => navigation.navigate('NovaOSResumo')}>
          <Text style={ESTILOS_COMUNS.textoBotao}>IR PARA RESUMO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo, padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: CORES.textoSecundario, marginTop: 15 },
  row: { flexDirection: 'row' },
  btnAdicionar: { backgroundColor: CORES.secundaria, padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  txtAdicionar: { color: '#fff', fontWeight: 'bold' },
  itemPeca: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: '#eee' },
  nomePeca: { color: CORES.textoPrincipal },
  valorPeca: { fontWeight: 'bold', color: CORES.sucesso },
  divisor: { height: 1, backgroundColor: '#ddd', marginVertical: 20 },
  footer: { paddingVertical: 10, borderTopWidth: 1, borderColor: '#ddd' },
  botaoProximo: { backgroundColor: CORES.primaria, padding: 15, borderRadius: 10, alignItems: 'center' }
});