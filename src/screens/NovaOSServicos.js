import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES, RAIO } from '../styles/temas';

export default function NovaOSServicos({ navigation }) {
  const { osAtual, atualizarOS, adicionarPecaOS, removerPecaOS } = useApp();
  const [nomePeca, setNomePeca] = useState('');
  const [valorPeca, setValorPeca] = useState('');

  const handleAdicionarPeca = () => {
    if (!nomePeca.trim() || !valorPeca.trim()) return;
    adicionarPecaOS({ nome: nomePeca.trim(), valor: valorPeca, id: `${Date.now()}` });
    setNomePeca('');
    setValorPeca('');
  };

  const handleProximo = () => {
    if (!osAtual.cliente) {
      Alert.alert('Selecione o Cliente', 'Volte e escolha um cliente antes de prosseguir.');
      return;
    }
    navigation.navigate('NovaOSResumo');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.progressoContainer}>
          <View style={styles.passoInativo}><Text style={styles.passoInativoTxt}>1. Cliente</Text></View>
          <View style={styles.passoInativo}><Text style={styles.passoInativoTxt}>2. Equipamento</Text></View>
          <View style={styles.passoAtivo}><Text style={styles.passoAtivoTxt}>3. Serviço</Text></View>
        </View>

        {/* Serviço executado */}
        <View style={styles.card}>
          <Text style={styles.label}>Serviço Executado</Text>
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
          <Text style={styles.label}>Valor da Mão de Obra (R$)</Text>
          <TextInput
            style={styles.input}
            value={String(osAtual.valorMaoDeObra)}
            onChangeText={txt => atualizarOS({ valorMaoDeObra: txt })}
            keyboardType="numeric"
            placeholder="120,00"
            placeholderTextColor={CORES.placeholder}
          />
        </View>

        {/* Peças */}
        <View style={styles.card}>
          <Text style={styles.label}>Peças / Materiais</Text>
          <View style={styles.rowPeca}>
            <TextInput
              style={[styles.input, { flex: 2, marginRight: 8 }]}
              placeholder="Nome da peça"
              placeholderTextColor={CORES.placeholder}
              value={nomePeca}
              onChangeText={setNomePeca}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="R$"
              placeholderTextColor={CORES.placeholder}
              value={valorPeca}
              onChangeText={setValorPeca}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.btnAdicionar} onPress={handleAdicionarPeca}>
            <Ionicons name="add-circle-outline" size={18} color={CORES.secundaria} style={{ marginRight: 6 }} />
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
                    style={styles.btnRemoverPeca}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="trash-2" size={16} color="#DC3545" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color={CORES.textoSecundario} />
          <Text style={styles.btnVoltarTxt}>VOLTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnProximo} onPress={handleProximo}>
          <Text style={styles.btnProximoTxt}>IR PARA RESUMO</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, backgroundColor: CORES.fundo, paddingBottom: 10 },
  progressoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  passoAtivo: { backgroundColor: CORES.primaria, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  passoAtivoTxt: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  passoInativo: { paddingHorizontal: 12, paddingVertical: 6 },
  passoInativoTxt: { color: CORES.placeholder, fontSize: 12 },
  card: {
    backgroundColor: CORES.branco, borderRadius: RAIO.card, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: CORES.divisor, elevation: 1,
  },
  label: { fontSize: 12, fontWeight: 'bold', color: CORES.secundaria, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: CORES.fundo, borderWidth: 1, borderColor: CORES.divisor,
    borderRadius: RAIO.input, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: CORES.textoPrincipal,
  },
  rowPeca: { flexDirection: 'row', marginBottom: 10 },
  btnAdicionar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: CORES.secundaria, borderRadius: RAIO.input,
    padding: 10,
  },
  btnAdicionarTxt: { color: CORES.secundaria, fontWeight: 'bold', fontSize: 13 },
  listaPecas: { marginTop: 12 },
  itemPeca: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderColor: CORES.divisor,
  },
  nomePeca: { fontSize: 14, color: CORES.textoPrincipal, flex: 1, marginRight: 8 },
  valorPecaTxt: { fontSize: 14, fontWeight: 'bold', color: CORES.primaria, marginRight: 10 },
  btnRemoverPeca: { padding: 4 },
  footer: {
    flexDirection: 'row', padding: 16, backgroundColor: CORES.branco,
    borderTopWidth: 1, borderColor: CORES.divisor, gap: 10,
  },
  btnVoltar: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    paddingHorizontal: 14, borderRadius: RAIO.botao, borderWidth: 1, borderColor: CORES.divisor,
  },
  btnVoltarTxt: { color: CORES.textoSecundario, fontWeight: 'bold', marginLeft: 6 },
  btnProximo: {
    flex: 1, backgroundColor: CORES.primaria, borderRadius: RAIO.botao, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  btnProximoTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
