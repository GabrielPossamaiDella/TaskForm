import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
  Alert, ActivityIndicator, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, RAIO } from '../styles/temas';

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

const onlyDigits = (v) => v.replace(/\D/g, '');

const formatDocumento = (text) => {
  const d = onlyDigits(text).slice(0, 14);
  if (d.length <= 11) {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
  }
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0,2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`;
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12,14)}`;
};

const formatTelefone = (text) => {
  const d = onlyDigits(text).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`;
};

const formatCep = (text) => {
  const d = onlyDigits(text).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0,5)}-${d.slice(5)}`;
};

const campoVazio = {
  nome: '', documento: '', email: '', telefone: '',
  cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: ''
};

export default function ClienteModal({ visible, onClose, onSalvar, clienteParaEditar }) {
  const [step, setStep] = useState(1);
  const [campos, setCampos] = useState(campoVazio);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [pickerEstadoVisivel, setPickerEstadoVisivel] = useState(false);

  useEffect(() => {
    if (visible) {
      setStep(1);
      setCampos(clienteParaEditar ? { ...campoVazio, ...clienteParaEditar } : campoVazio);
    }
  }, [visible, clienteParaEditar]);

  const set = (key, val) => setCampos(prev => ({ ...prev, [key]: val }));

  const handleCepChange = async (text) => {
    const formatted = formatCep(text);
    set('cep', formatted);
    const digits = onlyDigits(text);
    if (digits.length === 8) {
      setBuscandoCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCampos(prev => ({
            ...prev,
            cep: formatted,
            rua: data.logradouro || prev.rua,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            estado: data.uf || prev.estado,
          }));
        }
      } catch (_) { /* falha silenciosa — usuário preenche manual */ }
      finally { setBuscandoCep(false); }
    }
  };

  const validarStep1 = () => {
    if (!campos.nome.trim()) { Alert.alert('Atenção', 'Nome é obrigatório.'); return false; }
    const dd = onlyDigits(campos.documento);
    if (dd.length !== 11 && dd.length !== 14) {
      Alert.alert('Atenção', 'CPF (11 dígitos) ou CNPJ (14 dígitos) inválido.');
      return false;
    }
    if (onlyDigits(campos.telefone).length < 10) {
      Alert.alert('Atenção', 'Telefone inválido.');
      return false;
    }
    return true;
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View style={styles.stepIndicator}>
                <View style={[styles.stepDot, step >= 1 && styles.stepDotAtivo]} />
                <View style={styles.stepLinha} />
                <View style={[styles.stepDot, step >= 2 && styles.stepDotAtivo]} />
              </View>
              <Text style={styles.titulo}>{step === 1 ? 'Dados do Cliente' : 'Endereço'}</Text>
              <TouchableOpacity onPress={onClose} style={styles.btnFechar}>
                <Ionicons name="close" size={22} color={CORES.textoSecundario} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 60 }}
            >
              {step === 1 ? (
                <View style={styles.corpo}>
                  <Campo label="Nome / Razão Social *">
                    <TextInput style={styles.input} value={campos.nome} onChangeText={v => set('nome', v)} placeholder="Ex: Confecções Silva Ltda" placeholderTextColor={CORES.placeholder} />
                  </Campo>
                  <Campo label="CPF ou CNPJ *">
                    <TextInput style={styles.input} value={campos.documento} onChangeText={v => set('documento', formatDocumento(v))} keyboardType="numeric" maxLength={18} placeholder="000.000.000-00" placeholderTextColor={CORES.placeholder} />
                  </Campo>
                  <Campo label="E-mail">
                    <TextInput style={styles.input} value={campos.email} onChangeText={v => set('email', v)} keyboardType="email-address" autoCapitalize="none" placeholder="cliente@email.com" placeholderTextColor={CORES.placeholder} />
                  </Campo>
                  <Campo label="WhatsApp / Telefone *">
                    <TextInput style={styles.input} value={campos.telefone} onChangeText={v => set('telefone', formatTelefone(v))} keyboardType="phone-pad" maxLength={15} placeholder="(48) 99999-9999" placeholderTextColor={CORES.placeholder} />
                  </Campo>

                  <TouchableOpacity style={styles.btnPrimario} onPress={() => { if (validarStep1()) setStep(2); }}>
                    <Text style={styles.btnPrimarioTxt}>CONTINUAR</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.corpo}>
                  {/* CEP com indicador de loading */}
                  <Campo label="CEP *">
                    <View style={styles.inputRow}>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={campos.cep}
                        onChangeText={handleCepChange}
                        keyboardType="numeric"
                        maxLength={9}
                        placeholder="00000-000"
                        placeholderTextColor={CORES.placeholder}
                      />
                      {buscandoCep && (
                        <ActivityIndicator size="small" color={CORES.secundaria} style={{ marginLeft: 10 }} />
                      )}
                    </View>
                    {buscandoCep && (
                      <Text style={styles.dica}>Buscando endereço...</Text>
                    )}
                  </Campo>

                  <Campo label="Rua / Avenida">
                    <TextInput style={styles.input} value={campos.rua} onChangeText={v => set('rua', v)} placeholder="Rua das Flores" placeholderTextColor={CORES.placeholder} />
                  </Campo>

                  <View style={styles.rowDupla}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Campo label="Número">
                        <TextInput style={styles.input} value={campos.numero} onChangeText={v => set('numero', v)} placeholder="123" placeholderTextColor={CORES.placeholder} keyboardType="numeric" />
                      </Campo>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Campo label="Bairro">
                        <TextInput style={styles.input} value={campos.bairro} onChangeText={v => set('bairro', v)} placeholder="Centro" placeholderTextColor={CORES.placeholder} />
                      </Campo>
                    </View>
                  </View>

                  <Campo label="Cidade">
                    <TextInput style={styles.input} value={campos.cidade} onChangeText={v => set('cidade', v)} placeholder="Florianópolis" placeholderTextColor={CORES.placeholder} />
                  </Campo>

                  {/* Picker de Estado */}
                  <Campo label="Estado (UF)">
                    <TouchableOpacity style={[styles.input, styles.pickerBtn]} onPress={() => setPickerEstadoVisivel(true)}>
                      <Text style={campos.estado ? styles.pickerTxt : styles.pickerPlaceholder}>
                        {campos.estado || 'Selecione o estado...'}
                      </Text>
                      <Ionicons name="chevron-down" size={18} color={CORES.placeholder} />
                    </TouchableOpacity>
                  </Campo>

                  <View style={styles.rowBotoes}>
                    <TouchableOpacity style={styles.btnSecundario} onPress={() => setStep(1)}>
                      <Ionicons name="arrow-back" size={18} color={CORES.secundaria} />
                      <Text style={styles.btnSecundarioTxt}>VOLTAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnPrimario, { flex: 1, marginLeft: 10 }]} onPress={() => onSalvar(campos)}>
                      <Text style={styles.btnPrimarioTxt}>{clienteParaEditar ? 'SALVAR' : 'CADASTRAR'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Picker de Estado — modal separado para não conflitar com o KAV */}
      <Modal visible={pickerEstadoVisivel} animationType="fade" transparent onRequestClose={() => setPickerEstadoVisivel(false)}>
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setPickerEstadoVisivel(false)}>
          <View style={styles.pickerSheet}>
            <Text style={styles.pickerTitulo}>Selecione o Estado</Text>
            <FlatList
              data={UFS}
              keyExtractor={item => item}
              numColumns={4}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.ufBtn, campos.estado === item && styles.ufBtnAtivo]}
                  onPress={() => { set('estado', item); setPickerEstadoVisivel(false); }}
                >
                  <Text style={[styles.ufTxt, campos.estado === item && styles.ufTxtAtivo]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function Campo({ label, children }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 10,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderColor: CORES.divisor, marginBottom: 8,
  },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: CORES.divisor },
  stepDotAtivo: { backgroundColor: CORES.secundaria },
  stepLinha: { width: 20, height: 2, backgroundColor: CORES.divisor, marginHorizontal: 4 },
  titulo: { flex: 1, fontSize: 16, fontWeight: 'bold', color: CORES.textoPrincipal },
  btnFechar: { padding: 4 },
  corpo: { paddingTop: 8 },
  label: { fontSize: 12, fontWeight: '600', color: CORES.textoSecundario, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: RAIO.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  dica: { fontSize: 11, color: CORES.secundaria, marginTop: 4, fontStyle: 'italic' },
  rowDupla: { flexDirection: 'row' },
  rowBotoes: { flexDirection: 'row', marginTop: 10 },
  pickerBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerTxt: { fontSize: 15, color: CORES.textoPrincipal },
  pickerPlaceholder: { fontSize: 15, color: CORES.placeholder },
  btnPrimario: {
    backgroundColor: CORES.primaria, borderRadius: RAIO.botao, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 6,
  },
  btnPrimarioTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  btnSecundario: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: RAIO.botao, borderWidth: 1, borderColor: CORES.secundaria, justifyContent: 'center',
  },
  btnSecundarioTxt: { color: CORES.secundaria, fontWeight: 'bold', fontSize: 14, marginLeft: 6 },
  // Picker de estado
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 30 },
  pickerSheet: {
    backgroundColor: CORES.branco, borderRadius: 20, padding: 20,
  },
  pickerTitulo: { fontSize: 16, fontWeight: 'bold', color: CORES.textoPrincipal, marginBottom: 16, textAlign: 'center' },
  ufBtn: {
    flex: 1, margin: 4, paddingVertical: 10, borderRadius: 8,
    backgroundColor: CORES.fundo, alignItems: 'center', borderWidth: 1, borderColor: CORES.divisor,
  },
  ufBtnAtivo: { backgroundColor: CORES.secundaria, borderColor: CORES.secundaria },
  ufTxt: { fontSize: 14, fontWeight: '600', color: CORES.textoPrincipal },
  ufTxtAtivo: { color: '#fff' },
});
