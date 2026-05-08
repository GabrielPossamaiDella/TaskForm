import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function Perfil({ navigation }) {
  
  const handleSair = () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da conta?",
      [
        { text: "Cancelar", style: "cancel" },
        // Volta para a tela de Login apagando o histórico
        { text: "Sair", onPress: () => navigation.replace('Login') }
      ]
    );
  };

  const handleSincronizar = () => {
    Alert.alert("Sincronização", "Buscando conexão... As Ordens de Serviço serão enviadas em breve.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>T</Text>
      </View>
      
      <Text style={styles.nome}>Técnico Tecflex</Text>
      <Text style={styles.email}>tecnico@empresa.com</Text>

      <View style={styles.cardInfo}>
        <Text style={styles.infoText}>Ordens Pendentes: 0</Text>
        <Text style={styles.infoText}>Sincronizado hoje às 08:00</Text>
      </View>

      <View style={styles.botoesContainer}>
        <Button title="Sincronizar Dados" onPress={handleSincronizar} color="#0066cc" />
        <View style={styles.espaco} />
        <Button title="Sair da Conta" onPress={handleSair} color="#cc0000" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  cardInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  botoesContainer: {
    width: '100%',
  },
  espaco: {
    height: 15,
  }
});