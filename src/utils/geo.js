// src/utils/geo.js
// Captura de localizacao e calculo de deslocamento (KM rodado).

import * as Location from 'expo-location';

// Captura a localizacao atual. Nunca lanca erro: retorna null se negar/falhar.
export async function capturarLocalizacao() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch (e) {
    return null;
  }
}

// Distancia em linha reta (Haversine) entre dois pontos, em km.
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // raio da Terra em km
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Calcula o deslocamento a cobrar.
// Regra: cobra o EXCEDENTE do raio gratis, IDA E VOLTA (x2).
// Retorna { distanciaKm, kmCobrado, valor }.
export function calcularDeslocamento(config, lat, lng) {
  const vazio = { distanciaKm: 0, kmCobrado: 0, valor: 0 };
  if (!config) return vazio;
  const { baseLatitude, baseLongitude, raioIsencaoKm = 0, valorPorKm = 0 } = config;
  if (baseLatitude == null || baseLongitude == null || lat == null || lng == null) return vazio;

  const distanciaKm = haversineKm(baseLatitude, baseLongitude, lat, lng);
  const excedente = Math.max(0, distanciaKm - Number(raioIsencaoKm || 0));
  const kmCobrado = excedente * 2; // ida e volta
  const valor = kmCobrado * Number(valorPorKm || 0);
  return {
    distanciaKm: Math.round(distanciaKm * 10) / 10,
    kmCobrado: Math.round(kmCobrado * 10) / 10,
    valor: Math.round(valor * 100) / 100,
  };
}
