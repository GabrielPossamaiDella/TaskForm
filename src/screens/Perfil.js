import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CORES, ESTILOS_COMUNS } from '../styles/temas';

export default function Perfil({ navigation }) {

  const handleLogout = () => {
    Alert.alert(
      "Sair do TaskForm",
      "Deseja realmente encerrar a sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            try {
              // Limpa a flag de login no armazenamento offline
              await AsyncStorage.removeItem('@user_logado');
              // Substitui a rota atual pelo Login (impede o 'voltar')
              navigation.replace('Login');
            } catch (e) {
              Alert.alert("Erro", "Não foi possível encerrar a sessão.");
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Cabeçalho do Perfil */}
        <View style={styles.headerPerfil}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>GP</Text>
          </View>
          <Text style={styles.nomeUsuario}>Gabriel Patricio</Text>
          <Text style={styles.cargoUsuario}>Administrador / Técnico</Text>
        </View>

        {/* Informações da Conta */}
        <View style={styles.cardInfo}>
          <Text style={styles.tituloSecao}>Informações da Conta</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.labelInfo}>E-mail:</Text>
            <Text style={styles.valorInfo}>gabriel@tecflex.com.br</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.infoRow}>
            <Text style={styles.labelInfo}>Empresa:</Text>
            <Text style={styles.valorInfo}>Tecflex Sistemas de Costura</Text>
          </View>
        </View>

        {/* Botão de Logout Destacado */}
        <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
          <Text style={styles.textoLogout}>ENCERRAR SESSÃO</Text>
        </TouchableOpacity>

        <Text style={styles.versao}>TaskForm v1.0.0 — Protótipo MVP</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CORES.fundo },
  container: { padding: 20, alignItems: 'center' },
  
  headerPerfil: { 
    alignItems: 'center', 
    marginVertical: 30,
    width: '100%'
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: CORES.primaria, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 15
  },
  avatarTexto: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  nomeUsuario: { fontSize: 24, fontWeight: 'bold', color: CORES.textoPrincipal },
  cargoUsuario: { fontSize: 16, color: CORES.textoSecundario },

  cardInfo: { 
    backgroundColor: '#fff', 
    width: '100%', 
    borderRadius: 15, 
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  tituloSecao: { fontSize: 12, fontWeight: 'bold', color: CORES.secundaria, marginBottom: 15, letterSpacing: 1 },
  infoRow: { marginVertical: 5 },
  labelInfo: { fontSize: 12, color: CORES.placeholder },
  valorInfo: { fontSize: 16, color: CORES.textoPrincipal, fontWeight: '500' },
  divisor: { height: 1, backgroundColor: CORES.cinzaLinha, marginVertical: 10 },

  botaoLogout: { 
    backgroundColor: '#FFF0F0', // Vermelho muito claro
    width: '100%', 
    padding: 18, 
    borderRadius: 15, 
    marginTop: 40, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFC1C1'
  },
  textoLogout: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  versao: { marginTop: 30, fontSize: 12, color: CORES.placeholder }
});