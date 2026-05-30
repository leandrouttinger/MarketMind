import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { UserLevel } from '../utils/questionPicker';
import { ICONS, BUCK, BUCK_VID, BACKGROUNDS, SHARED_VID } from '../utils/imageAssets';
import MascotVideo from '../components/MascotVideo';
import { useLanguage } from '../contexts/LanguageContext';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';

interface Props {
  userName: string;
  level: UserLevel;
  streak: number;
  quizDoneToday: boolean;
  onStartQuiz: () => void;
}

function AnimatedFlame({ streak, bigPop }: { streak: number; bigPop: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const popScale = useRef(new Animated.Value(0)).current;
  const popOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.18, duration: 700, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.95, duration: 500, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.1, duration: 400, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!bigPop) return;
    popScale.setValue(0.3);
    popOpacity.setValue(1);
    Animated.parallel([
      Animated.spring(popScale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 5 }),
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(popOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, [bigPop]);

  return (
    <View style={flames.wrapper}>
      <Animated.View
        style={[flames.bigPop, { transform: [{ scale: popScale }], opacity: popOpacity }]}
        pointerEvents="none"
      >
        <Image source={ICONS.flame} style={{ width: 56, height: 56 }} resizeMode="contain" />
        <Text style={flames.bigPopNum}>+1 Streak!</Text>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={flames.badge}>
          <MascotVideo video={SHARED_VID.flameGreen} fallback={ICONS.flame} size={28} loop />
          <Text style={flames.streakNum}>{streak}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const flames = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0A1A0A', borderRadius: 99,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1.5, borderColor: `${BRAND}60`, gap: 4,
  },
  flameImg: { width: 22, height: 22 },
  streakNum: { color: BRAND, fontSize: 15, fontWeight: '800' },
  bigPop: { position: 'absolute', top: -80, alignItems: 'center', zIndex: 10 },
  bigPopNum: { color: BRAND, fontSize: 18, fontWeight: '800', marginTop: -4 },
});

export default function HomeScreen({ userName, level, streak, quizDoneToday, onStartQuiz }: Props) {
  const { t } = useLanguage();
  const [showPop] = useState(streak > 1);

  const levelLabel = level === 'beginner'
    ? `${t('level')}: Beginner 🌱`
    : level === 'intermediate'
    ? `${t('level')}: Intermediate 📊`
    : `${t('level')}: Advanced 🏆`;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>MM</Text>
        </View>
        <AnimatedFlame streak={streak} bigPop={showPop} />
      </View>

      <View style={styles.content}>
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>

        <View style={[styles.dailyCard, quizDoneToday && styles.dailyCardDone]}>
          <Image
            source={BACKGROUNDS.tradingRoom}
            style={styles.dailyCardBg}
            blurRadius={8}
          />
          <View style={styles.dailyCardContent}>
            <View style={styles.dailyCardTop}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>
                  {quizDoneToday ? `${t('completed').toUpperCase()} ✓` : t('dailyChallenge').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.levelBadge}>{level}</Text>
            </View>
            <Text style={styles.dailyTitle}>
              {quizDoneToday ? t('comeTomorrow') : t('questionsMin')}
            </Text>
            <Text style={styles.dailySub}>
              {quizDoneToday ? t('streakSafe') : t('personalizedDaily')}
            </Text>
            {!quizDoneToday && (
              <TouchableOpacity
                style={styles.startBtn}
                activeOpacity={0.85}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onStartQuiz();
                }}
              >
                <Text style={styles.startBtnText}>{t('startQuiz')}</Text>
              </TouchableOpacity>
            )}
          </View>
          <MascotVideo
            video={quizDoneToday ? BUCK_VID.correct : BUCK_VID.idle}
            fallback={quizDoneToday ? BUCK.correct : BUCK.default}
            width={110} height={130}
            style={styles.dailyCardMascot}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>{t('dayStreak')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{quizDoneToday ? '5' : '0'}</Text>
            <Text style={styles.statLabel}>{t('today')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: BRAND }]}>{level}</Text>
            <Text style={styles.statLabel}>{t('level')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerNote}>{t('newQuestionsAt')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
  },
  logo: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { color: '#000', fontSize: 15, fontWeight: '900' },
  content: { flex: 1, paddingHorizontal: 20, gap: 20 },
  greetingBlock: { gap: 2 },
  greeting: { color: MUTED, fontSize: 17, fontWeight: '400' },
  name: { color: TEXT, fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  dailyCard: {
    backgroundColor: SURFACE,
    borderRadius: 22, overflow: 'hidden',
    borderWidth: 1.5, borderColor: `${BRAND}30`,
    minHeight: 180, position: 'relative',
  },
  dailyCardBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
    opacity: 0.18,
  },
  dailyCardContent: { padding: 20, gap: 10, flex: 1, paddingRight: 100 },
  dailyCardMascot: {
    position: 'absolute', right: -6, bottom: 0,
    width: 110, height: 130,
  },
  dailyCardDone: { borderColor: '#2C2C2E', opacity: 0.8 },
  dailyCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryPill: {
    backgroundColor: `${BRAND}18`, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: `${BRAND}35`,
  },
  categoryText: { color: BRAND, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  levelBadge: { color: MUTED, fontSize: 12 },
  dailyTitle: { color: TEXT, fontSize: 19, fontWeight: '700' },
  dailySub: { color: MUTED, fontSize: 13, lineHeight: 19 },
  startBtn: {
    backgroundColor: BRAND, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  startBtnText: { color: '#000', fontSize: 15, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: SURFACE, borderRadius: 16, padding: 16,
    alignItems: 'center', gap: 4, borderWidth: 1, borderColor: BORDER,
  },
  statValue: { color: TEXT, fontSize: 22, fontWeight: '800' },
  statLabel: { color: MUTED, fontSize: 11, textAlign: 'center' },
  footer: { paddingHorizontal: 20, paddingBottom: 8, alignItems: 'center' },
  footerNote: { color: '#3A3A3C', fontSize: 12 },
});
