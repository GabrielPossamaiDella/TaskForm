import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES, RAIO } from '../styles/temas';

const DEFEITOS_COMUNS = [
  'Ponto pulando', 'Quebrando agulha', 'Linha arrebentando',
  'Barulho anormal', 'Máquina travada', 'Tensão irregular',
];

export default function NovaOSEquipamento({ navigation }) {
  const { osAtual, atualizarOS } = useApp();
  const [maquina, setMaquina] = useState(osAtual.maquina || '');
  const [defeito, setDefeito] = useState(osAtual.defeito || '');

  const selecionarTag = (tag) => setDefeito(prev => prev ? `${prev}, ${tag}` : tag);

  const proximo = () => {
    if (!maquina.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o modelo da máquina antes de prosseguir.');
      return;
    }
    atualizarOS({ maquina, defeito });
    navigation.navigate('NovaOSServicos');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.progressoContainer}>
        <View style={styles.passoInativo}><Text style={styles.passoInativoTxt}>1. Cliente</Text></View>
        <View style={styles.passoAtivo}><Text style={styles.passoAtivoTxt}>2. Equipamento</Text></View>
        <View style={styles.passoInativo}><Text style={styles.passoInativoTxt}>3. Serviço</Text></View>
      </View>

      {/* Máquina */}
      <View style={styles.card}>
        <View style={styles.labelRow}>
          <Ionicons name="settings-outline" size={16} color={CORES.secundaria} />
          <Text style={styles.label}>Modelo da Máquina *</Text>
        </View>
        <TextInput
          style={styles.input}
          value={maquina}
          onChangeText={setMaquina}
          placeholder="Ex: Reta Eletrônica Sunsure SS-550"
          placeholderTextColor={CORES.placeholder}
        />
      </View>

      {/* Defeito */}
      <View style={styles.card}>
        <View style={styles.labelRow}>
          <Ionicons name="alert-circle-outline" size={16} color={CORES.secundaria} />
          <Text style={styles.label}>Defeito / Reclamação</Text>
        </View>
        <Text style={styles.sublabel}>Toque para adicionar defeitos comuns:</Text>
        <View style={styles.tagsContainer}>
          {DEFEITOS_COMUNS.map(tag => (
            <TouchableOpacity key={tag} style={styles.tag} onPress={() => selecionarTag(tag)}>
              <Text style={styles.tagTxt}>+ {tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top', marginTop: 10 }]}
          value={defeito}
          onChangeText={setDefeito}
          placeholder="Descreva o problema detalhadamente..."
          placeholderTextColor={CORES.placeholder}
          multiline
        />
      </View>

      {/* Botões */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color={CORES.textoSecundario} />
          <Text style={styles.btnVoltarTxt}>VOLTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnProximo} onPress={proximo}>
          <Text style={styles.btnProximoTxt}>PRÓXIMO</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo, padding: 20 },
  progressoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  passoAtivo: { backgroundColor: CORES.primaria, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  passoAtivoTxt: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  passoInativo: { paddingHorizontal: 12, paddingVertical: 6 },
  passoInativoTxt: { color: CORES.placeholder, fontSize: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: RAIO.card,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: CORES.divisor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: 'bold', color: CORES.secundaria, marginLeft: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  sublabel: { fontSize: 12, color: CORES.placeholder, marginBottom: 8 },
  input: {
    backgroundColor: CORES.fundo,
    borderWidth: 1,
    borderColor: CORES.divisor,
    borderRadius: RAIO.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: CORES.textoPrincipal,
  },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    backgroundColor: CORES.lightPurple,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, marginRight: 8, marginBottom: 8,
    borderWidth: 1, borderColor: CORES.secundaria,
  },
  tagTxt: { color: CORES.secundaria, fontSize: 12, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: 10, marginTop: 6 },
  btnVoltar: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14,
    borderRadius: RAIO.botao, borderWidth: 1, borderColor: CORES.divisor,
  },
  btnVoltarTxt: { color: CORES.textoSecundario, fontWeight: 'bold', marginLeft: 6 },
  btnProximo: {
    flex: 1, backgroundColor: CORES.primaria, borderRadius: RAIO.botao, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  btnProximoTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
