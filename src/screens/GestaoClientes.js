import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';
import ClienteModal from '../components/ClienteModal';

const HEADER_BG = '#1A237E';

export default function GestaoClientes({ navigation }) {
  const { clientes, adicionarCliente, editarCliente, excluirCliente } = useApp();
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (c.documento || '').includes(busca)
  );

  const abrirModalNovo = () => { setClienteEditando(null); setModalVisivel(true); };
  const abrirModalEditar = (cliente) => { setClienteEditando(cliente); setModalVisivel(true); };

  const handleSalvarModal = async (dados) => {
    if (clienteEditando) {
      await editarCliente(clienteEditando.id, dados);
    } else {
      await adicionarCliente(dados);
    }
    setModalVisivel(false);
  };

  const abrirAcoes = (cliente) => {
    Alert.alert(cliente.nome, 'O que deseja fazer?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Editar', onPress: () => abrirModalEditar(cliente) },
      {
        text: 'Excluir', style: 'destructive',
        onPress: () => Alert.alert(
          'Excluir Cliente',
          `Excluir "${cliente.nome}" permanentemente?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', style: 'destructive', onPress: () => excluirCliente(cliente.id) },
          ]
        ),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetra}>{item.nome.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.textos}>
        <Text style={styles.nomeCliente} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.docCliente}>{item.documento || 'Sem documento'}</Text>
        {item.telefone ? <Text style={styles.telCliente}>{item.telefone}</Text> : null}
      </View>
      <TouchableOpacity
        style={styles.btnAcoes}
        onPress={() => abrirAcoes(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="ellipsis-vertical" size={18} color={CORES.placeholder} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={[styles.headerArea, { paddingTop: insets.top + 12 }]}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.45)" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou documento..."
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
        <View style={styles.countRow}>
          <Text style={styles.countTexto}>
            {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity style={styles.btnNovo} onPress={abrirModalNovo}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.btnNovoTxt}>NOVO CLIENTE</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={clientesFiltrados}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}
          ListEmptyComponent={
            <View style={styles.vazioContainer}>
              <Ionicons name="people-outline" size={52} color="#CCC" />
              <Text style={styles.vazioTexto}>
                {busca ? 'Nenhum resultado.' : 'Nenhum cliente cadastrado ainda.'}
              </Text>
            </View>
          }
        />
      </View>

      <ClienteModal
        visible={modalVisivel}
        onClose={() => setModalVisivel(false)}
        onSalvar={handleSalvarModal}
        clienteParaEditar={clienteEditando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F8' },

  headerArea: {
    backgroundColor: HEADER_BG,
    paddingHorizontal: 20, paddingBottom: 18,
  },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, paddingHorizontal: 14, height: 44,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },

  contentArea: {
    flex: 1, backgroundColor: '#F0F2F8',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 20,
    marginTop: -10,
  },

  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  countTexto: { fontSize: 13, color: CORES.textoSecundario, fontWeight: '600' },
  btnNovo: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: HEADER_BG, paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 10, gap: 6,
  },
  btnNovoTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF0FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarLetra: { fontSize: 18, fontWeight: '800', color: HEADER_BG },
  textos: { flex: 1 },
  nomeCliente: { fontSize: 15, fontWeight: '700', color: HEADER_BG },
  docCliente: { fontSize: 12, color: CORES.textoSecundario, marginTop: 2 },
  telCliente: { fontSize: 12, color: CORES.placeholder, marginTop: 1 },
  btnAcoes: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F5F5',
    justifyContent: 'center', alignItems: 'center', marginLeft: 8,
  },

  vazioContainer: { alignItems: 'center', marginTop: 80 },
  vazioTexto: { marginTop: 16, color: CORES.textoSecundario, fontStyle: 'italic', textAlign: 'center' },
});
