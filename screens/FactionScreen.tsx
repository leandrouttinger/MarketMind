import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BUCK, GRIZ } from '../utils/imageAssets';

const BG         = '#0F0F0F';
const BORDER     = '#2C2C2E';
const TEXT       = '#FFFFFF';
const MUTED      = '#6B7280';
const BULL_COLOR = '#10B981';
const BEAR_COLOR = '#3B82F6';

export type Faction = 'bull' | 'bear';

interface Props {
  userName: string;
  onComplete: (faction: Faction) => void;
}

export default function FactionScreen({ userName, onComplete }: Props) {
  const [selected, setSelected] = useState<Faction | null>(null);
  const fadeIn    = useRef(new Animated.Value(0)).current;
  const bullScale = useRef(new Animated.Value(1)).current;
  const bearScale = useRef(new Animated.Value(1)).current;

  const BULL_PCT = 54;
  const BEAR_PCT = 46;
  const BULL_XP  = 24530;
  const BEAR_XP  = 21840;
  const TOTAL_XP = BULL_XP + BEAR_XP;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleSelect = async (faction: Faction) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelected(faction);
    const s = faction === 'bull' ? bullScale : bearScale;
    const o = faction === 'bull' ? bearScale : bullScale;
    Animated.parallel([
      Animated.spring(s, { toValue: 1.08, useNativeDriver: true, tension: 180, friction: 6 }),
      Animated.spring(o, { toValue: 0.88, useNativeDriver: true, tension: 180, friction: 6 }),
    ]).start();
  };

  const handleJoin = async () => {
    if (!selected) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete(selected);
  };

  const btnColor = selected === 'bull' ? BULL_COLOR : selected === 'bear' ? BEAR_COLOR : '#2C2C2E';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.inner, { opacity: fadeIn }]}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose your side.</Text>
          <Text style={styles.subtitle}>
            Every quiz earns XP for your faction.{'\n'}
            Switch once per month.
          </Text>
        </View>

        {/* Ratio bar */}
        <View style={styles.ratioWrap}>
          <View style={styles.ratioBar}>
            <View style={[styles.ratioFillBull, { flex: BULL_PCT }]} />
            <View style={[styles.ratioFillBear, { flex: BEAR_PCT }]} />
          </View>
          <View style={styles.ratioLabels}>
            <Text style={[styles.ratioLabel, { color: BULL_COLOR }]}>Bulls {BULL_PCT}%</Text>
            <Text style={styles.ratioCenter}>This week</Text>
            <Text style={[styles.ratioLabel, { color: BEAR_COLOR }]}>{BEAR_PCT}% Bears</Text>
          </View>
        </View>

        {/* Mascots — free on dark background */}
        <View style={styles.mascotRow}>

          {/* Bull */}
          <TouchableOpacity style={styles.side} onPress={() => handleSelect('bull')} activeOpacity={0.85}>
            <Animated.View style={{ transform: [{ scale: bullScale }], alignItems: 'center' }}>
              <Image source={BUCK.faction} style={styles.mascotImg} resizeMode="contain" />
            </Animated.View>
            <View style={[
              styles.nameTag,
              selected === 'bull' && { backgroundColor: `${BULL_COLOR}20`, borderColor: BULL_COLOR },
            ]}>
              <Text style={[styles.factionName, selected === 'bull' && { color: BULL_COLOR }]}>
                The Bulls
              </Text>
              <Text style={styles.factionXP}>{BULL_XP.toLocaleString()} XP</Text>
            </View>
            {selected === 'bull' && (
              <View style={[styles.checkBadge, { backgroundColor: BULL_COLOR }]}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* VS divider */}
          <View style={styles.vsDivider}>
            <Text style={styles.vs}>VS</Text>
          </View>

          {/* Bear */}
          <TouchableOpacity style={styles.side} onPress={() => handleSelect('bear')} activeOpacity={0.85}>
            <Animated.View style={{ transform: [{ scale: bearScale }], alignItems: 'center' }}>
              <Image source={GRIZ.faction} style={styles.mascotImg} resizeMode="contain" />
            </Animated.View>
            <View style={[
              styles.nameTag,
              selected === 'bear' && { backgroundColor: `${BEAR_COLOR}20`, borderColor: BEAR_COLOR },
            ]}>
              <Text style={[styles.factionName, selected === 'bear' && { color: BEAR_COLOR }]}>
                The Bears
              </Text>
              <Text style={styles.factionXP}>{BEAR_XP.toLocaleString()} XP</Text>
            </View>
            {selected === 'bear' && (
              <View style={[styles.checkBadge, { backgroundColor: BEAR_COLOR }]}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

        </View>

        {/* Description pills */}
        <View style={styles.pills}>
          <View style={[styles.pill, { borderColor: selected === 'bull' ? BULL_COLOR : BORDER }]}>
            <Text style={[styles.pillText, selected === 'bull' && { color: BULL_COLOR }]}>
              Optimists. Growth mindset.
            </Text>
          </View>
          <View style={[styles.pill, { borderColor: selected === 'bear' ? BEAR_COLOR : BORDER }]}>
            <Text style={[styles.pillText, selected === 'bear' && { color: BEAR_COLOR }]}>
              Realists. Risk-aware.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.joinBtn, { backgroundColor: btnColor }]}
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

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  inner: {
    flex: 1, paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 28, gap: 16,
  },

  header: { gap: 6 },
  title:    { color: TEXT,  fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: MUTED, fontSize: 13, lineHeight: 20 },

  ratioWrap: { gap: 6 },
  ratioBar: {
    flexDirection: 'row', height: 8,
    borderRadius: 99, overflow: 'hidden',
  },
  ratioFillBull: { backgroundColor: BULL_COLOR },
  ratioFillBear: { backgroundColor: BEAR_COLOR },
  ratioLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratioLabel:  { fontSize: 12, fontWeight: '700' },
  ratioCenter: { color: MUTED, fontSize: 11 },

  mascotRow: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  side: { flex: 1, alignItems: 'center', gap: 10, position: 'relative' },
  mascotImg: { width: '100%', height: 160 },

  nameTag: {
    alignItems: 'center', gap: 2, paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 14,
    borderWidth: 1.5, borderColor: BORDER,
    backgroundColor: '#161616',
  },
  factionName: { color: TEXT, fontSize: 14, fontWeight: '800' },
  factionXP:   { color: MUTED, fontSize: 11 },

  checkBadge: {
    position: 'absolute', top: 0, right: 8,
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { color: '#000', fontSize: 13, fontWeight: '900' },

  vsDivider: { paddingHorizontal: 8, alignItems: 'center' },
  vs: { color: '#333', fontSize: 20, fontWeight: '900' },

  pills: { flexDirection: 'row', gap: 8 },
  pill: {
    flex: 1, borderRadius: 10, paddingVertical: 8,
    paddingHorizontal: 10, borderWidth: 1,
    backgroundColor: '#111', alignItems: 'center',
  },
  pillText: { color: MUTED, fontSize: 12, textAlign: 'center' },

  joinBtn: {
    borderRadius: 16, paddingVertical: 18, alignItems: 'center',
  },
  joinBtnText: { color: '#000', fontSize: 16, fontWeight: '900' },
});
