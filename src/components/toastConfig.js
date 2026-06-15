import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Card base do toast — visual alinhado ao app (card branco, ícone colorido,
// título em negrito e subtítulo). Usado pelos tipos success/error/info.
function ToastBase({ icone, corIcone, fundoIcone, corBarra, text1, text2 }) {
  return (
    <View style={styles.card}>
      <View style={[styles.barra, { backgroundColor: corBarra }]} />
      <View style={[styles.iconeWrap, { backgroundColor: fundoIcone }]}>
        <Ionicons name={icone} size={20} color={corIcone} />
      </View>
      <View style={styles.textos}>
        {!!text1 && <Text style={styles.titulo} numberOfLines={1}>{text1}</Text>}
        {!!text2 && <Text style={styles.sub} numberOfLines={2}>{text2}</Text>}
      </View>
    </View>
  );
}

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <ToastBase
      icone="checkmark-circle"
      corIcone="#16A34A"
      fundoIcone="#DCFCE7"
      corBarra="#22C55E"
      text1={text1}
      text2={text2}
    />
  ),
  error: ({ text1, text2 }) => (
    <ToastBase
      icone="alert-circle"
      corIcone="#DC2626"
      fundoIcone="#FEE2E2"
      corBarra="#EF4444"
      text1={text1}
      text2={text2}
    />
  ),
  info: ({ text1, text2 }) => (
    <ToastBase
      icone="information-circle"
      corIcone="#2563EB"
      fundoIcone="#DBEAFE"
      corBarra="#2563EB"
      text1={text1}
      text2={text2}
    />
  ),
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingRight: 16,
    width: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  barra: { width: 5, alignSelf: 'stretch' },
  iconeWrap: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 12, marginRight: 12,
  },
  textos: { flex: 1 },
  titulo: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  sub: { fontSize: 12, color: '#666', marginTop: 2, lineHeight: 16 },
});
