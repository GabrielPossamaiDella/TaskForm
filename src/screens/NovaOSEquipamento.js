import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { CORES, ESTILOS_COMUNS } from '../styles/temas';

const DEFEITOS_COMUNS = ["Ponto pulando", "Quebrando agulha", "Linha arrebentando", "Barulho anormal", "Máquina travada"];

export default function NovaOSEquipamento({ navigation }) {
  const { osAtual, atualizarOS } = useApp();
  const [maquina, setMaquina] = useState(osAtual.maquina || '');
  const [defeito, setDefeito] = useState(osAtual.defeito || '');

  const selecionarTag = (tag) => {
    setDefeito(prev => prev ? `${prev}, ${tag}` : tag);
  };

  const proximo = () => {
    if (!maquina || maquina.trim().length === 0) {
      Alert.alert('Erro', 'Informe o nome da máquina antes de prosseguir.');
      return;
    }

    atualizarOS({ maquina, defeito });
    navigation.navigate('NovaOSServicos');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressoContainer}>
        <Text style={styles.passoInativo}>Cliente</Text>
        <Text style={styles.passoAtivo}>Equipamento</Text>
        <Text style={styles.passoInativo}>Serviço</Text>
      </View>

      <Text style={styles.label}>Qual a máquina?</Text>
      <TextInput style={ESTILOS_COMUNS.input} value={maquina} onChangeText={setMaquina} placeholder="Ex: Reta Eletrônica Sunsure" />

      <Text style={styles.label}>Defeito Reclamado</Text>
      <View style={styles.containerTags}>
        {DEFEITOS_COMUNS.map(item => (
          <TouchableOpacity key={item} style={styles.tag} onPress={() => selecionarTag(item)}>
            <Text style={styles.textoTag}>+ {item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput 
        style={[ESTILOS_COMUNS.input, { height: 100, textAlignVertical: 'top' }]} 
        value={defeito} onChangeText={setDefeito} 
        placeholder="Descreva o problema detalhadamente..." 
        multiline 
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Text style={styles.textoVoltar}>VOLTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoProximo} onPress={proximo}>
          <Text style={ESTILOS_COMUNS.textoBotao}>PRÓXIMO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo, padding: 20 },
  progressoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, backgroundColor: CORES.branco, padding: 10, borderRadius: 10 },
  passoAtivo: { color: CORES.primaria, fontWeight: 'bold', fontSize: 12 },
  passoInativo: { color: CORES.placeholder, fontSize: 12 },
  label: { fontSize: 18, fontWeight: 'bold', color: CORES.textoPrincipal, marginTop: 10 },
  containerTags: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 15 },
  tag: { backgroundColor: '#E8F0FE', padding: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: CORES.secundaria },
  textoTag: { color: CORES.secundaria, fontSize: 12, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 40 },
  botaoVoltar: { flex: 1, marginRight: 10, padding: 15, alignItems: 'center', justifyContent: 'center' },
  botaoProximo: { flex: 2, backgroundColor: CORES.primaria, borderRadius: 10, padding: 15, alignItems: 'center' },
  textoVoltar: { color: CORES.textoSecundario, fontWeight: 'bold' }
});