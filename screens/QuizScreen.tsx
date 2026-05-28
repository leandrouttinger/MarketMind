import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';

const QUESTION = {
  category: 'Basics',
  number: 1,
  total: 10,
  text: 'Was bezeichnet man als "Bull Market"?',
  options: [
    { id: 'A', text: 'Ein Markt mit stark fallenden Kursen' },
    { id: 'B', text: 'Ein Markt mit steigenden Kursen über Zeit' },
    { id: 'C', text: 'Ein Markt mit extremer Volatilität' },
    { id: 'D', text: 'Ein Markt mit niedrigem Handelsvolumen' },
  ],
  correct: 'B',
};

type OptionState = 'idle' | 'correct' | 'wrong' | 'dimmed';

export default function QuizScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const streak = 3;
  const progress = QUESTION.number / QUESTION.total;

  const handleSelect = (id: string) => {
    if (revealed) return;
    setSelected(id);
    setRevealed(true);
  };

  const getOptionState = (id: string): OptionState => {
    if (!revealed) return 'idle';
    if (id === QUESTION.correct) return 'correct';
    if (id === selected) return 'wrong';
    return 'dimmed';
  };

  const optionStyles = (id: string) => {
    const state = getOptionState(id);
    return [
      styles.option,
      state === 'correct' && styles.optionCorrect,
      state === 'wrong' && styles.optionWrong,
      state === 'dimmed' && styles.optionDimmed,
    ];
  };

  const labelStyles = (id: string) => {
    const state = getOptionState(id);
    return [
      styles.optionLabel,
      state === 'correct' && styles.labelCorrect,
      state === 'wrong' && styles.labelWrong,
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>🔥 {streak}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Meta */}
        <View style={styles.meta}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{QUESTION.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.questionCount}>
            {QUESTION.number} / {QUESTION.total}
          </Text>
        </View>

        {/* Question */}
        <Text style={styles.questionText}>{QUESTION.text}</Text>

        {/* Options */}
        <View style={styles.options}>
          {QUESTION.options.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={optionStyles(opt.id)}
              onPress={() => handleSelect(opt.id)}
              activeOpacity={0.75}
            >
              <View style={labelStyles(opt.id)}>
                <Text style={styles.labelChar}>{opt.id}</Text>
              </View>
              <Text style={styles.optionText}>{opt.text}</Text>
              {revealed && opt.id === QUESTION.correct && (
                <Text style={styles.checkmark}>✓</Text>
              )}
              {revealed && opt.id === selected && opt.id !== QUESTION.correct && (
                <Text style={styles.cross}>✕</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback */}
        {revealed && (
          <View
            style={[
              styles.feedbackBanner,
              selected === QUESTION.correct
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            <Text style={styles.feedbackText}>
              {selected === QUESTION.correct
                ? '🎯 Richtig! Bull Market = steigende Kurse.'
                : `✗ Falsch. Die richtige Antwort ist B.`}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {revealed ? (
          <TouchableOpacity style={styles.nextBtn} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>Weiter</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7}>
            <Text style={styles.skipBtnText}>Überspringen</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 14,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: SURFACE,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BRAND,
    borderRadius: 99,
  },
  streakPill: {
    backgroundColor: SURFACE,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: BORDER,
  },
  streakText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '700',
  },

  // Body
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  categoryPill: {
    backgroundColor: `${BRAND}18`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: `${BRAND}35`,
  },
  categoryText: {
    color: BRAND,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  questionCount: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '500',
  },
  questionText: {
    color: TEXT,
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.4,
    marginBottom: 32,
  },

  // Options
  options: {
    gap: 11,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: BORDER,
    gap: 14,
  },
  optionCorrect: {
    borderColor: BRAND,
    backgroundColor: `${BRAND}12`,
  },
  optionWrong: {
    borderColor: '#FF453A',
    backgroundColor: '#FF453A10',
  },
  optionDimmed: {
    opacity: 0.35,
  },
  optionLabel: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelCorrect: {
    backgroundColor: BRAND,
  },
  labelWrong: {
    backgroundColor: '#FF453A',
  },
  labelChar: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
  },
  checkmark: {
    color: BRAND,
    fontSize: 18,
    fontWeight: '700',
  },
  cross: {
    color: '#FF453A',
    fontSize: 16,
    fontWeight: '700',
  },

  // Feedback
  feedbackBanner: {
    marginTop: 20,
    borderRadius: 14,
    padding: 14,
  },
  feedbackCorrect: {
    backgroundColor: `${BRAND}18`,
    borderWidth: 1,
    borderColor: `${BRAND}30`,
  },
  feedbackWrong: {
    backgroundColor: '#FF453A12',
    borderWidth: 1,
    borderColor: '#FF453A30',
  },
  feedbackText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  nextBtn: {
    backgroundColor: BRAND,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  skipBtn: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  skipBtnText: {
    color: MUTED,
    fontSize: 15,
    fontWeight: '500',
  },
});
