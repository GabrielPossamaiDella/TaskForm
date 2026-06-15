// src/screens/Login.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CORES, RAIO } from '../styles/temas';
import { supabase } from '../services/supabase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    verificarLogin();
  }, []);

  const verificarLogin = async () => {
    // Mantem a sessao se ja existe um token de acesso salvo
    const token = await AsyncStorage.getItem('@token_acesso');
    if (token) {
      navigation.replace('Home');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Informe e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      // Login real contra o backend: valida a senha e devolve um token de acesso
      const { data, error } = await supabase.rpc('fazer_login', {
        p_email: email.trim(),
        p_senha: senha,
      });
      const usuario = Array.isArray(data) ? data[0] : data;
      if (error || !usuario || !usuario.token) {
        Alert.alert('Falha no login', 'E-mail ou senha incorretos.');
        return;
      }
      await AsyncStorage.setItem('@token_acesso', usuario.token);
      // Garante o e-mail no perfil mesmo que o backend não o devolva.
      const usuarioCompleto = { ...usuario, email: usuario.email || email.trim() };
      await AsyncStorage.setItem('@usuario', JSON.stringify(usuarioCompleto));
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível conectar. Verifique sua internet.');
    } finally {
      setCarregando(false);
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
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImg}
                resizeMode="contain"
              />
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

            <TouchableOpacity style={[styles.botaoEntrar, carregando && { opacity: 0.7 }]} onPress={handleLogin} disabled={carregando}>
              {carregando
                ? <ActivityIndicator color={CORES.branco} />
                : <Text style={styles.textoBotao}>Acessar Aplicativo</Text>}
            </TouchableOpacity>

          </View>
          
          <Text style={styles.copyright}>© 2026 TaskForm</Text>
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
  logoImg: { width: 160, height: 70, marginBottom: 12 },
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