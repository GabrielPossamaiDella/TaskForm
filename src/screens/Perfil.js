import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';

const HEADER_BG = '#1A237E';
const LOGO_KEY = '@logo_pdf';
const MAX_BYTES = 2 * 1024 * 1024;

export default function Perfil({ navigation }) {
  const { clientes, listaOS } = useApp();
  const insets = useSafeAreaInsets();
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
      Alert.alert('Permissão negada', 'Permita acesso à galeria nas configurações.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [3, 1], quality: 0.85,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_BYTES) {
      Alert.alert('Imagem muito grande', 'A logo deve ter no máximo 2 MB.');
      return;
    }
    if (asset.height > asset.width) {
      Alert.alert('Proporção inadequada', 'Prefira uma imagem mais larga que alta.',
        [{ text: 'Escolher outra', style: 'cancel' }, { text: 'Usar mesmo assim', onPress: () => salvarLogo(asset) }]
      );
      return;
    }
    await salvarLogo(asset);
  };

  const salvarLogo = async (asset) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
      const mime = (asset.mimeType || '').includes('jpeg') ? 'jpeg' : 'png';
      const dataUri = `data:image/${mime};base64,${base64}`;
      await AsyncStorage.setItem(LOGO_KEY, dataUri);
      setLogoPDF(dataUri);
      Alert.alert('Logo atualizada', 'A nova logo será usada nos próximos PDFs.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a imagem.');
    }
  };

  const restaurarLogoPadrao = () => {
    Alert.alert('Restaurar logo padrão', 'Remover a logo personalizada?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Restaurar', style: 'destructive', onPress: async () => { await AsyncStorage.removeItem(LOGO_KEY); setLogoPDF(null); } },
    ]);
  };

  return (
    <View style={styles.safe}>
      {/* Header escuro com avatar */}
      <View style={[styles.headerArea, { paddingTop: insets.top + 20 }]}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarTxt}>GP</Text>
        </View>
        <Text style={styles.nomeUsuario}>Gabriel Patricio</Text>
        <Text style={styles.cargoUsuario}>Administrador · Técnico</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.contentArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}>

          {/* Stats */}
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

          {/* Informações da Conta */}
          <View style={styles.card}>
            <View style={styles.cardTituloRow}>
              <View style={styles.cardIcone}><Ionicons name="person-outline" size={14} color={HEADER_BG} /></View>
              <Text style={styles.cardTitulo}>INFORMAÇÕES DA CONTA</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValor}>gabriel@tecflex.com.br</Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Empresa</Text>
              <Text style={styles.infoValor}>Tecflex Sistemas de Costura</Text>
            </View>
          </View>

          {/* Gestão */}
          <View style={styles.card}>
            <View style={styles.cardTituloRow}>
              <View style={styles.cardIcone}><Ionicons name="grid-outline" size={14} color={HEADER_BG} /></View>
              <Text style={styles.cardTitulo}>GESTÃO</Text>
            </View>
            <TouchableOpacity style={styles.itemMenu} onPress={() => navigation.navigate('GestaoClientes')}>
              <View style={styles.itemMenuIcone}>
                <Ionicons name="people-outline" size={16} color={HEADER_BG} />
              </View>
              <Text style={styles.itemMenuTxt}>Gerenciar Clientes</Text>
              <Feather name="chevron-right" size={16} color={CORES.placeholder} />
            </TouchableOpacity>
          </View>

          {/* Logo do PDF */}
          <View style={styles.card}>
            <View style={styles.cardTituloRow}>
              <View style={styles.cardIcone}><Ionicons name="image-outline" size={14} color={HEADER_BG} /></View>
              <Text style={styles.cardTitulo}>LOGO DO PDF</Text>
            </View>

            <View style={styles.logoPreviewBox}>
              <Image
                source={logoPDF ? { uri: logoPDF } : require('../../assets/logo.png')}
                style={styles.logoPreview}
                resizeMode="contain"
              />
              {!logoPDF && <Text style={styles.logoPadraoTxt}>Logo padrão</Text>}
            </View>

            <View style={styles.criteriosBox}>
              <Ionicons name="information-circle-outline" size={13} color={CORES.placeholder} />
              <Text style={styles.criteriosTxt}>
                {'PNG ou JPG  •  Máx: 2 MB  •  Recomendado: horizontal (400×100 px)'}
              </Text>
            </View>

            <View style={styles.logoAcoes}>
              <TouchableOpacity style={styles.btnAlterarLogo} onPress={alterarLogo}>
                <Ionicons name="cloud-upload-outline" size={15} color="#fff" />
                <Text style={styles.btnLogoTxt}>ALTERAR LOGO</Text>
              </TouchableOpacity>
              {logoPDF && (
                <TouchableOpacity style={styles.btnRestaurar} onPress={restaurarLogoPadrao}>
                  <Ionicons name="refresh-outline" size={16} color={CORES.textoSecundario} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#FF3B30" style={{ marginRight: 8 }} />
            <Text style={styles.btnLogoutTxt}>ENCERRAR SESSÃO</Text>
          </TouchableOpacity>

          <Text style={styles.versao}>TaskForm v1.0.0 — Protótipo MVP</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F8' },

  // HEADER
  headerArea: {
    backgroundColor: HEADER_BG, alignItems: 'center',
    paddingBottom: 28, paddingHorizontal: 20,
  },
  avatarBox: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarTxt: { color: '#fff', fontSize: 28, fontWeight: '800' },
  nomeUsuario: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  cargoUsuario: { fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.3 },

  // CONTENT
  contentArea: {
    flex: 1, backgroundColor: '#F0F2F8',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -16, paddingHorizontal: 20, paddingTop: 20,
  },

  // STATS
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statValor: { fontSize: 32, fontWeight: '800', color: HEADER_BG },
  statLabel: { fontSize: 9, color: CORES.textoSecundario, fontWeight: '700', marginTop: 4, letterSpacing: 0.5, textAlign: 'center' },

  // CARDS
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cardIcone: {
    width: 26, height: 26, borderRadius: 8, backgroundColor: '#EEF0FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  cardTitulo: { fontSize: 10, fontWeight: '800', color: HEADER_BG, letterSpacing: 1 },

  infoRow: { paddingVertical: 4 },
  infoLabel: { fontSize: 11, color: CORES.placeholder, marginBottom: 2 },
  infoValor: { fontSize: 14, color: '#111', fontWeight: '600' },
  divisor: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },

  itemMenu: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  itemMenuIcone: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: '#EEF0FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  itemMenuTxt: { flex: 1, fontSize: 14, color: '#111', fontWeight: '500' },

  // LOGO
  logoPreviewBox: {
    width: '100%', height: 80, backgroundColor: '#F8F8F8',
    borderRadius: 10, borderWidth: 1, borderColor: '#EBEBEB',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10, overflow: 'hidden',
  },
  logoPreview: { width: '85%', height: 60 },
  logoPadraoTxt: { position: 'absolute', bottom: 5, right: 10, fontSize: 10, color: CORES.placeholder, fontStyle: 'italic' },
  criteriosBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#F8F8F8', borderRadius: 8, padding: 10, marginBottom: 12,
  },
  criteriosTxt: { fontSize: 11, color: CORES.textoSecundario, marginLeft: 6, flex: 1 },
  logoAcoes: { flexDirection: 'row', gap: 10 },
  btnAlterarLogo: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: HEADER_BG, borderRadius: 10, paddingVertical: 11, gap: 6,
  },
  btnLogoTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  btnRestaurar: {
    width: 44, height: 44, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0',
    justifyContent: 'center', alignItems: 'center',
  },

  // LOGOUT
  btnLogout: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF0F0', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#FFD0CE', marginBottom: 20,
  },
  btnLogoutTxt: { color: '#FF3B30', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
  versao: { textAlign: 'center', fontSize: 11, color: CORES.placeholder, marginBottom: 10 },
});
