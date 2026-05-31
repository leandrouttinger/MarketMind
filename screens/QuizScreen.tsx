import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
  Image,
  ImageStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { getDailyQuestions, getDailyChallenge, UserLevel } from '../utils/questionPicker';
import { getLocalizedQuestion } from '../utils/questionTranslations';
import { Question } from '../data/questions';
import { useLanguage } from '../contexts/LanguageContext';
import { SHARED_VID, ICONS, LESSON_ICONS, getMascotVid, getMascotImg, getFactionColor } from '../utils/imageAssets';
import MascotVideo from '../components/MascotVideo';
import { Faction } from './FactionScreen';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';
const ERROR = '#FF453A';

const MAX_LIVES = 3;

interface Props {
  level: UserLevel;
  goals?: string[];
  streak: number;
  faction?: Faction | null;
  isDailyChallenge?: boolean;
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
}

function HeartRow({ lives, maxLives }: { lives: number; maxLives: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: maxLives }).map((_, i) => (
        <Image
          key={i}
          source={LESSON_ICONS.heart}
          style={{ width: 18, height: 18, opacity: i < lives ? 1 : 0.2 } as ImageStyle}
          resizeMode="contain"
        />
      ))}
    </View>
  );
}

export default function QuizScreen({ level, goals = [], streak, faction, isDailyChallenge = false, onComplete, onExit }: Props) {
  const { language, t } = useLanguage();
  const factionColor = getFactionColor(faction ?? null);

  const [questions] = useState<Question[]>(() =>
    isDailyChallenge ? getDailyChallenge(5) : getDailyQuestions(level, goals, 5)
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);

  const sheetY = useRef(new Animated.Value(300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const correctScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const question = questions[index];
  const localized = question ? getLocalizedQuestion(question, language) : null;
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
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => {
          hideFeedback(() => setGameOver(true));
        }, 1800);
      }
    }
    setTimeout(showFeedback, 300);
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = index + 1;
    const finalScore = score + (isCorrect ? 1 : 0);
    if (next >= questions.length) {
      hideFeedback(() => onComplete(finalScore, questions.length));
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

  // Game over — no lives left
  if (gameOver) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.resultWrap}>
          <MascotVideo
            video={getMascotVid(faction ?? null, 'wrong')}
            fallback={getMascotImg(faction ?? null, 'wrong')}
            size={140}
            bgColor="#0F0F0F"
          />
          <Text style={[styles.resultScore, { color: ERROR }]}>{score}/{questions.length}</Text>
          <Text style={[styles.resultLevel, { color: ERROR }]}>Keine Leben mehr</Text>
          <Text style={styles.resultDesc}>Versuche es morgen wieder. Jeden Tag neue Fragen.</Text>
          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: ERROR }]}
            onPress={() => onComplete(score, questions.length)}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Ergebnisse sehen</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!question || !localized) return null;

  const localizedOptions = localized.options.map(lo => {
    const original = question.options.find(o => o.id === lo.id);
    return { id: lo.id, text: lo.text, original };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.exitBtn}>
          <Text style={styles.exitText}>X</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: factionColor }]} />
        </View>
        {/* Streak + Lives */}
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <MascotVideo video={SHARED_VID.flameEmerald} fallback={ICONS.flameEmerald} size={18} bgColor="#1C1C1E" />
            <Text style={[styles.streakText, { color: factionColor }]}>{streak}</Text>
          </View>
          <HeartRow lives={lives} maxLives={MAX_LIVES} />
        </View>
      </View>

      {/* Question card */}
      <Animated.View style={[styles.questionArea, { opacity: cardOpacity }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.questionContent}>
          <View style={styles.meta}>
            <View style={[styles.categoryPill, { backgroundColor: `${factionColor}18`, borderColor: `${factionColor}35` }]}>
              <Text style={[styles.categoryText, { color: factionColor }]}>{question.category.toUpperCase()}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i < question.difficulty ? factionColor : BORDER }} />
              ))}
            </View>
          </View>

          <Text style={styles.questionText}>{localized.text}</Text>

          <View style={styles.options}>
            {localizedOptions.map((opt) => {
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
                    {isRight && <Text style={[styles.tick, { color: factionColor }]}>+</Text>}
                    {isWrong && <Text style={styles.cross}>-</Text>}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MascotVideo
                video={getMascotVid(faction ?? null, isCorrect ? 'correct' : 'wrong')}
                fallback={getMascotImg(faction ?? null, isCorrect ? 'correct' : 'wrong')}
                size={50}
                bgColor={isCorrect ? '#0D1F17' : '#1F0D0D'}
                loop={false}
              />
              <Text style={[styles.sheetTitle, isCorrect ? styles.sheetTitleCorrect : styles.sheetTitleWrong]}>
                {isCorrect ? t('correct') : t('notQuite')}
              </Text>
            </View>
            <Text style={styles.sheetExplanation}>{localized.explanation}</Text>
            <TouchableOpacity
              style={[styles.continueBtn, isCorrect ? { backgroundColor: factionColor } : styles.continueBtnWrong]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>
                {index < questions.length - 1 ? t('continue') : t('seeResults')}
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
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: SURFACE, alignItems: 'center', justifyContent: 'center',
  },
  exitText: { color: MUTED, fontSize: 14, fontWeight: '700' },
  progressTrack: { flex: 1, height: 10, backgroundColor: SURFACE, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakBadge: {
    backgroundColor: SURFACE, borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: BORDER,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  streakText: { fontSize: 13, fontWeight: '800' },

  questionArea: { flex: 1 },
  questionContent: { paddingHorizontal: 20, paddingBottom: 20 },

  meta: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  categoryPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  categoryText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },

  questionText: {
    color: TEXT, fontSize: 22, fontWeight: '700',
    lineHeight: 31, letterSpacing: -0.3, marginBottom: 28,
  },

  options: { gap: 12 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: SURFACE, borderRadius: 16,
    padding: 16, borderWidth: 2, borderColor: BORDER, gap: 14,
  },
  optionCorrect: { borderColor: BRAND, backgroundColor: `${BRAND}14` },
  optionWrong: { borderColor: ERROR, backgroundColor: `${ERROR}10` },
  optionDimmed: { opacity: 0.3 },
  optionKey: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: BORDER, alignItems: 'center', justifyContent: 'center',
  },
  optionKeyCorrect: { backgroundColor: BRAND },
  optionKeyWrong: { backgroundColor: ERROR },
  optionKeyText: { color: TEXT, fontSize: 14, fontWeight: '800' },
  optionText: { flex: 1, color: TEXT, fontSize: 15, fontWeight: '500', lineHeight: 21 },
  optionTextCorrect: { color: BRAND, fontWeight: '600' },
  tick: { fontSize: 20, fontWeight: '900' },
  cross: { color: ERROR, fontSize: 18, fontWeight: '900' },

  sheetOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: Platform.OS === 'ios' ? 36 : 28,
    gap: 10, borderTopWidth: 1,
  },
  sheetCorrect: { backgroundColor: '#0D1F17', borderTopColor: `${BRAND}40` },
  sheetWrong: { backgroundColor: '#1F0D0D', borderTopColor: `${ERROR}40` },
  sheetTitle: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  sheetTitleCorrect: { color: BRAND },
  sheetTitleWrong: { color: ERROR },
  sheetExplanation: { color: '#C7C7CC', fontSize: 14, lineHeight: 21, marginBottom: 8 },
  continueBtn: {
    borderRadius: 16, paddingVertical: 17, alignItems: 'center', marginTop: 4,
  },
  continueBtnWrong: { backgroundColor: ERROR },
  continueBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },

  // Game over / result styles
  resultWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  resultScore: { fontSize: 36, fontWeight: '900', letterSpacing: -0.5 },
  resultLevel: { fontSize: 18, fontWeight: '700' },
  resultDesc: { color: MUTED, fontSize: 14, textAlign: 'center', lineHeight: 21 },
});
