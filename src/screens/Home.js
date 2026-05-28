import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CORES } from '../styles/temas';

const HEADER_BG = '#1A237E';
const ACCENT = '#5A54FF';

export default function Home({ navigation }) {
  const { listaOS } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const todasSincronizadas = listaOS.length > 0 && listaOS.every(os => os.sincronizada);

  const listaFiltrada = searchQuery.trim()
    ? listaOS.filter(os => {
        const q = searchQuery.toLowerCase();
        return (
          (os.cliente?.nome || '').toLowerCase().includes(q) ||
          (os.os_number || '').toLowerCase().includes(q)
        );
      })
    : listaOS;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardOS}
      onPress={() => navigation.navigate('DetalhesOS', { osSelecionada: item })}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeaderRow}>
        <Text style={styles.osNumber}>{item.os_number || '#XXXXXX'}</Text>
        <View style={styles.tagStatus}>
          <Text style={styles.textoStatus}>{item.status || 'Concluída'}</Text>
        </View>
      </View>

      <View style={styles.osInfoRow}>
        <Ionicons name="person" size={14} color={ACCENT} style={styles.iconInfo} />
        <Text style={styles.osCliente} numberOfLines={1}>{item.cliente?.nome || 'Cliente avulso'}</Text>
      </View>

      <View style={styles.osInfoRow}>
        <Ionicons name="construct-outline" size={14} color={CORES.placeholder} style={styles.iconInfo} />
        <Text style={styles.osMaquina} numberOfLines={1}>{item.defeito || item.maquina || '—'}</Text>
      </View>

      <View style={styles.divisorCard} />

      <View style={styles.cardFooter}>
        <View style={styles.dateTag}>
          <Ionicons name="calendar-outline" size={11} color={ACCENT} />
          <Text style={styles.textoDate}> {item.data}</Text>
        </View>
        <Text style={styles.valorOS}>R$ {parseFloat(item.total || 0).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header Premium */}
      <View style={styles.headerArea}>
        <View style={styles.headerLogoRow}>
          <View style={styles.logoGlowBox}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.logoTextMain}>TASKFORM</Text>
            <Text style={styles.logoTextSub}>GESTÃO DE ASSISTÊNCIA</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Perfil')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="log-out-outline" size={22} color="rgba(255,255,255,0.65)" />
          </TouchableOpacity>
        </View>

        {/* Barra de pesquisa */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.45)" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por cliente ou Nº OS..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.45)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conteúdo */}
      <View style={styles.contentArea}>
        {/* Cards superiores */}
        <View style={styles.topCardsRow}>
          <View style={styles.ordersCard}>
            <Text style={styles.labelTopCard}>TOTAL DE ORDENS</Text>
            <Text style={styles.valorTopCard}>{listaOS.length}</Text>
          </View>
          <TouchableOpacity
            style={[styles.syncCard, todasSincronizadas && styles.syncCardDisabled]}
            disabled={todasSincronizadas}
            activeOpacity={0.8}
          >
            <Ionicons
              name={todasSincronizadas ? 'cloud-done-outline' : 'cloud-upload-outline'}
              size={26}
              color="#fff"
            />
            <Text style={styles.textoSyncCard}>
              {todasSincronizadas ? 'SINCRONIZADO' : 'SINCRONIZAR'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de OS */}
        <FlatList
          data={listaFiltrada}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.vazioContainer}>
              <Ionicons name="document-text-outline" size={52} color="#CCC" />
              <Text style={styles.textoVazio}>
                {searchQuery ? 'Nenhuma OS encontrada.' : 'Nenhuma OS cadastrada ainda.'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: HEADER_BG },

  // HEADER
  headerArea: { backgroundColor: HEADER_BG, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 18 },
  headerLogoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logoGlowBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(90,84,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10,
  },
  headerLogo: { width: 32, height: 32 },
  titleContainer: { flex: 1, marginLeft: 12 },
  logoTextMain: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  logoTextSub: { fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: 1.2, marginTop: 1 },

  // SEARCH
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

  // TOP CARDS
  topCardsRow: { flexDirection: 'row', marginBottom: 20, gap: 12 },
  ordersCard: {
    flex: 1, height: 95, borderRadius: 16, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  labelTopCard: { fontSize: 9, color: CORES.placeholder, fontWeight: '700', letterSpacing: 0.5 },
  valorTopCard: { fontSize: 40, fontWeight: '800', color: HEADER_BG, marginTop: 2 },
  syncCard: {
    flex: 1, height: 95, borderRadius: 16, backgroundColor: CORES.secundaria,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: CORES.secundaria, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
  },
  syncCardDisabled: { opacity: 0.5, shadowOpacity: 0 },
  textoSyncCard: { color: '#fff', fontSize: 10, fontWeight: '700', marginTop: 6, letterSpacing: 0.5 },

  // OS CARDS
  cardOS: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  osNumber: { fontSize: 11, color: CORES.placeholder, fontWeight: '600' },
  tagStatus: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  textoStatus: { color: '#2E7D32', fontSize: 10, fontWeight: '700' },
  osInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  iconInfo: { marginRight: 8 },
  osCliente: { fontSize: 15, fontWeight: '700', color: HEADER_BG, flex: 1 },
  osMaquina: { fontSize: 13, color: CORES.textoSecundario, flex: 1 },
  divisorCard: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateTag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EEEEFF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  textoDate: { color: ACCENT, fontSize: 11, fontWeight: '600' },
  valorOS: { fontSize: 15, fontWeight: '800', color: HEADER_BG },

  // EMPTY
  vazioContainer: { alignItems: 'center', marginTop: 60 },
  textoVazio: { color: CORES.textoSecundario, fontWeight: '600', marginTop: 14, fontSize: 14 },
});
