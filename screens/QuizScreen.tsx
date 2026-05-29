import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { getDailyQuestions, getDailyChallenge, UserLevel } from '../utils/questionPicker';
import { Question } from '../data/questions';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';
const ERROR = '#FF453A';

interface Props {
  level: UserLevel;
  goals?: string[];
  streak: number;
  isDailyChallenge?: boolean;
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
}

export default function QuizScreen({ level, goals = [], streak, isDailyChallenge = false, onComplete, onExit }: Props) {
  const [questions] = useState<Question[]>(() =>
    isDailyChallenge ? getDailyChallenge(5) : getDailyQuestions(level, goals, 5)
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  // Animations
  const sheetY = useRef(new Animated.Value(300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const correctScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const question = questions[index];
  const progress = (index + 1) / questions.length;
  const isCorrect = selected === question?.correct;

  const showFeedback = () => {
    Animated.parallel([
      Animated.spring(sheetY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
      Animated.timing(overlayOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const hideFeedback = (cb: () => void) => {
    Animated.parallel([
      Animated.timing(sheetY, { toValue: 300, duration: 200, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      cardOpacity.setValue(0);
      cb();
      Animated.timing(cardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const handleSelect = async (id: string) => {
    if (revealed) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(id);
    setRevealed(true);
    const correct = id === question.correct;
    if (correct) {
      setScore(s => s + 1);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.sequence([
        Animated.spring(correctScale, { toValue: 1.08, useNativeDriver: true, tension: 200 }),
        Animated.spring(correctScale, { toValue: 1, useNativeDriver: true, tension: 200 }),
      ]).start();
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setTimeout(showFeedback, 300);
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = index + 1;
    if (next >= questions.length) {
      hideFeedback(() => onComplete(score + (isCorrect ? 1 : 0), questions.length));
    } else {
      hideFeedback(() => {
        setIndex(next);
        setSelected(null);
        setRevealed(false);
        sheetY.setValue(300);
        overlayOpacity.setValue(0);
      });
    }
  };

  if (!question) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.exitBtn}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak}</Text>
        </View>
      </View>

      {/* Question card */}
      <Animated.View style={[styles.questionArea, { opacity: cardOpacity }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.questionContent}>
          <View style={styles.meta}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{question.category.toUpperCase()}</Text>
            </View>
            <Text style={styles.difficultyDots}>
              {'●'.repeat(question.difficulty)}{'○'.repeat(3 - question.difficulty)}
            </Text>
          </View>

          <Text style={styles.questionText}>{question.text}</Text>

          <View style={styles.options}>
            {question.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isRight = revealed && opt.id === question.correct;
              const isWrong = revealed && isSelected && !isRight;
              const isDimmed = revealed && !isSelected && !isRight;

              return (
                <Animated.View
                  key={opt.id}
                  style={isRight && revealed ? { transform: [{ scale: correctScale }] } : undefined}
                >
                  <TouchableOpacity
                    style={[
                      styles.option,
                      isRight && styles.optionCorrect,
                      isWrong && styles.optionWrong,
                      isDimmed && styles.optionDimmed,
                    ]}
                    onPress={() => handleSelect(opt.id)}
                    activeOpacity={0.7}
                    disabled={revealed}
                  >
                    <View style={[
                      styles.optionKey,
                      isRight && styles.optionKeyCorrect,
                      isWrong && styles.optionKeyWrong,
                    ]}>
                      <Text style={styles.optionKeyText}>{opt.id}</Text>
                    </View>
                    <Text style={[styles.optionText, isRight && styles.optionTextCorrect]}>
                      {opt.text}
                    </Text>
                    {isRight && <Text style={styles.tick}>✓</Text>}
                    {isWrong && <Text style={styles.cross}>✕</Text>}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Feedback bottom sheet */}
      {revealed && (
        <>
          <Animated.View
            style={[styles.sheetOverlay, { opacity: overlayOpacity }]}
            pointerEvents="none"
          />
          <Animated.View
            style={[
              styles.sheet,
              isCorrect ? styles.sheetCorrect : styles.sheetWrong,
              { transform: [{ translateY: sheetY }] },
            ]}
          >
            <Text style={styles.sheetEmoji}>{isCorrect ? '🎯' : '💡'}</Text>
            <Text style={[styles.sheetTitle, isCorrect ? styles.sheetTitleCorrect : styles.sheetTitleWrong]}>
              {isCorrect ? 'Correct!' : 'Not quite'}
            </Text>
            <Text style={styles.sheetExplanation}>{question.explanation}</Text>
            <TouchableOpacity
              style={[styles.continueBtn, isCorrect ? styles.continueBtnCorrect : styles.continueBtnWrong]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>
                {index < questions.length - 1 ? 'Continue' : 'See Results'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  exitBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: { color: MUTED, fontSize: 14, fontWeight: '700' },
  progressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: SURFACE,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BRAND,
    borderRadius: 99,
  },
  streakBadge: {
    backgroundColor: SURFACE,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: BORDER,
  },
  streakText: { color: TEXT, fontSize: 13, fontWeight: '700' },

  questionArea: { flex: 1 },
  questionContent: { paddingHorizontal: 20, paddingBottom: 20 },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryPill: {
    backgroundColor: `${BRAND}18`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: `${BRAND}35`,
  },
  categoryText: { color: BRAND, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  difficultyDots: { color: BRAND, fontSize: 12, letterSpacing: 2 },

  questionText: {
    color: TEXT,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 31,
    letterSpacing: -0.3,
    marginBottom: 28,
  },

  options: { gap: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: BORDER,
    gap: 14,
  },
  optionCorrect: { borderColor: BRAND, backgroundColor: `${BRAND}14` },
  optionWrong: { borderColor: ERROR, backgroundColor: `${ERROR}10` },
  optionDimmed: { opacity: 0.3 },

  optionKey: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionKeyCorrect: { backgroundColor: BRAND },
  optionKeyWrong: { backgroundColor: ERROR },
  optionKeyText: { color: TEXT, fontSize: 14, fontWeight: '800' },
  optionText: { flex: 1, color: TEXT, fontSize: 15, fontWeight: '500', lineHeight: 21 },
  optionTextCorrect: { color: BRAND, fontWeight: '600' },
  tick: { color: BRAND, fontSize: 18, fontWeight: '900' },
  cross: { color: ERROR, fontSize: 16, fontWeight: '900' },

  // Bottom sheet
  sheetOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 28,
    gap: 10,
    borderTopWidth: 1,
  },
  sheetCorrect: {
    backgroundColor: '#0D1F17',
    borderTopColor: `${BRAND}40`,
  },
  sheetWrong: {
    backgroundColor: '#1F0D0D',
    borderTopColor: `${ERROR}40`,
  },
  sheetEmoji: { fontSize: 28 },
  sheetTitle: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  sheetTitleCorrect: { color: BRAND },
  sheetTitleWrong: { color: ERROR },
  sheetExplanation: {
    color: '#C7C7CC',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  continueBtn: {
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 4,
  },
  continueBtnCorrect: { backgroundColor: BRAND },
  continueBtnWrong: { backgroundColor: ERROR },
  continueBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
});
