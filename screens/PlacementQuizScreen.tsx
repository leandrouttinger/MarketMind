import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { levelFromScore, UserLevel } from '../utils/questionPicker';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';
const ERROR = '#FF453A';

const QUESTIONS = [
  {
    category: 'Markets',
    text: 'What does "Bull Market" mean?',
    options: [
      { id: 'A', text: 'Prices falling over months' },
      { id: 'B', text: 'Prices rising over a sustained period' },
      { id: 'C', text: 'High volatility with no clear trend' },
      { id: 'D', text: 'Very low trading volume' },
    ],
    correct: 'B',
    explanation: 'A Bull Market means prices are rising over a sustained period (20%+ gains). The S&P 500 is in a bull market more than 70% of all trading days in history.',
  },
  {
    category: 'Stocks',
    text: 'What does P/E Ratio measure?',
    options: [
      { id: 'A', text: 'Stock price divided by annual earnings per share' },
      { id: 'B', text: 'Annual profit multiplied by stock price' },
      { id: 'C', text: 'Dividend divided by share price' },
      { id: 'D', text: 'Market cap minus total debt' },
    ],
    correct: 'A',
    explanation: "P/E Ratio = how much investors pay per $1 of earnings. P/E 20 means you're paying 20× annual earnings. S&P 500 historical average: 15–20.",
  },
  {
    category: 'Bonds',
    text: 'When interest rates rise, what happens to bond prices?',
    options: [
      { id: 'A', text: 'Prices rise proportionally' },
      { id: 'B', text: 'Prices stay the same' },
      { id: 'C', text: 'Prices fall' },
      { id: 'D', text: 'Bonds are automatically redeemed' },
    ],
    correct: 'C',
    explanation: 'Bonds and rates move inversely. Rising rates → existing bonds lose value because new bonds pay better. Longer-duration bonds are most affected.',
  },
  {
    category: 'Options',
    text: 'What does a Call Option give you?',
    options: [
      { id: 'A', text: 'The obligation to buy a stock' },
      { id: 'B', text: 'The right to sell a stock at a fixed price' },
      { id: 'C', text: 'The right to buy a stock at a fixed price' },
      { id: 'D', text: 'A guaranteed dividend payment' },
    ],
    correct: 'C',
    explanation: "Call = right (not obligation) to BUY at the strike price. Put = right to SELL. Options expire worthless if the market moves against you.",
  },
  {
    category: 'Risk',
    text: 'What does the Sharpe Ratio measure?',
    options: [
      { id: 'A', text: 'Total return of a portfolio' },
      { id: 'B', text: 'Risk-adjusted return per unit of volatility' },
      { id: 'C', text: 'Maximum loss during a crisis' },
      { id: 'D', text: 'Correlation between two assets' },
    ],
    correct: 'B',
    explanation: 'Sharpe Ratio = (Return − Risk-Free Rate) ÷ Volatility. Above 1 = good. Above 2 = excellent. It shows return per unit of risk.',
  },
];

