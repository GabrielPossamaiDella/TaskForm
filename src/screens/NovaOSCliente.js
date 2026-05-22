import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { CORES, ESTILOS_COMUNS } from '../styles/temas';

export default function NovaOSCliente({ navigation }) {
  const { clientes, osAtual, atualizarOS } = useApp();
  const [busca, setBusca] = useState('');

  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) || 
    c.documento.includes(busca)
  );

  const selecionarCliente = (cliente) => {
    atualizarOS({ cliente: cliente });
  };

  const { excluirCliente } = useApp();

  const onLongPressCliente = (cliente) => {
    Alert.alert(
      'Ações',
      `${cliente.nome}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Editar', onPress: () => navigation.navigate('NovoCliente', { cliente }) },
        { text: 'Excluir', style: 'destructive', onPress: () => {
            Alert.alert('Confirmar exclusão', `Excluir ${cliente.nome}?`, [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Excluir', style: 'destructive', onPress: () => excluirCliente(cliente.id) }
            ]);
          }
        }
      ]
    );
  };

  const handleProximo = () => {
    if (!osAtual.cliente) {
      Alert.alert("Selecione o Cliente", "Por favor, selecione um cliente na lista abaixo ou cadastre um novo antes de prosseguir.");
      return;
    }
    navigation.navigate('NovaOSEquipamento');
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressoContainer}>
        <Text style={styles.passoAtivo}>Cliente</Text>
        <Text style={styles.passoInativo}>Equipamento</Text>
        <Text style={styles.passoInativo}>Serviço</Text>
      </View>

      <Text style={styles.label}>Buscar Cliente Existente:</Text>
      <TextInput 
        style={ESTILOS_COMUNS.input} 
        placeholder="Digite o nome ou CNPJ..." 
        placeholderTextColor={CORES.placeholder}
        value={busca}
        onChangeText={setBusca}
      />

      <TouchableOpacity 
        style={styles.botaoNovoCliente} 
        onPress={() => navigation.navigate('NovoCliente')}
      >
        <Text style={styles.textoBotaoNovo}>+ CADASTRAR NOVO CLIENTE</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { marginTop: 25, marginBottom: 10 }]}>Selecione abaixo:</Text>
      
      <FlatList
        data={clientesFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.itemCliente, 
              osAtual.cliente?.id === item.id && styles.itemSelecionado
            ]}
            onPress={() => selecionarCliente(item)}
            onLongPress={() => onLongPressCliente(item)}
          >
            <View>
                <Text style={styles.nomeCliente}>{item.nome}</Text>
                <Text style={styles.docCliente}>{item.documento}</Text>
            </View>
            {osAtual.cliente?.id === item.id && (
                <View style={styles.checkAtivo} />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum cliente cadastrado com este nome.</Text>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.botaoFooter, styles.botaoCancelar]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBotaoCancelar}>CANCELAR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botaoFooter, styles.botaoProximo]} 
          onPress={handleProximo}
        >
          <Text style={ESTILOS_COMUNS.textoBotao}>PRÓXIMO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: CORES.fundo },
  progressoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, backgroundColor: CORES.branco, padding: 10, borderRadius: 10 },
  passoAtivo: { color: CORES.primaria, fontWeight: 'bold', fontSize: 12 },
  passoInativo: { color: CORES.placeholder, fontSize: 12 },
  label: { fontSize: 16, fontWeight: '600', color: CORES.textoPrincipal },
  botaoNovoCliente: {
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.secundaria,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBotaoNovo: { color: CORES.secundaria, fontWeight: 'bold', fontSize: 15 },
  itemCliente: {
    backgroundColor: CORES.branco,
    padding: 18,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.branco,
  },
  itemSelecionado: {
    borderColor: CORES.secundaria,
    backgroundColor: '#E8F0FE', // Azul bem claro
  },
  nomeCliente: { fontSize: 16, fontWeight: '600', color: CORES.textoPrincipal },
  docCliente: { fontSize: 13, color: CORES.textoSecundario, marginTop: 3 },
  checkAtivo: { width: 15, height: 15, borderRadius: 10, backgroundColor: CORES.secundaria },
  vazio: { textAlign: 'center', marginTop: 30, color: CORES.placeholder, fontStyle: 'italic' },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 'auto', // Empurra para o fim
    paddingTop: 20,
  },
  botaoFooter: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  botaoCancelar: { marginRight: 10, backgroundColor: '#E0E0E0' },
  botaoProximo: { marginLeft: 10, backgroundColor: CORES.primaria },
  textoBotaoCancelar: { color: CORES.textoSecundario, fontWeight: 'bold' }
});