import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  StyleSheet, SafeAreaView, FlatList, Animated, PanResponder
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES, RAIO } from '../styles/temas';
import ClienteModal from '../components/ClienteModal';

const SWIPE_WIDTH = 120;

function SwipeableRow({ onEditar, onExcluir, children }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const aberto = useRef(false);

  const pan = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dy) < 20,
    onPanResponderMove: (_, g) => {
      const base = aberto.current ? -SWIPE_WIDTH : 0;
      const val = base + g.dx;
      if (val <= 0) translateX.setValue(Math.max(val, -SWIPE_WIDTH));
    },
    onPanResponderRelease: (_, g) => {
      const base = aberto.current ? -SWIPE_WIDTH : 0;
      const moved = base + g.dx;
      const shouldOpen = moved < -30 || (g.vx < -0.5 && !aberto.current);
      aberto.current = shouldOpen;
      Animated.spring(translateX, { toValue: shouldOpen ? -SWIPE_WIDTH : 0, useNativeDriver: true, tension: 40, friction: 8 }).start();
    },
  })).current;

  const fechar = () => {
    aberto.current = false;
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
  };

  return (
    <View style={{ overflow: 'hidden' }}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }} {...pan.panHandlers}>
        <View style={{ flex: 1 }}>
          {children}
        </View>
        <TouchableOpacity style={[styles.btnAcao, { backgroundColor: CORES.secundaria }]} onPress={() => { fechar(); onEditar(); }}>
          <Feather name="edit-2" size={18} color="#fff" />
          <Text style={styles.acaoTxt}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#DC3545' }]} onPress={() => { fechar(); onExcluir(); }}>
          <Feather name="trash-2" size={18} color="#fff" />
          <Text style={styles.acaoTxt}>Excluir</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function GestaoClientes({ navigation }) {
  const { clientes, adicionarCliente, editarCliente, excluirCliente } = useApp();
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

  const confirmarExclusao = (cliente) => {
    Alert.alert('Excluir Cliente', `Excluir "${cliente.nome}" permanentemente?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluirCliente(cliente.id) },
    ]);
  };

  const renderItem = ({ item }) => (
    <SwipeableRow
      onEditar={() => abrirModalEditar(item)}
      onExcluir={() => confirmarExclusao(item)}
    >
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>{item.nome.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.textos}>
          <Text style={styles.nomeCliente}>{item.nome}</Text>
          <Text style={styles.docCliente}>{item.documento || 'Sem documento'}</Text>
          {item.telefone ? <Text style={styles.telCliente}>{item.telefone}</Text> : null}
        </View>
        <Ionicons name="chevron-back-outline" size={16} color={CORES.placeholder} />
      </View>
    </SwipeableRow>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={20} color={CORES.placeholder} style={styles.searchIcon} />
          <TextInput
            style={styles.inputBusca}
            placeholder="Buscar por nome ou documento..."
            placeholderTextColor={CORES.placeholder}
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={20} color={CORES.placeholder} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.countRow}>
          <Text style={styles.countTexto}>
            {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity style={styles.btnNovo} onPress={abrirModalNovo}>
            <Ionicons name="add" size={18} color={CORES.branco} />
            <Text style={styles.btnNovoTexto}>NOVO</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.dica}>← Arraste o card para revelar ações →</Text>

        <FlatList
          data={clientesFiltrados}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <View style={styles.vazioContainer}>
              <Ionicons name="people-outline" size={50} color={CORES.cinzaLinha} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CORES.fundo },
  container: { flex: 1, padding: 20 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: CORES.branco,
    borderRadius: RAIO.input, paddingHorizontal: 12, borderWidth: 1,
    borderColor: CORES.divisor, marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  inputBusca: { flex: 1, height: 48, fontSize: 15, color: CORES.textoPrincipal },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  countTexto: { fontSize: 13, color: CORES.textoSecundario, fontWeight: '600' },
  btnNovo: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: CORES.secundaria,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: RAIO.botao,
  },
  btnNovoTexto: { color: CORES.branco, fontWeight: 'bold', fontSize: 13, marginLeft: 4 },
  dica: { fontSize: 11, color: CORES.placeholder, textAlign: 'center', marginBottom: 10, fontStyle: 'italic' },

  btnAcao: { width: 60, justifyContent: 'center', alignItems: 'center' },
  acaoTxt: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginTop: 4 },

  card: {
    backgroundColor: CORES.branco, padding: 14, flexDirection: 'row',
    alignItems: 'center', borderBottomWidth: 1, borderColor: CORES.divisor,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: CORES.lightPurple,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarLetra: { fontSize: 18, fontWeight: 'bold', color: CORES.secundaria },
  textos: { flex: 1 },
  nomeCliente: { fontSize: 15, fontWeight: '700', color: CORES.textoPrincipal },
  docCliente: { fontSize: 12, color: CORES.textoSecundario, marginTop: 2 },
  telCliente: { fontSize: 12, color: CORES.placeholder, marginTop: 1 },
  vazioContainer: { alignItems: 'center', marginTop: 80 },
  vazioTexto: { marginTop: 16, color: CORES.textoSecundario, fontStyle: 'italic', textAlign: 'center' },
});
