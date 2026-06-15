import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';
import { capturarLocalizacao } from '../utils/geo';

const HEADER_BG = '#2563EB';

export default function Configuracoes({ navigation }) {
  const { config, salvarConfig } = useApp();
  const insets = useSafeAreaInsets();

  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [endereco, setEndereco] = useState('');
  const [raio, setRaio] = useState('10');
  const [valorKm, setValorKm] = useState('');
  const [buscandoGps, setBuscandoGps] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (config) {
      setLat(config.baseLatitude != null ? String(config.baseLatitude) : '');
      setLng(config.baseLongitude != null ? String(config.baseLongitude) : '');
      setEndereco(config.baseEndereco || '');
      setRaio(config.raioIsencaoKm != null ? String(config.raioIsencaoKm) : '10');
      setValorKm(config.valorPorKm != null ? String(config.valorPorKm) : '');
    }
  }, [config]);

  const usarLocalizacaoAtual = async () => {
    setBuscandoGps(true);
    const geo = await capturarLocalizacao();
    setBuscandoGps(false);
    if (!geo) {
      Alert.alert('Localização indisponível', 'Não foi possível obter sua localização. Verifique a permissão de GPS.');
      return;
    }
    setLat(String(geo.latitude.toFixed(6)));
    setLng(String(geo.longitude.toFixed(6)));
  };

  const handleSalvar = async () => {
    const latNum = lat.trim() ? parseFloat(lat.replace(',', '.')) : null;
    const lngNum = lng.trim() ? parseFloat(lng.replace(',', '.')) : null;
    if ((lat.trim() && isNaN(latNum)) || (lng.trim() && isNaN(lngNum))) {
      Alert.alert('Coordenadas inválidas', 'Latitude e longitude devem ser números.');
      return;
    }
    setSalvando(true);
    try {
      await salvarConfig({
        baseLatitude: latNum,
        baseLongitude: lngNum,
        baseEndereco: endereco.trim(),
        raioIsencaoKm: parseFloat((raio || '0').replace(',', '.')) || 0,
        valorPorKm: parseFloat((valorKm || '0').replace(',', '.')) || 0,
      });
      Toast.show({ type: 'success', text1: 'Configurações salvas!', text2: 'As novas configurações estão ativas.', visibilityTime: 3000 });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar agora. Verifique a conexão e tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONFIGURAÇÕES</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.contentArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: 30 + insets.bottom }]}>

            {/* Local base */}
            <View style={styles.card}>
              <View style={styles.cardTituloRow}>
                <View style={styles.cardIcone}><Ionicons name="business-outline" size={13} color={HEADER_BG} /></View>
                <Text style={styles.cardTitulo}>LOCAL BASE DA EMPRESA</Text>
              </View>
              <Text style={styles.ajuda}>Ponto de partida para calcular o deslocamento até o cliente.</Text>

              <TouchableOpacity style={styles.btnGps} onPress={usarLocalizacaoAtual} disabled={buscandoGps}>
                {buscandoGps
                  ? <ActivityIndicator color={HEADER_BG} />
                  : <><Ionicons name="locate" size={16} color={HEADER_BG} /><Text style={styles.btnGpsTxt}>Usar minha localização atual</Text></>}
              </TouchableOpacity>

              <View style={styles.rowDupla}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Latitude</Text>
                  <TextInput style={[styles.input, styles.inputReadOnly]} value={lat} editable={false} placeholder="Use o botão GPS" placeholderTextColor={CORES.placeholder} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Longitude</Text>
                  <TextInput style={[styles.input, styles.inputReadOnly]} value={lng} editable={false} placeholder="Use o botão GPS" placeholderTextColor={CORES.placeholder} />
                </View>
              </View>

              <Text style={styles.label}>Endereço da base (opcional)</Text>
              <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Ex: Oficina Tecflex - Criciúma/SC" placeholderTextColor={CORES.placeholder} />
            </View>

            {/* Regras de cobranca */}
            <View style={styles.card}>
              <View style={styles.cardTituloRow}>
                <View style={styles.cardIcone}><Ionicons name="car-outline" size={13} color={HEADER_BG} /></View>
                <Text style={styles.cardTitulo}>COBRANÇA DE DESLOCAMENTO</Text>
              </View>

              <Text style={styles.label}>Raio de isenção (km grátis)</Text>
              <TextInput style={styles.input} value={raio} onChangeText={setRaio} keyboardType="numeric" placeholder="10" placeholderTextColor={CORES.placeholder} />

              <Text style={[styles.label, { marginTop: 12 }]}>Valor por km (R$)</Text>
              <TextInput style={styles.input} value={valorKm} onChangeText={setValorKm} keyboardType="numeric" placeholder="2.50" placeholderTextColor={CORES.placeholder} />

              <Text style={styles.regra}>
                Cobrança = (distância − raio grátis) × 2 (ida e volta) × valor/km.
                {'\n'}Dentro do raio não há cobrança de deslocamento.
              </Text>
            </View>

            <TouchableOpacity style={[styles.btnSalvar, salvando && { opacity: 0.7 }]} onPress={handleSalvar} disabled={salvando} activeOpacity={0.85}>
              {salvando ? <ActivityIndicator color="#fff" /> : (
                <><Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 8 }} /><Text style={styles.btnSalvarTxt}>SALVAR CONFIGURAÇÕES</Text></>
              )}
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F8' },
  header: { backgroundColor: HEADER_BG, paddingHorizontal: 20, paddingBottom: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 30, alignItems: 'flex-start' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 1 },

  contentArea: { flex: 1, backgroundColor: '#F0F2F8', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -10 },
  scroll: { padding: 20 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardIcone: { width: 26, height: 26, borderRadius: 8, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  cardTitulo: { fontSize: 12, fontWeight: '800', color: HEADER_BG, letterSpacing: 1 },
  ajuda: { fontSize: 13, color: CORES.textoSecundario, marginBottom: 12 },

  btnGps: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#DBEAFE', borderRadius: 12, paddingVertical: 12, marginBottom: 14,
    borderWidth: 1, borderColor: CORES.secundaria,
  },
  btnGpsTxt: { color: HEADER_BG, fontWeight: '700', fontSize: 14 },

  rowDupla: { flexDirection: 'row', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', color: CORES.textoSecundario, marginBottom: 6 },
  input: {
    backgroundColor: '#F8F8F8', borderWidth: 1, borderColor: '#E8E8E8',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: CORES.textoPrincipal,
  },
  regra: { fontSize: 12, color: CORES.textoSecundario, marginTop: 12, lineHeight: 18, fontStyle: 'italic' },
  inputReadOnly: { backgroundColor: '#EFF6FF', color: CORES.textoSecundario },

  btnSalvar: {
    backgroundColor: HEADER_BG, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: HEADER_BG, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  btnSalvarTxt: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
});
