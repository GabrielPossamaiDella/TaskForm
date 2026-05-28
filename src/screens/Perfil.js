import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';

const LOGO_KEY = '@logo_pdf';
const MAX_BYTES = 2 * 1024 * 1024;

export default function Perfil({ navigation }) {
  const { clientes, listaOS } = useApp();
  const [logoPDF, setLogoPDF] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(LOGO_KEY).then(val => { if (val) setLogoPDF(val); });
  }, []);

  const handleLogout = () => {
    Alert.alert('Sair do TaskForm', 'Deseja realmente encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('@user_logado');
            navigation.replace('Login');
          } catch {
            Alert.alert('Erro', 'Não foi possível encerrar a sessão.');
          }
        },
      },
    ]);
  };

  const alterarLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Permita acesso à galeria nas configurações do dispositivo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 1],
      quality: 0.85,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (asset.fileSize && asset.fileSize > MAX_BYTES) {
      Alert.alert('Imagem muito grande', 'A logo deve ter no máximo 2 MB.\nDica: use um PNG comprimido ou reduza as dimensões.');
      return;
    }

    if (asset.height > asset.width) {
      Alert.alert(
        'Proporção inadequada',
        'Esta imagem é mais alta do que larga.\nPara o cabeçalho do PDF ficar bem, prefira uma imagem no formato paisagem (mais larga que alta).',
        [
          { text: 'Escolher outra', style: 'cancel' },
          { text: 'Usar mesmo assim', onPress: () => salvarLogo(asset) },
        ]
      );
      return;
    }

    await salvarLogo(asset);
  };

  const salvarLogo = async (asset) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const mime = (asset.mimeType || '').includes('jpeg') ? 'jpeg' : 'png';
      const dataUri = `data:image/${mime};base64,${base64}`;
      await AsyncStorage.setItem(LOGO_KEY, dataUri);
      setLogoPDF(dataUri);
      Alert.alert('Logo atualizada', 'A nova logo será usada nos próximos PDFs gerados.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a imagem. Tente novamente.');
    }
  };

  const restaurarLogoPadrao = () => {
    Alert.alert('Restaurar logo padrão', 'Remover a logo personalizada e usar a do app?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Restaurar', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(LOGO_KEY);
          setLogoPDF(null);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.headerPerfil}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>GP</Text>
          </View>
          <Text style={styles.nomeUsuario}>Gabriel Patricio</Text>
          <Text style={styles.cargoUsuario}>Administrador / Técnico</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValor}>{listaOS.length}</Text>
            <Text style={styles.statLabel}>ORDENS DE SERVIÇO</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValor}>{clientes.length}</Text>
            <Text style={styles.statLabel}>CLIENTES</Text>
          </View>
        </View>

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

        {/* Gestão */}
        <View style={styles.cardAtalhos}>
          <Text style={styles.tituloSecao}>Gestão</Text>
          <TouchableOpacity style={styles.itemAtalho} onPress={() => navigation.navigate('GestaoClientes')}>
            <View style={styles.atalhoIcone}>
              <Ionicons name="people-outline" size={20} color={CORES.secundaria} />
            </View>
            <Text style={styles.atalhoTexto}>Gerenciar Clientes</Text>
            <Feather name="chevron-right" size={18} color={CORES.placeholder} />
          </TouchableOpacity>
        </View>

        {/* Logo do PDF */}
        <View style={styles.cardLogo}>
          <View style={styles.logoHeader}>
            <Ionicons name="image-outline" size={18} color={CORES.secundaria} />
            <Text style={styles.tituloSecao}>Logo do PDF</Text>
          </View>

          <View style={styles.logoPreviewBox}>
            <Image
              source={logoPDF ? { uri: logoPDF } : require('../../assets/logo.png')}
              style={styles.logoPreview}
              resizeMode="contain"
            />
            {!logoPDF && (
              <Text style={styles.logoPadrao}>Logo padrão</Text>
            )}
          </View>

          <View style={styles.criteriosBox}>
            <Ionicons name="information-circle-outline" size={14} color={CORES.placeholder} />
            <Text style={styles.criteriosTxt}>
              {'Formato: PNG ou JPG  •  Máx: 2 MB\nRecomendado: horizontal (ex: 400 × 100 px)\nA imagem será exibida no cabeçalho do PDF'}
            </Text>
          </View>

          <View style={styles.logoAcoes}>
            <TouchableOpacity style={styles.btnAlterarLogo} onPress={alterarLogo}>
              <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
              <Text style={styles.btnLogoTxt}>ALTERAR LOGO</Text>
            </TouchableOpacity>
            {logoPDF && (
              <TouchableOpacity style={styles.btnRestaurar} onPress={restaurarLogoPadrao}>
                <Ionicons name="refresh-outline" size={16} color={CORES.textoSecundario} />
              </TouchableOpacity>
            )}
          </View>
        </View>

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

  headerPerfil: { alignItems: 'center', marginVertical: 30, width: '100%' },
  avatar: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: CORES.primaria,
    justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, marginBottom: 15,
  },
  avatarTexto: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  nomeUsuario: { fontSize: 24, fontWeight: 'bold', color: CORES.textoPrincipal },
  cargoUsuario: { fontSize: 16, color: CORES.textoSecundario },

  statsRow: { flexDirection: 'row', width: '100%', marginBottom: 20, gap: 12 },
  statCard: { flex: 1, backgroundColor: CORES.branco, borderRadius: 15, padding: 16, alignItems: 'center', elevation: 2 },
  statValor: { fontSize: 28, fontWeight: 'bold', color: CORES.primaria },
  statLabel: { fontSize: 10, color: CORES.textoSecundario, fontWeight: 'bold', marginTop: 4, letterSpacing: 0.5 },

  cardInfo: {
    backgroundColor: '#fff', width: '100%', borderRadius: 15, padding: 20,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
  },
  tituloSecao: { fontSize: 12, fontWeight: 'bold', color: CORES.secundaria, marginBottom: 15, letterSpacing: 1, marginLeft: 6 },
  infoRow: { marginVertical: 5 },
  labelInfo: { fontSize: 12, color: CORES.placeholder },
  valorInfo: { fontSize: 16, color: CORES.textoPrincipal, fontWeight: '500' },
  divisor: { height: 1, backgroundColor: CORES.cinzaLinha, marginVertical: 10 },

  cardAtalhos: { backgroundColor: CORES.branco, width: '100%', borderRadius: 15, padding: 20, elevation: 2, marginTop: 16 },
  itemAtalho: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  atalhoIcone: { width: 36, height: 36, borderRadius: 18, backgroundColor: CORES.lightPurple, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  atalhoTexto: { flex: 1, fontSize: 15, color: CORES.textoPrincipal, fontWeight: '500' },

  cardLogo: { backgroundColor: CORES.branco, width: '100%', borderRadius: 15, padding: 20, elevation: 2, marginTop: 16 },
  logoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logoPreviewBox: {
    width: '100%', height: 90, backgroundColor: CORES.fundo,
    borderRadius: 10, borderWidth: 1, borderColor: CORES.divisor,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10, overflow: 'hidden',
  },
  logoPreview: { width: '90%', height: 70 },
  logoPadrao: { position: 'absolute', bottom: 6, right: 10, fontSize: 10, color: CORES.placeholder, fontStyle: 'italic' },
  criteriosBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: CORES.fundo, borderRadius: 8, padding: 10, marginBottom: 14 },
  criteriosTxt: { fontSize: 11, color: CORES.textoSecundario, marginLeft: 6, lineHeight: 17 },
  logoAcoes: { flexDirection: 'row', gap: 10 },
  btnAlterarLogo: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: CORES.secundaria, borderRadius: 10, paddingVertical: 12, gap: 8,
  },
  btnLogoTxt: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  btnRestaurar: {
    width: 46, height: 46, borderRadius: 10, borderWidth: 1, borderColor: CORES.divisor,
    justifyContent: 'center', alignItems: 'center',
  },

  botaoLogout: {
    backgroundColor: '#FFF0F0', width: '100%', padding: 18, borderRadius: 15, marginTop: 24,
    alignItems: 'center', borderWidth: 1, borderColor: '#FFC1C1',
  },
  textoLogout: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  versao: { marginTop: 30, fontSize: 12, color: CORES.placeholder },
});