// ── Mascot placeholder ────────────────────────────────────────────────────────
function MascotPlaceholder({ size = 160 }: { size?: number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[mp.wrap, { width: size, height: size, borderRadius: size * 0.28 }, { transform: [{ scale: pulse }] }]}>
      <Text style={mp.icon}>◈</Text>
      <Text style={mp.label}>MASCOT</Text>
      <Text style={mp.sub}>Banana AI</Text>
    </Animated.View>
  );
}
const mp = StyleSheet.create({
  wrap: {
    backgroundColor: `${BRAND}0A`, borderWidth: 1.5,
    borderColor: `${BRAND}35`, alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  icon: { fontSize: 40, color: `${BRAND}60` },
  label: { color: `${BRAND}80`, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  sub: { color: `${BRAND}40`, fontSize: 9, letterSpacing: 0.8 },
});

interface Props {
  userName: string;
  onComplete: (level: UserLevel) => void;
}

export default function PlacementQuizScreen({ userName, onComplete }: Props) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const question = QUESTIONS[index];
  const progress = (index + 1) / QUESTIONS.length;
  const isCorrect = selected === question?.correct;

  const handleSelect = async (id: string) => {
    if (revealed) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(id);
    setRevealed(true);
    if (id === question.correct) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore(s => s + 1);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = index + 1;
    if (next < QUESTIONS.length) {
      setIndex(next);
      setSelected(null);
      setRevealed(false);
    } else {
      setDone(true);
    }
  };

  const getLevel = () => {
    if (score <= 1) return { label: 'Beginner',     emoji: '🌱', color: '#60A5FA', desc: "Everyone starts somewhere. Your path is set." };
    if (score <= 3) return { label: 'Intermediate', emoji: '📊', color: BRAND,     desc: "Solid base. Time to level up from here." };
    return             { label: 'Advanced',       emoji: '🏆', color: '#F59E0B', desc: "Strong. We'll keep you challenged." };
  };

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.introWrap, { opacity: fadeIn }]}>
          <MascotPlaceholder size={180} />

          <View style={styles.introTextBlock}>
            <Text style={styles.introReady}>
              Bist du ready,{'\n'}{userName}?
            </Text>
            <Text style={styles.introDesc}>
              5 Fragen. 2 Minuten. Wir finden heraus{'\n'}
              wo du wirklich stehst — und stellen deinen{'\n'}
              Lernpfad genau darauf ein.
            </Text>
          </View>

          <View style={styles.introBadges}>
            {['5 Questions', '~2 min', 'No pressure'].map((b, i) => (
              <View key={i} style={styles.badge}>
                <Text style={styles.badgeText}>{b}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.startBtn}
            onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); setStarted(true); }}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>Let's find my level →</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (done) {
    const level = getLevel();
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultWrap}>
          <Text style={styles.resultEmoji}>{level.emoji}</Text>
          <Text style={styles.resultScore}>{score}/{QUESTIONS.length} correct</Text>
          <Text style={[styles.resultLevel, { color: level.color }]}>{level.label} Investor</Text>
          <Text style={styles.resultDesc}>{level.desc}</Text>
          <Text style={styles.resultName}>
            Great start, {userName}. Your daily quiz is now personalized.
          </Text>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); onComplete(levelFromScore(score, QUESTIONS.length)); }}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Start Learning →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Quiz screen ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerLabel}>Level Assessment</Text>
          <Text style={styles.questionCount}>{index + 1} / {QUESTIONS.length}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{question.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.questionText}>{question.text}</Text>

        <View style={styles.options}>
          {question.options.map((opt) => {
            const isSelected = selected === opt.id;
            const isRight = revealed && opt.id === question.correct;
            const isWrong = revealed && isSelected && !isRight;
            const isDimmed = revealed && !isSelected && !isRight;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.option, isRight && styles.optionCorrect, isWrong && styles.optionWrong, isDimmed && styles.optionDimmed]}
                onPress={() => handleSelect(opt.id)}
                activeOpacity={0.75}
                disabled={revealed}
              >
                <View style={[styles.optionLetter, isRight && styles.letterCorrect, isWrong && styles.letterWrong]}>
                  <Text style={styles.letterChar}>{opt.id}</Text>
                </View>
                <Text style={styles.optionText}>{opt.text}</Text>
                {isRight && <Text style={styles.checkmark}>✓</Text>}
                {isWrong && <Text style={styles.cross}>✕</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {revealed && (
          <View style={[styles.explanation, isCorrect ? styles.explanationCorrect : styles.explanationWrong]}>
            <Text style={styles.explanationHeader}>{isCorrect ? '🎯 Correct!' : '✗ Not quite.'}</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {revealed && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>
              {index < QUESTIONS.length - 1 ? 'Next Question →' : 'See My Level →'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Intro
  introWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 28 },
  introTextBlock: { alignItems: 'center', gap: 10 },
  introReady: { color: TEXT, fontSize: 32, fontWeight: '900', textAlign: 'center', letterSpacing: -0.7, lineHeight: 40 },
  introDesc: { color: MUTED, fontSize: 15, textAlign: 'center', lineHeight: 23 },
  introBadges: { flexDirection: 'row', gap: 8 },
  badge: {
    backgroundColor: SURFACE, borderRadius: 99,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: BORDER,
  },
  badgeText: { color: MUTED, fontSize: 12, fontWeight: '600' },
  startBtn: {
    backgroundColor: BRAND, borderRadius: 16,
    paddingVertical: 18, paddingHorizontal: 48, alignItems: 'center',
    width: '100%',
    shadowColor: BRAND, shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
  },
  startBtnText: { color: '#000', fontSize: 16, fontWeight: '900' },

  // Result
  resultWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  resultEmoji: { fontSize: 72, marginBottom: 8 },
  resultScore: { color: TEXT, fontSize: 28, fontWeight: '800' },
  resultLevel: { fontSize: 20, fontWeight: '700' },
  resultDesc: { color: MUTED, fontSize: 14, textAlign: 'center' },
  resultName: { color: MUTED, fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: 4 },
  continueBtn: {
    backgroundColor: BRAND, borderRadius: 16,
    paddingVertical: 18, paddingHorizontal: 48,
    alignItems: 'center', width: '100%', marginTop: 12,
  },
  continueBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },

  // Quiz
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLabel: { color: MUTED, fontSize: 13, fontWeight: '600' },
  questionCount: { color: MUTED, fontSize: 13 },
  progressTrack: { height: 5, backgroundColor: SURFACE, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: BRAND, borderRadius: 99 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },

  categoryPill: {
    backgroundColor: `${BRAND}18`, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: `${BRAND}35`,
    alignSelf: 'flex-start', marginBottom: 18,
  },
  categoryText: { color: BRAND, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  questionText: {
    color: TEXT, fontSize: 22, fontWeight: '700',
    lineHeight: 31, letterSpacing: -0.4, marginBottom: 28,
  },

  options: { gap: 11 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: SURFACE, borderRadius: 16,
    padding: 16, borderWidth: 1.5, borderColor: BORDER, gap: 14,
  },
  optionCorrect: { borderColor: BRAND, backgroundColor: `${BRAND}12` },
  optionWrong: { borderColor: ERROR, backgroundColor: `${ERROR}10` },
  optionDimmed: { opacity: 0.3 },
  optionLetter: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: BORDER, alignItems: 'center', justifyContent: 'center',
  },
  letterCorrect: { backgroundColor: BRAND },
  letterWrong: { backgroundColor: ERROR },
  letterChar: { color: TEXT, fontSize: 14, fontWeight: '800' },
  optionText: { flex: 1, color: TEXT, fontSize: 15, fontWeight: '500', lineHeight: 21 },
  checkmark: { color: BRAND, fontSize: 18, fontWeight: '700' },
  cross: { color: ERROR, fontSize: 16, fontWeight: '700' },

  explanation: { marginTop: 20, borderRadius: 16, padding: 18, gap: 8 },
  explanationCorrect: { backgroundColor: `${BRAND}12`, borderWidth: 1, borderColor: `${BRAND}28` },
  explanationWrong: { backgroundColor: `${ERROR}10`, borderWidth: 1, borderColor: `${ERROR}25` },
  explanationHeader: { color: TEXT, fontSize: 15, fontWeight: '700' },
  explanationText: { color: '#D1D1D6', fontSize: 14, lineHeight: 22 },

  footer: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12 },
  nextBtn: { backgroundColor: BRAND, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  nextBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
});
