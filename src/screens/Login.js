import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { CORES, ESTILOS_COMUNS } from '../styles/temas';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Placeholder para a logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>TECFLEX</Text>
          <Text style={styles.logoSubtext}>Sistemas de Costura</Text>
        </View>

        <Text style={styles.boasVindas}>Bem-vindo, Técnico!</Text>
        <Text style={styles.instrucao}>Faça login para gerenciar suas OS</Text>

        <TextInput 
          style={ESTILOS_COMUNS.input} 
          placeholder="Seu e-mail cadastrado" 
          placeholderTextColor={CORES.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput 
          style={[ESTILOS_COMUNS.input, { marginTop: 15 }]} 
          placeholder="Sua senha" 
          placeholderTextColor={CORES.placeholder}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[ESTILOS_COMUNS.botaoPadrão, styles.botaoEntrar]} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={ESTILOS_COMUNS.textoBotao}>ENTRAR NO SISTEMA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.esqueciSenha}>
          <Text style={styles.textoEsqueciSenha}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.branco },
  content: { flex: 1, justifyContent: 'center', padding: 30 },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  logoText: { fontSize: 36, fontWeight: 'bold', color: CORES.primaria, letterSpacing: 2 },
  logoSubtext: { fontSize: 14, color: CORES.secundaria, marginTop: -5 },
  boasVindas: { fontSize: 24, fontWeight: 'bold', color: CORES.textoPrincipal },
  instrucao: { fontSize: 16, color: CORES.textoSecundario, marginBottom: 30, marginTop: 5 },
  botaoEntrar: { backgroundColor: CORES.primaria, marginTop: 30 },
  esqueciSenha: { marginTop: 20, alignItems: 'center' },
  textoEsqueciSenha: { color: CORES.textoSecundario, textDecorationLine: 'underline' }
});