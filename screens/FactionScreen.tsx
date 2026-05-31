import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MascotVideo from '../components/MascotVideo';
import { BUCK_VID, GRIZ_VID, BUCK, GRIZ } from '../utils/imageAssets';
import { useLanguage } from '../contexts/LanguageContext';

const BG         = '#0F0F0F';
const BORDER     = '#2C2C2E';
const TEXT       = '#FFFFFF';
const MUTED      = '#6B7280';
const BULL_COLOR = '#10B981';
const BEAR_COLOR = '#3B82F6';

export type Faction = 'bull' | 'bear' | null;

interface Props {
  userName: string;
  onComplete: (faction: 'bull' | 'bear') => void;
}

export default function FactionScreen({ userName, onComplete }: Props) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<'bull' | 'bear' | null>(null);
  const fadeIn    = useRef(new Animated.Value(0)).current;
  const bullScale = useRef(new Animated.Value(1)).current;
  const bearScale = useRef(new Animated.Value(1)).current;

  const BULL_PCT = 54;
  const BEAR_PCT = 46;
  const BULL_XP  = 24530;
  const BEAR_XP  = 21840;

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

  const btnColor = selected === 'bull' ? BULL_COLOR : selected === 'bear' ? BEAR_COLOR : '#1C1C1E';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.inner, { opacity: fadeIn }]}>

        <View style={styles.header}>
          <Text style={styles.title}>{t('factionTitle')}</Text>
          <Text style={styles.subtitle}>{t('factionSubtitle')}</Text>
        </View>

        {/* Ratio bar */}
        <View style={styles.ratioWrap}>
          <View style={styles.ratioBar}>
            <View style={[styles.ratioFill, { flex: BULL_PCT, backgroundColor: BULL_COLOR }]} />
            <View style={[styles.ratioFill, { flex: BEAR_PCT, backgroundColor: BEAR_COLOR }]} />
          </View>
          <View style={styles.ratioLabels}>
            <Text style={[styles.ratioLabel, { color: BULL_COLOR }]}>Bulls {BULL_PCT}%</Text>
            <Text style={styles.ratioHint}>This week</Text>
            <Text style={[styles.ratioLabel, { color: BEAR_COLOR }]}>{BEAR_PCT}% Bears</Text>
          </View>
        </View>

        {/* Mascot selection row */}
        <View style={styles.mascotRow}>

          {/* Bull */}
          <TouchableOpacity style={styles.side} onPress={() => handleSelect('bull')} activeOpacity={0.85}>
            <Animated.View style={[styles.mascotWrap, selected === 'bull' && { borderColor: BULL_COLOR, backgroundColor: `${BULL_COLOR}08` }, { transform: [{ scale: bullScale }] }]}>
              <MascotVideo
                video={BUCK_VID.faction}
                fallback={BUCK.faction}
                size={130}
                bgColor={selected === 'bull' ? '#0D1F17' : '#111'}
              />
            </Animated.View>
            <Text style={[styles.factionName, selected === 'bull' && { color: BULL_COLOR }]}>
              {t('factionBullsName')}
            </Text>
            <Text style={styles.factionXP}>{BULL_XP.toLocaleString()} XP</Text>
            {selected === 'bull' && (
              <View style={[styles.checkBadge, { backgroundColor: BULL_COLOR }]}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.vsDivider}>
            <Text style={styles.vs}>VS</Text>
          </View>

          {/* Bear */}
          <TouchableOpacity style={styles.side} onPress={() => handleSelect('bear')} activeOpacity={0.85}>
            <Animated.View style={[styles.mascotWrap, selected === 'bear' && { borderColor: BEAR_COLOR, backgroundColor: `${BEAR_COLOR}08` }, { transform: [{ scale: bearScale }] }]}>
              <MascotVideo
                video={GRIZ_VID.faction}
                fallback={GRIZ.faction}
                size={130}
                bgColor={selected === 'bear' ? '#0D1527' : '#111'}
              />
            </Animated.View>
            <Text style={[styles.factionName, selected === 'bear' && { color: BEAR_COLOR }]}>
              {t('factionBearsName')}
            </Text>
            <Text style={styles.factionXP}>{BEAR_XP.toLocaleString()} XP</Text>
            {selected === 'bear' && (
              <View style={[styles.checkBadge, { backgroundColor: BEAR_COLOR }]}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

        </View>

        {/* Descriptions */}
        <View style={styles.descs}>
          <View style={[styles.descCard, selected === 'bull' && { borderColor: `${BULL_COLOR}60` }]}>
            <Text style={[styles.descText, selected === 'bull' && { color: BULL_COLOR }]}>{t('factionBullsDesc')}</Text>
          </View>
          <View style={[styles.descCard, selected === 'bear' && { borderColor: `${BEAR_COLOR}60` }]}>
            <Text style={[styles.descText, selected === 'bear' && { color: BEAR_COLOR }]}>{t('factionBearsDesc')}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.joinBtn, { backgroundColor: btnColor }]}
          onPress={handleJoin}
          activeOpacity={0.85}
          disabled={!selected}
        >
          <Text style={[styles.joinBtnText, !selected && { color: MUTED }]}>
            {selected ? (selected === 'bull' ? t('joinBulls') : t('joinBears')) : t('pickSide')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.switchNote}>{t('switchNote')}</Text>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  inner: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 14 },

  header: { gap: 6 },
  title:    { color: TEXT, fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: MUTED, fontSize: 13, lineHeight: 20 },

  ratioWrap: { gap: 5 },
  ratioBar:  { flexDirection: 'row', height: 8, borderRadius: 99, overflow: 'hidden' },
  ratioFill: { height: '100%' },
  ratioLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratioLabel:  { fontSize: 12, fontWeight: '700' },
  ratioHint:   { color: MUTED, fontSize: 11 },

  mascotRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  side: { flex: 1, alignItems: 'center', gap: 8, position: 'relative' },
  mascotWrap: {
    borderRadius: 24, borderWidth: 2,
    borderColor: '#222', padding: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  factionName: { color: TEXT, fontSize: 15, fontWeight: '800' },
  factionXP:   { color: MUTED, fontSize: 11 },
  checkBadge: {
    position: 'absolute', top: 2, right: 8,
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { color: '#000', fontSize: 12, fontWeight: '900' },

  vsDivider: { paddingHorizontal: 10 },
  vs: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },

  descs: { flexDirection: 'row', gap: 8 },
  descCard: {
    flex: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12,
    borderWidth: 1, borderColor: BORDER, backgroundColor: '#111', alignItems: 'center',
  },
  descText: { color: MUTED, fontSize: 12, textAlign: 'center' },

  joinBtn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  joinBtnText: { color: '#000', fontSize: 16, fontWeight: '900' },
  switchNote: { color: MUTED, fontSize: 11, textAlign: 'center' },
});
