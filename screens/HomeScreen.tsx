import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { UserLevel } from '../utils/questionPicker';

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
    // Continuous bounce
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
      {/* Big pop on streak */}
      <Animated.View
        style={[flames.bigPop, { transform: [{ scale: popScale }], opacity: popOpacity }]}
        pointerEvents="none"
      >
        <Text style={flames.bigPopText}>🔥</Text>
        <Text style={flames.bigPopNum}>+1 Streak!</Text>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={flames.badge}>
          <Text style={flames.flameEmoji}>🔥</Text>
          <Text style={flames.streakNum}>{streak}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const flames = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1208',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: '#FF6B00',
    gap: 4,
  },
  flameEmoji: { fontSize: 16 },
  streakNum: { color: '#FF8C00', fontSize: 15, fontWeight: '800' },
  bigPop: {
    position: 'absolute',
    top: -80,
    alignItems: 'center',
    zIndex: 10,
  },
  bigPopText: { fontSize: 64 },
  bigPopNum: { color: '#FF8C00', fontSize: 18, fontWeight: '800', marginTop: -8 },
});

export default function HomeScreen({ userName, level, streak, quizDoneToday, onStartQuiz }: Props) {
  const [showPop] = useState(streak > 1);
  const levelLabel = level === 'beginner' ? 'Beginner 🌱' : level === 'intermediate' ? 'Intermediate 📊' : 'Advanced 🏆';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>MM</Text>
        </View>
        <AnimatedFlame streak={streak} bigPop={showPop} />
      </View>

      <View style={styles.content}>
        {/* Greeting */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>

        {/* Daily card */}
        <View style={[styles.dailyCard, quizDoneToday && styles.dailyCardDone]}>
          <View style={styles.dailyCardTop}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>
                {quizDoneToday ? 'COMPLETED TODAY ✓' : 'DAILY QUIZ'}
              </Text>
            </View>
            <Text style={styles.levelBadge}>{levelLabel}</Text>
          </View>
          <Text style={styles.dailyTitle}>
            {quizDoneToday ? 'Come back tomorrow!' : '5 questions · ~5 min'}
          </Text>
          <Text style={styles.dailySub}>
            {quizDoneToday
              ? 'You\'ve finished today\'s quiz. Your streak is safe. 🎉'
              : 'Personalized to your level. New questions every day.'}
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
              <Text style={styles.startBtnText}>Start Today's Quiz →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{quizDoneToday ? '5' : '0'}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: BRAND }]}>{levelLabel.split(' ')[0]}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerNote}>New questions unlock at midnight ✦</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#000', fontSize: 15, fontWeight: '900' },

  content: { flex: 1, paddingHorizontal: 20, gap: 20 },

  greetingBlock: { gap: 2 },
  greeting: { color: MUTED, fontSize: 17, fontWeight: '400' },
  name: { color: TEXT, fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },

  dailyCard: {
    backgroundColor: SURFACE,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: `${BRAND}30`,
    gap: 10,
  },
  dailyCardDone: { borderColor: '#2C2C2E', opacity: 0.8 },
  dailyCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryPill: {
    backgroundColor: `${BRAND}18`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${BRAND}35`,
  },
  categoryText: { color: BRAND, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  levelBadge: { color: MUTED, fontSize: 12 },
  dailyTitle: { color: TEXT, fontSize: 19, fontWeight: '700' },
  dailySub: { color: MUTED, fontSize: 13, lineHeight: 19 },
  startBtn: {
    backgroundColor: BRAND,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  startBtnText: { color: '#000', fontSize: 15, fontWeight: '800' },

  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statValue: { color: TEXT, fontSize: 22, fontWeight: '800' },
  statLabel: { color: MUTED, fontSize: 11, textAlign: 'center' },

  footer: { paddingHorizontal: 20, paddingBottom: 8, alignItems: 'center' },
  footerNote: { color: '#3A3A3C', fontSize: 12 },
});
