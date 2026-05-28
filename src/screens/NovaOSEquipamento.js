import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';
import StepProgress from '../components/StepProgress';

const HEADER_BG = '#1A237E';

const DEFEITOS_COMUNS = [
  'Ponto pulando', 'Quebrando agulha', 'Linha arrebentando',
  'Barulho anormal', 'Máquina travada', 'Tensão irregular',
];

export default function NovaOSEquipamento({ navigation }) {
  const { osAtual, atualizarOS } = useApp();
  const insets = useSafeAreaInsets();
  const [maquina, setMaquina] = useState(osAtual.maquina || '');
  const [defeito, setDefeito] = useState(osAtual.defeito || '');

  const selecionarTag = (tag) => setDefeito(prev => prev ? `${prev}, ${tag}` : tag);

  const proximo = () => {
    if (!maquina.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o modelo da máquina antes de prosseguir.');
      return;
    }
    atualizarOS({ maquina, defeito });
    navigation.navigate('NovaOSServicos');
  };

  return (
    <View style={styles.safe}>
      <View style={{ backgroundColor: HEADER_BG, paddingTop: insets.top }}>
        <StepProgress current={2} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <View style={styles.contentArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            {/* Máquina */}
            <View style={styles.card}>
              <View style={styles.cardTituloRow}>
                <View style={styles.cardIcone}>
                  <Ionicons name="settings-outline" size={13} color={HEADER_BG} />
                </View>
                <Text style={styles.cardTitulo}>MODELO DA MÁQUINA *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={maquina}
                onChangeText={setMaquina}
                placeholder="Ex: Reta Eletrônica Sunsure SS-550"
                placeholderTextColor={CORES.placeholder}
              />
            </View>

            {/* Defeito */}
            <View style={styles.card}>
              <View style={styles.cardTituloRow}>
                <View style={styles.cardIcone}>
                  <Ionicons name="alert-circle-outline" size={13} color={HEADER_BG} />
                </View>
                <Text style={styles.cardTitulo}>DEFEITO / RECLAMAÇÃO</Text>
              </View>
              <Text style={styles.sublabel}>Toque para adicionar:</Text>
              <View style={styles.tagsRow}>
                {DEFEITOS_COMUNS.map(tag => (
                  <TouchableOpacity key={tag} style={styles.tag} onPress={() => selecionarTag(tag)}>
                    <Text style={styles.tagTxt}>+ {tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[styles.input, { height: 90, textAlignVertical: 'top', marginTop: 10 }]}
                value={defeito}
                onChangeText={setDefeito}
                placeholder="Descreva o problema detalhadamente..."
                placeholderTextColor={CORES.placeholder}
                multiline
              />
            </View>

          </ScrollView>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color={CORES.textoSecundario} />
            <Text style={styles.btnVoltarTxt}>VOLTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnProximo} onPress={proximo}>
            <Text style={styles.btnProximoTxt}>PRÓXIMO</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F8' },
  kav: { flex: 1 },

  contentArea: {
    flex: 1, backgroundColor: '#F0F2F8',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -8,
  },
  scroll: { padding: 20, paddingBottom: 10 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTituloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardIcone: {
    width: 26, height: 26, borderRadius: 8, backgroundColor: '#EEF0FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  cardTitulo: { fontSize: 10, fontWeight: '800', color: HEADER_BG, letterSpacing: 1 },
  sublabel: { fontSize: 12, color: CORES.placeholder, marginBottom: 8 },

  input: {
    backgroundColor: '#F8F8F8', borderWidth: 1, borderColor: '#E8E8E8',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: CORES.textoPrincipal,
  },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: '#EEF0FF', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: CORES.secundaria,
  },
  tagTxt: { color: CORES.secundaria, fontSize: 12, fontWeight: '600' },

  footer: {
    flexDirection: 'row', padding: 20, paddingTop: 12, gap: 10,
    backgroundColor: '#F0F2F8', borderTopWidth: 1, borderTopColor: '#E8E8E8',
  },
  btnVoltar: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  btnVoltarTxt: { color: CORES.textoSecundario, fontWeight: '700', marginLeft: 6 },
  btnProximo: {
    flex: 1, backgroundColor: HEADER_BG, borderRadius: 12, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  btnProximoTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
