import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BUCK, GRIZ, BOTH } from '../utils/imageAssets';

const BRAND  = '#10B981';
const BG     = '#0F0F0F';
const SURFACE = '#1A1A1A';
const BORDER  = '#2C2C2E';
const TEXT    = '#FFFFFF';
const MUTED   = '#6B7280';
const BULL_COLOR = '#10B981';
const BEAR_COLOR = '#3B82F6';

const W = Dimensions.get('window').width;

export type Faction = 'bull' | 'bear';

interface Props {
  userName: string;
  onComplete: (faction: Faction) => void;
}

export default function FactionScreen({ userName, onComplete }: Props) {
  const [selected, setSelected] = useState<Faction | null>(null);
  const fadeIn   = useRef(new Animated.Value(0)).current;
  const bullScale = useRef(new Animated.Value(1)).current;
  const bearScale = useRef(new Animated.Value(1)).current;

  // Mock global ratio
  const BULL_PCT = 54;
  const BEAR_PCT = 46;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const handleSelect = async (faction: Faction) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelected(faction);
    const scale = faction === 'bull' ? bullScale : bearScale;
    const other = faction === 'bull' ? bearScale : bullScale;
    Animated.parallel([
      Animated.spring(scale, { toValue: 1.06, useNativeDriver: true, tension: 200, friction: 6 }),
      Animated.spring(other, { toValue: 0.94, useNativeDriver: true, tension: 200, friction: 6 }),
    ]).start();
  };

  const handleJoin = async () => {
    if (!selected) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete(selected);
  };

  const color = selected === 'bull' ? BULL_COLOR : selected === 'bear' ? BEAR_COLOR : BRAND;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.inner, { opacity: fadeIn }]}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose your side.</Text>
          <Text style={styles.subtitle}>
            {userName}, every quiz you complete earns XP for your faction.{'\n'}
            Switch once per month if you change your mind.
          </Text>
        </View>

        {/* Global ratio bar */}
        <View style={styles.ratioWrap}>
          <View style={styles.ratioBar}>
            <View style={[styles.ratioFill, { width: `${BULL_PCT}%`, backgroundColor: BULL_COLOR }]} />
          </View>
          <View style={styles.ratioLabels}>
            <Text style={[styles.ratioLabel, { color: BULL_COLOR }]}>🐂 Bulls {BULL_PCT}%</Text>
            <Text style={[styles.ratioLabel, { color: BEAR_COLOR }]}>{BEAR_PCT}% Bears 🐻</Text>
          </View>
          <Text style={styles.ratioHint}>Global this week</Text>
        </View>

        {/* Both mascots / selection cards */}
        <View style={styles.cards}>

          {/* Bull card */}
          <Animated.View style={{ transform: [{ scale: bullScale }], flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.factionCard,
                { borderColor: selected === 'bull' ? BULL_COLOR : BORDER },
                selected === 'bull' && { backgroundColor: `${BULL_COLOR}10` },
              ]}
              onPress={() => handleSelect('bull')}
              activeOpacity={0.85}
            >
              <Image source={BUCK.faction} style={styles.mascotImg} resizeMode="contain" />
              <Text style={[styles.factionName, { color: BULL_COLOR }]}>The Bulls</Text>
              <Text style={styles.factionDesc}>Optimists.{'\n'}Growth mindset.</Text>
              {selected === 'bull' && (
                <View style={[styles.selectedBadge, { backgroundColor: BULL_COLOR }]}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Bear card */}
          <Animated.View style={{ transform: [{ scale: bearScale }], flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.factionCard,
                { borderColor: selected === 'bear' ? BEAR_COLOR : BORDER },
                selected === 'bear' && { backgroundColor: `${BEAR_COLOR}10` },
              ]}
              onPress={() => handleSelect('bear')}
              activeOpacity={0.85}
            >
              <Image source={GRIZ.faction} style={styles.mascotImg} resizeMode="contain" />
              <Text style={[styles.factionName, { color: BEAR_COLOR }]}>The Bears</Text>
              <Text style={styles.factionDesc}>Realists.{'\n'}Risk-aware.</Text>
              {selected === 'bear' && (
                <View style={[styles.selectedBadge, { backgroundColor: BEAR_COLOR }]}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.joinBtn, !selected && styles.joinBtnOff, selected && { backgroundColor: color }]}
          onPress={handleJoin}
          activeOpacity={0.85}
          disabled={!selected}
        >
          <Text style={[styles.joinBtnText, !selected && { color: MUTED }]}>
            {selected
              ? `Join the ${selected === 'bull' ? 'Bulls' : 'Bears'} →`
              : 'Pick a side first'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.switchNote}>You can switch factions once per month.</Text>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  inner: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 20 },

  header: { gap: 8 },
  title: { color: TEXT, fontSize: 30, fontWeight: '900', letterSpacing: -0.6 },
  subtitle: { color: MUTED, fontSize: 14, lineHeight: 21 },

  ratioWrap: { gap: 6 },
  ratioBar: {
    height: 8, backgroundColor: `${BEAR_COLOR}30`,
    borderRadius: 99, overflow: 'hidden',
  },
  ratioFill: { height: '100%', borderRadius: 99 },
  ratioLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  ratioLabel: { fontSize: 12, fontWeight: '700' },
  ratioHint: { color: MUTED, fontSize: 11, textAlign: 'center' },

  cards: { flexDirection: 'row', gap: 12, flex: 1 },
  factionCard: {
    flex: 1, backgroundColor: SURFACE, borderRadius: 20,
    borderWidth: 2, alignItems: 'center',
    justifyContent: 'center', padding: 16, gap: 8,
    position: 'relative',
  },
  mascotImg: { width: '100%', height: 130 },
  factionName: { fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  factionDesc: { color: MUTED, fontSize: 12, textAlign: 'center', lineHeight: 17 },
  selectedBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  selectedBadgeText: { color: '#000', fontSize: 12, fontWeight: '900' },

  joinBtn: {
    borderRadius: 16, paddingVertical: 18, alignItems: 'center',
  },
  joinBtnOff: { backgroundColor: SURFACE },
  joinBtnText: { color: '#000', fontSize: 16, fontWeight: '900' },

  switchNote: { color: MUTED, fontSize: 11, textAlign: 'center' },
});
