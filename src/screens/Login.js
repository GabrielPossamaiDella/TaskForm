// src/screens/Login.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CORES, RAIO } from '../styles/temas';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('gabriel@tecflex.com.br');
  const [senha, setSenha] = useState('admin123');

  useEffect(() => {
    verificarLogin();
  }, []);

  const verificarLogin = async () => {
    const logado = await AsyncStorage.getItem('@user_logado');
    if (logado === 'true') {
      navigation.replace('Home');
    }
  };

  const handleLogin = async () => {
    if (email.toLowerCase() === 'gabriel@tecflex.com.br' && senha === 'admin123') {
      await AsyncStorage.setItem('@user_logado', 'true');
      navigation.replace('Home');
    } else {
      alert('Credenciais incorretas.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.cardLogin}>
            
            <View style={styles.logoContainer}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="shield-check" size={40} color={CORES.secundaria} />
              </View>
              <View style={styles.row}>
                <Text style={styles.logoBold}>TASKFORM </Text>
                <Text style={styles.logoLight}>| TECFLEX</Text>
              </View>
              <Text style={styles.logoSub}>GESTÃO DE ASSISTÊNCIA</Text>
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={20} color={CORES.placeholder} style={styles.inputIcon} />
              <TextInput 
                style={styles.inputModerno} 
                placeholder="Seu e-mail" 
                placeholderTextColor={CORES.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock-outline" size={20} color={CORES.placeholder} style={styles.inputIcon} />
              <TextInput 
                style={styles.inputModerno} 
                placeholder="Sua senha" 
                placeholderTextColor={CORES.placeholder}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.botaoEntrar} onPress={handleLogin}>
              <Text style={styles.textoBotao}>Acessar Aplicativo</Text>
            </TouchableOpacity>

          </View>
          
          <Text style={styles.copyright}>© 2026 Tecflex | Administração Possamai.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CORES.fundo },
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardLogin: {
    backgroundColor: CORES.branco,
    width: '90%',
    borderRadius: RAIO.card,
    padding: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: CORES.lavandaClaro, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center' },
  logoBold: { fontSize: 24, fontWeight: 'bold', color: CORES.textoPrincipal },
  logoLight: { fontSize: 24, color: CORES.secundaria, fontWeight: '300' },
  logoSub: { fontSize: 12, color: CORES.textoSecundario, letterSpacing: 2, marginTop: 5 },
  inputContainer: { flexDirection: 'row', width: '100%', alignItems: 'center', borderWidth: 1, borderColor: CORES.divisor, borderRadius: RAIO.input, marginBottom: 20, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  inputModerno: { flex: 1, height: 50, fontSize: 16, color: CORES.textoPrincipal },
  botaoEntrar: { backgroundColor: CORES.primaria, width: '100%', borderRadius: RAIO.botao, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 5 },
  textoBotao: { color: CORES.branco, fontSize: 16, fontWeight: '600' },
  copyright: { fontSize: 12, color: CORES.textoSecundario, position: 'absolute', bottom: 30 }
});