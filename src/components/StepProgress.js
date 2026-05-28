import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LABELS = ['Cliente', 'Equip.', 'Serviço'];

export default function StepProgress({ current }) {
  return (
    <View style={styles.row}>
      {LABELS.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <React.Fragment key={num}>
            <View style={styles.item}>
              <View style={[styles.circle, active && styles.circleActive, done && styles.circleDone]}>
                {done
                  ? <Ionicons name="checkmark" size={11} color="#fff" />
                  : <Text style={[styles.num, active && styles.numActive]}>{num}</Text>
                }
              </View>
              <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
            </View>
            {i < LABELS.length - 1 && (
              <View style={[styles.line, done && styles.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12 },
  item: { alignItems: 'center', width: 54 },
  circle: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  circleActive: { backgroundColor: '#fff', borderColor: '#fff' },
  circleDone: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  num: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },
  numActive: { color: '#1A237E' },
  label: { fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: '600', textAlign: 'center' },
  labelActive: { color: '#fff' },
  line: { flex: 1, height: 1.5, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 18 },
  lineDone: { backgroundColor: '#4CAF50' },
});
