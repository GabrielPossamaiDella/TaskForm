import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';

export default function Home({ navigation }) {
  const { listaOS } = useApp();

  const renderItem = ({ item }) => (
    // Transformado em TouchableOpacity para abrir os detalhes
    <TouchableOpacity 
      style={styles.cardOS}
      onPress={() => navigation.navigate('DetalhesOS', { osSelecionada: item })}
    >
      <View style={styles.cardHeaderRow}>
        <Text style={styles.osNumber}>{item.os_number || '#XXXXXX'}</Text>
        <View style={styles.tagConcluido}>
          <Text style={styles.textoConcluido}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.osInfoRow}>
        <Ionicons name="person" size={16} color={CORES.secundaria} style={styles.iconInfo} />
        <Text style={styles.osCliente}>{item.cliente?.nome || "Cliente avulso"}</Text>
      </View>

      <View style={styles.osInfoRow}>
        <Feather name="settings" size={16} color={CORES.placeholder} style={styles.iconInfo} />
        <Text style={styles.osMaquina}>{item.maquina}</Text>
      </View>

      <View style={styles.divisor} />

      <View style={styles.cardFooter}>
        <View style={styles.dateTag}>
          <Text style={styles.textoDate}>{item.data}</Text>
        </View>
        <View style={styles.actionIconsRow}>
          <Feather name="cloud-drizzle" size={18} color={CORES.placeholder} style={styles.actionIcon} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const HeaderBanner = () => (
    <View style={styles.headerBanner}>
      <View style={styles.headerLogoRow}>
        <View style={styles.shieldBadge}>
          <Ionicons name="shield-checkmark" size={20} color={CORES.secundaria} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.logoTextMain}>TASKFORM | TECFLEX</Text>
          <Text style={styles.logoTextSub}>GESTÃO DE ASSISTÊNCIA</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBanner />
      
      <View style={styles.content}>
        <View style={styles.topCardsRow}>
          <View style={[styles.topCard, styles.ordersCard]}>
            <Text style={styles.labelTopCard}>TOTAL DE ORDENS</Text>
            <Text style={styles.valorTopCard}>{listaOS.length}</Text>
          </View>
          <TouchableOpacity style={[styles.topCard, styles.refreshCard]}>
            <Feather name="refresh-ccw" size={24} color="#fff" />
            <Text style={styles.textoRefreshCard}>ATUALIZAR</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={listaOS}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }} // Reduzido pois não há mais botão flutuante
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.vazioContainer}>
              <Text style={styles.textoVazio}>Nenhuma OS cadastrada ainda.</Text>
            </View>
          }
        />
        {/* Botão flutuante removido daqui */}
      </View>
    </SafeAreaView>
  );
}

// MANTENHA O MESMO StyleSheet DA VERSÃO ANTERIOR AQUI
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CORES.fundo },
  content: { flex: 1, padding: 20 },
  headerBanner: { backgroundColor: CORES.primaria, paddingTop: 40, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerLogoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shieldBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  titleContainer: { flex: 1, marginLeft: 15 },
  logoTextMain: { fontSize: 18, fontWeight: 'bold', color: CORES.branco, letterSpacing: 1 },
  logoTextSub: { fontSize: 11, color: CORES.placeholder, marginTop: -3, textTransform: 'uppercase', letterSpacing: 1 },
  topCardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 },
  topCard: { width: '48%', height: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  ordersCard: { backgroundColor: CORES.branco },
  labelTopCard: { fontSize: 10, color: CORES.placeholder, fontWeight: 'bold' },
  valorTopCard: { fontSize: 36, fontWeight: 'bold', color: CORES.textoPrincipal, marginTop: 5 },
  refreshCard: { backgroundColor: CORES.secundaria },
  textoRefreshCard: { color: CORES.branco, fontSize: 12, fontWeight: 'bold', marginTop: 10 },
  cardOS: { backgroundColor: CORES.branco, borderRadius: 15, padding: 18, marginBottom: 15, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  osNumber: { fontSize: 12, color: CORES.placeholder },
  tagConcluido: { backgroundColor: CORES.sucesso, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  textoConcluido: { color: CORES.textoSucesso, fontSize: 10, fontWeight: 'bold' },
  osInfoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  iconInfo: { marginRight: 10 },
  osCliente: { fontSize: 18, fontWeight: 'bold', color: CORES.textoPrincipal },
  osMaquina: { fontSize: 14, color: CORES.textoSecundario },
  divisor: { height: 1, backgroundColor: CORES.cinzaLinha, marginVertical: 15 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateTag: { backgroundColor: CORES.lightPurple, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  textoDate: { color: CORES.secundaria, fontSize: 11, fontWeight: 'bold' },
  actionIconsRow: { flexDirection: 'row' },
  actionIcon: { marginLeft: 20 },
  vazioContainer: { alignItems: 'center', marginTop: 100 },
  textoVazio: { color: CORES.textoSecundario, fontWeight: 'bold' }
});