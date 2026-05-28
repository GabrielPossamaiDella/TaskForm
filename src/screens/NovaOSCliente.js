import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';
import ClienteModal from '../components/ClienteModal';

const HEADER_BG = '#1A237E';

export default function NovaOSCliente({ navigation }) {
  const { clientes, osAtual, atualizarOS, adicionarCliente, excluirCliente } = useApp();
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (c.documento || '').includes(busca)
  );

  const selecionarCliente = (cliente) => atualizarOS({ cliente });

  const confirmarExclusao = (cliente) => {
    Alert.alert('Excluir Cliente', `Excluir "${cliente.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluirCliente(cliente.id) },
    ]);
  };

  const handleProximo = () => {
    if (!osAtual.cliente) {
      Alert.alert('Selecione o Cliente', 'Selecione um cliente antes de prosseguir.');
      return;
    }
    navigation.navigate('NovaOSEquipamento');
  };

  const renderItem = ({ item }) => {
    const selecionado = osAtual.cliente?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.cardCliente, selecionado && styles.cardSelecionado]}
        onPress={() => selecionarCliente(item)}
        onLongPress={() => confirmarExclusao(item)}
        activeOpacity={0.85}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>{item.nome.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nomeCliente} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.docCliente}>{item.documento || item.telefone || 'Sem documento'}</Text>
        </View>
        {selecionado && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safe}>

      {/* Header com progresso e busca */}
      <View style={[styles.headerArea, { paddingTop: insets.top + 10 }]}>
        <View style={styles.progressoRow}>
          <View style={styles.passoAtivo}>
            <Text style={styles.passoAtivoTxt}>1. Cliente</Text>
          </View>
          <View style={styles.passoDivisor} />
          <View style={styles.passoInativo}>
            <Text style={styles.passoInativoTxt}>2. Equipamento</Text>
          </View>
          <View style={styles.passoDivisor} />
          <View style={styles.passoInativo}>
            <Text style={styles.passoInativoTxt}>3. Serviço</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.45)" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cliente..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.45)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conteúdo */}
      <View style={styles.contentArea}>
        <TouchableOpacity style={styles.btnNovoCliente} onPress={() => setModalVisivel(true)}>
          <View style={styles.btnNovoIcone}>
            <Ionicons name="person-add-outline" size={16} color={HEADER_BG} />
          </View>
          <Text style={styles.btnNovoTxt}>CADASTRAR NOVO CLIENTE</Text>
          <Ionicons name="chevron-forward" size={16} color={CORES.placeholder} />
        </TouchableOpacity>

        <FlatList
          data={clientesFiltrados}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, marginTop: 14 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Ionicons name="people-outline" size={48} color="#CCC" />
              <Text style={styles.vazioTxt}>
                {busca ? 'Nenhum resultado.' : 'Nenhum cliente cadastrado.\nToque em "Cadastrar" para adicionar.'}
              </Text>
            </View>
          }
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.goBack()}>
          <Text style={styles.btnCancelarTxt}>CANCELAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnProximo} onPress={handleProximo}>
          <Text style={styles.btnProximoTxt}>PRÓXIMO</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      <ClienteModal
        visible={modalVisivel}
        onClose={() => setModalVisivel(false)}
        onSalvar={async (dados) => { await adicionarCliente(dados); setModalVisivel(false); }}
        clienteParaEditar={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F8' },

  // HEADER
  headerArea: { backgroundColor: HEADER_BG, paddingHorizontal: 20, paddingBottom: 18 },
  progressoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  passoAtivo: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  passoAtivoTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
  passoDivisor: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 6 },
  passoInativo: { paddingHorizontal: 4, paddingVertical: 6 },
  passoInativoTxt: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, paddingHorizontal: 14, height: 44,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },

  // CONTENT
  contentArea: {
    flex: 1, backgroundColor: '#F0F2F8',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 20,
    marginTop: -10,
  },

  // BOTÃO NOVO CLIENTE
  btnNovoCliente: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  btnNovoIcone: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF0FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  btnNovoTxt: { flex: 1, color: HEADER_BG, fontWeight: '700', fontSize: 13 },

  // CARDS DE CLIENTE
  cardCliente: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardSelecionado: {
    borderWidth: 2, borderColor: CORES.secundaria, backgroundColor: '#F8F6FF',
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#EEF0FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarLetra: { fontSize: 17, fontWeight: '800', color: HEADER_BG },
  nomeCliente: { fontSize: 15, fontWeight: '700', color: HEADER_BG },
  docCliente: { fontSize: 12, color: CORES.textoSecundario, marginTop: 2 },
  checkBadge: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: CORES.secundaria,
    justifyContent: 'center', alignItems: 'center', marginLeft: 8,
  },

  // VAZIO
  vazio: { alignItems: 'center', marginTop: 50 },
  vazioTxt: { color: CORES.textoSecundario, marginTop: 12, fontStyle: 'italic', textAlign: 'center', lineHeight: 20 },

  // FOOTER
  footer: {
    flexDirection: 'row', padding: 20, paddingTop: 12, gap: 10,
    backgroundColor: '#F0F2F8', borderTopWidth: 1, borderTopColor: '#E8E8E8',
  },
  btnCancelar: {
    flex: 1, padding: 14, borderRadius: 12, alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  btnCancelarTxt: { color: CORES.textoSecundario, fontWeight: '700', fontSize: 14 },
  btnProximo: {
    flex: 2, backgroundColor: HEADER_BG, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  btnProximoTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
