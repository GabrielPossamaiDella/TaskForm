import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { CORES, ESTILOS_COMUNS, RAIO } from '../styles/temas';

export default function NovoCliente({ navigation, route }) {
  const { adicionarCliente, editarCliente } = useApp();
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  // Se veio cliente via rota, estamos editando
  useEffect(() => {
    const cliente = route?.params?.cliente;
    if (cliente) {
      setNome(cliente.nome || '');
      setDocumento(cliente.documento || '');
      setTelefone(cliente.telefone || '');
      setEndereco(cliente.endereco || '');
    }
  }, [route]);

  const onlyDigits = (value) => value.replace(/\D/g, '');

  const formatDocumento = (text) => {
    const digits = onlyDigits(text).slice(0, 14);

    if (digits.length <= 11) {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
      if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    }

    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  };

  const formatTelefone = (text) => {
    const digits = onlyDigits(text).slice(0, 11);

    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleDocumentoChange = (text) => {
    setDocumento(formatDocumento(text));
  };

  const handleTelefoneChange = (text) => {
    setTelefone(formatTelefone(text));
  };

  const handleSalvar = () => {
    if (!nome) {
      Alert.alert("Erro", "O nome do cliente é obrigatório.");
      return;
    }

    const documentoDigits = onlyDigits(documento);
    const telefoneDigits = onlyDigits(telefone);

    // Tornar obrigatórios CPF/CNPJ e telefone
    if (!documento || (documentoDigits.length !== 11 && documentoDigits.length !== 14)) {
      Alert.alert("Erro", "Informe CPF (11 dígitos) ou CNPJ (14 dígitos).");
      return;
    }

    if (!telefone || telefoneDigits.length < 10) {
      Alert.alert("Erro", "Informe um telefone/WhatsApp válido (mínimo 10 dígitos).");
      return;
    }

    const clienteObj = { nome, documento, telefone, endereco };

    // Se estamos editando (route.params.cliente tem id), chamamos editar
    const clienteEditando = route?.params?.cliente;
    if (clienteEditando && clienteEditando.id) {
      editarCliente(clienteEditando.id, clienteObj);
      Alert.alert("Sucesso", "Cliente atualizado com sucesso!", [{ text: "OK", onPress: () => navigation.goBack() }]);
      return;
    }

    adicionarCliente(clienteObj);
    Alert.alert("Sucesso", "Cliente cadastrado com sucesso!", [{ text: "OK", onPress: () => navigation.goBack() }]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40, alignItems: 'center' }}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Dados do Cliente</Text>

        <Text style={styles.label}>Nome / Razão Social</Text>
        <TextInput style={ESTILOS_COMUNS.input} value={nome} onChangeText={setNome} placeholder="Ex: Hospital São José" />

        <Text style={styles.label}>CPF ou CNPJ</Text>
        <TextInput
          style={ESTILOS_COMUNS.input}
          value={documento}
          onChangeText={handleDocumentoChange}
          keyboardType="numeric"
          placeholder="000.000.000-00|00.000.000/0000-00"
          placeholderTextColor={CORES.placeholder}
          maxLength={18}
        />

        <Text style={styles.label}>WhatsApp / Telefone</Text>
        <TextInput
          style={ESTILOS_COMUNS.input}
          value={telefone}
          onChangeText={handleTelefoneChange}
          keyboardType="phone-pad"
          placeholder="(48) 99999-9999"
          maxLength={15}
        />

        <Text style={styles.label}>Endereço</Text>
        <TextInput style={ESTILOS_COMUNS.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, Número, Bairro..." />

        <TouchableOpacity style={[ESTILOS_COMUNS.botaoPadrão, styles.botaoSalvar]} onPress={handleSalvar}>
          <Text style={[ESTILOS_COMUNS.textoBotao, styles.botaoTexto]}>{route?.params?.cliente ? 'SALVAR' : 'CADASTRAR CLIENTE'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo, padding: 20 },
  card: { width: '100%', backgroundColor: CORES.branco, borderRadius: RAIO.card, padding: 20, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: CORES.primaria, marginBottom: 12, textAlign: 'left' },
  label: { fontSize: 14, fontWeight: '600', color: CORES.textoSecundario, marginTop: 16 },
  botaoSalvar: { backgroundColor: CORES.branco, borderWidth: 1, borderColor: CORES.secundaria, marginTop: 24 },
  botaoTexto: { color: CORES.secundaria },
});