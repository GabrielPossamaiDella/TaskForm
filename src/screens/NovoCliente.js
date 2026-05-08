import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { CORES, ESTILOS_COMUNS } from '../styles/temas';

export default function NovoCliente({ navigation }) {
  const { adicionarCliente } = useApp();
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  const handleSalvar = () => {
    if (!nome) {
      Alert.alert("Erro", "O nome do cliente é obrigatório.");
      return;
    }
    adicionarCliente({ nome, documento, telefone, endereco });
    Alert.alert("Sucesso", "Cliente cadastrado com sucesso!", [{ text: "OK", onPress: () => navigation.goBack() }]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.titulo}>Dados do Cliente</Text>
      
      <Text style={styles.label}>Nome / Razão Social</Text>
      <TextInput style={ESTILOS_COMUNS.input} value={nome} onChangeText={setNome} placeholder="Ex: Hospital São José" />

      <Text style={styles.label}>CPF ou CNPJ</Text>
      <TextInput style={ESTILOS_COMUNS.input} value={documento} onChangeText={setDocumento} keyboardType="numeric" placeholder="000.000.000-00" />

      <Text style={styles.label}>WhatsApp / Telefone</Text>
      <TextInput style={ESTILOS_COMUNS.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholder="(48) 99999-9999" />

      <Text style={styles.label}>Endereço</Text>
      <TextInput style={ESTILOS_COMUNS.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, Número, Bairro..." />

      <TouchableOpacity style={[ESTILOS_COMUNS.botaoPadrão, { backgroundColor: CORES.sucesso, marginTop: 40 }]} onPress={handleSalvar}>
        <Text style={ESTILOS_COMUNS.textoBotao}>CADASTRAR CLIENTE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo, padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: CORES.primaria, marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '600', color: CORES.textoSecundario, marginTop: 20 },
});