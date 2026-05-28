import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES, RAIO } from '../styles/temas';
import ClienteModal from '../components/ClienteModal';

const SWIPE_WIDTH = 80;

function SwipeableCliente({ onEditar, children }) {
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
    <View style={{ overflow: 'hidden', marginBottom: 8 }}>
      <Animated.View
        style={{ flexDirection: 'row', transform: [{ translateX }] }}
        {...pan.panHandlers}
      >
        <View style={{ flex: 1 }}>
          {children}
        </View>
        <TouchableOpacity style={swipeStyles.btnEditar} onPress={() => { fechar(); onEditar(); }}>
          <Feather name="edit-2" size={18} color="#fff" />
          <Text style={swipeStyles.acaoTxt}>Editar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const swipeStyles = StyleSheet.create({
  btnEditar: { width: SWIPE_WIDTH, backgroundColor: CORES.secundaria, justifyContent: 'center', alignItems: 'center' },
  acaoTxt: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
});

export default function NovaOSCliente({ navigation }) {
  const { clientes, osAtual, atualizarOS, adicionarCliente, editarCliente, excluirCliente } = useApp();
  const [busca, setBusca] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (c.documento || '').includes(busca)
  );

  const selecionarCliente = (cliente) => atualizarOS({ cliente });

  const abrirModalNovo = () => {
    setClienteEditando(null);
    setModalVisivel(true);
  };

  const abrirModalEditar = (cliente) => {
    setClienteEditando(cliente);
    setModalVisivel(true);
  };

  const handleSalvarModal = async (dados) => {
    if (clienteEditando) {
      await editarCliente(clienteEditando.id, dados);
    } else {
      await adicionarCliente(dados);
    }
    setModalVisivel(false);
  };

  const confirmarExclusao = (cliente) => {
    Alert.alert('Excluir', `Excluir "${cliente.nome}"?`, [
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
      <SwipeableCliente onEditar={() => abrirModalEditar(item)}>
        <TouchableOpacity
          style={[styles.itemCliente, selecionado && styles.itemSelecionado]}
          onPress={() => selecionarCliente(item)}
          onLongPress={() => Alert.alert('Ações', item.nome, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Editar', onPress: () => abrirModalEditar(item) },
            { text: 'Excluir', style: 'destructive', onPress: () => confirmarExclusao(item) },
          ])}
        >
          <View style={styles.clienteInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetra}>{item.nome.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nomeCliente} numberOfLines={1}>{item.nome}</Text>
              <Text style={styles.docCliente}>{item.documento || 'Sem documento'}</Text>
            </View>
          </View>
          {selecionado && <Ionicons name="checkmark-circle" size={22} color={CORES.secundaria} />}
        </TouchableOpacity>
      </SwipeableCliente>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.progressoContainer}>
        <View style={styles.passoAtivo}><Text style={styles.passoAtivoTxt}>1. Cliente</Text></View>
        <View style={styles.passoInativo}><Text style={styles.passoInativoTxt}>2. Equipamento</Text></View>
        <View style={styles.passoInativo}><Text style={styles.passoInativoTxt}>3. Serviço</Text></View>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={CORES.placeholder} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar cliente..."
          placeholderTextColor={CORES.placeholder}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <TouchableOpacity style={styles.botaoNovoCliente} onPress={abrirModalNovo}>
        <Ionicons name="person-add-outline" size={18} color={CORES.secundaria} style={{ marginRight: 8 }} />
        <Text style={styles.textoBotaoNovo}>CADASTRAR NOVO CLIENTE</Text>
      </TouchableOpacity>

      <FlatList
        data={clientesFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{ flex: 1, marginTop: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {busca ? 'Nenhum resultado.' : 'Nenhum cliente cadastrado ainda.'}
          </Text>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.botaoCancelar} onPress={() => navigation.goBack()}>
          <Text style={styles.textoCancelar}>CANCELAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoProximo} onPress={handleProximo}>
          <Text style={styles.textoProximo}>PRÓXIMO</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
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
  container: { flex: 1, padding: 20, backgroundColor: CORES.fundo },
  progressoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  passoAtivo: { backgroundColor: CORES.primaria, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  passoAtivoTxt: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  passoInativo: { paddingHorizontal: 12, paddingVertical: 6 },
  passoInativoTxt: { color: CORES.placeholder, fontSize: 12 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: CORES.branco,
    borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: CORES.divisor,
  },
  inputBusca: { flex: 1, height: 46, fontSize: 15, color: CORES.textoPrincipal },
  botaoNovoCliente: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: CORES.branco, borderWidth: 1, borderColor: CORES.secundaria,
    borderRadius: 10, padding: 13, marginTop: 12,
  },
  textoBotaoNovo: { color: CORES.secundaria, fontWeight: 'bold', fontSize: 14 },
  itemCliente: {
    backgroundColor: CORES.branco, padding: 14, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: CORES.branco,
  },
  itemSelecionado: { borderColor: CORES.secundaria, backgroundColor: '#F0EAFF' },
  clienteInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: CORES.lightPurple,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarLetra: { fontSize: 16, fontWeight: 'bold', color: CORES.secundaria },
  nomeCliente: { fontSize: 15, fontWeight: '600', color: CORES.textoPrincipal },
  docCliente: { fontSize: 12, color: CORES.textoSecundario, marginTop: 2 },
  vazio: { textAlign: 'center', marginTop: 30, color: CORES.placeholder, fontStyle: 'italic' },
  footer: { flexDirection: 'row', paddingTop: 16, gap: 10 },
  botaoCancelar: {
    flex: 1, padding: 14, borderRadius: 10, alignItems: 'center',
    justifyContent: 'center', backgroundColor: CORES.divisor,
  },
  textoCancelar: { color: CORES.textoSecundario, fontWeight: 'bold' },
  botaoProximo: {
    flex: 2, backgroundColor: CORES.primaria, borderRadius: 10, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  textoProximo: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
