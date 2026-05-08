import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';

export default function FormularioOS() {
  const [cliente, setCliente] = useState('');
  const [maquina, setMaquina] = useState('');
  const [pecas, setPecas] = useState('');
  const [servico, setServico] = useState('');

  const handleSalvar = () => {
    // Por enquanto apenas exibe um alerta. Depois vamos ligar isso ao banco de dados offline/Firebase.
    Alert.alert("Sucesso", "Ordem de Serviço salva no sistema!");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Nova Ordem de Serviço</Text>

      <Text style={styles.label}>Cliente / Confecção:</Text>
      <TextInput 
        style={styles.input} 
        value={cliente} 
        onChangeText={setCliente} 
        placeholder="Nome do cliente ou empresa" 
      />

      <Text style={styles.label}>Modelo da Máquina:</Text>
      <TextInput 
        style={styles.input} 
        value={maquina} 
        onChangeText={setMaquina} 
        placeholder="Ex: Sunsure SS-7F" 
      />

      <Text style={styles.label}>Peças Utilizadas:</Text>
      <TextInput 
        style={styles.input} 
        value={pecas} 
        onChangeText={setPecas} 
        placeholder="Anote as peças trocadas" 
      />

      <Text style={styles.label}>Serviço Realizado / Defeito:</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={servico} 
        onChangeText={setServico} 
        placeholder="Descreva o problema e a solução..." 
        multiline={true}
        numberOfLines={4}
      />

      <View style={styles.botaoContainer}>
        <Button title="Salvar Serviço" onPress={handleSalvar} color="#0066cc" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // Faz o texto começar do topo no Android
  },
  botaoContainer: {
    marginTop: 10,
    marginBottom: 40,
  }
});