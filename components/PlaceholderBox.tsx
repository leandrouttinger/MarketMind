import React from 'react';
import { View, Text, StyleSheet, DimensionValue } from 'react-native';

interface Props {
  label: string;
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
}

export default function PlaceholderBox({
  label,
  width = '100%',
  height = 180,
  borderRadius = 14,
}: Props) {
  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <Text style={styles.icon}>◫</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.hint}>Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141414',
    borderWidth: 1.5,
    borderColor: '#2C2C2E',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  icon: {
    color: '#3A3A3C',
    fontSize: 28,
  },
  label: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  hint: {
    color: '#2C2C2E',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
