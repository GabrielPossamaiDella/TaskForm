import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';

export default function Home({ navigation }) {
  const { listaOS } = useApp();
  
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardOS}
      // AQUI: Passamos a OS selecionada para a tela de Detalhes
      onPress={() => navigation.navigate('DetalhesOS', { osSelecionada: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.clienteOS}>{item.cliente?.nome || "Cliente avulso"}</Text>
        <Text style={styles.horaOS}>{item.data}</Text>
      </View>
      <Text style={styles.maquinaInfo}>{item.maquina}</Text>
      <View style={[
        styles.tagStatus, 
        item.status === 'Concluída' ? styles.tagVerde : styles.tagAmarela
      ]}>
        <Text style={styles.textoStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitulo}>Bem-vindo ao TaskForm</Text>
        <Text style={styles.titulo}>Ordens de Serviço</Text>
      </View>

      <FlatList
        data={listaOS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Text style={styles.textoVazio}>Nenhum atendimento realizado hoje.</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.botaoFlutuante} 
        onPress={() => navigation.navigate('NovaOSCliente')}
      >
        <Text style={styles.textoBotaoFlutuante}>+ NOVA OS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo, padding: 20 },
  header: { marginBottom: 25, marginTop: 10 },
  subtitulo: { fontSize: 14, color: CORES.textoSecundario },
  titulo: { fontSize: 26, fontWeight: 'bold', color: CORES.textoPrincipal },
  cardOS: { 
    backgroundColor: CORES.branco, 
    borderRadius: 12, 
    padding: 18, 
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clienteOS: { fontSize: 18, fontWeight: 'bold', color: CORES.textoPrincipal },
  horaOS: { fontSize: 12, color: CORES.placeholder },
  maquinaInfo: { fontSize: 14, color: CORES.textoSecundario, marginTop: 5 },
  tagStatus: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, marginTop: 10, alignSelf: 'flex-start' },
  tagVerde: { backgroundColor: '#E8F5E9' },
  tagAmarela: { backgroundColor: '#FFFDE7' },
  textoStatus: { fontSize: 11, fontWeight: 'bold', color: CORES.textoSecundario, textTransform: 'uppercase' },
  vazioContainer: { alignItems: 'center', marginTop: 100 },
  textoVazio: { color: CORES.textoSecundario, fontWeight: 'bold' },
  botaoFlutuante: { 
    position: 'absolute', bottom: 30, right: 20, 
    backgroundColor: CORES.sucesso, paddingVertical: 15, paddingHorizontal: 25, 
    borderRadius: 30, elevation: 5,
  },
  textoBotaoFlutuante: { color: CORES.branco, fontWeight: 'bold', fontSize: 16 }
});