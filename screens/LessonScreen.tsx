import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { getLessonContent, getLocalizedCard } from '../data/lessonContent';
import { LessonDef, SectionDef } from '../data/learningPath';
import { LESSON_ICON_MAP } from '../utils/imageAssets';
import { Faction } from './FactionScreen';
import { getFactionColor } from '../utils/imageAssets';

const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';
const BRAND = '#10B981';

interface Props {
  lesson: LessonDef;
  section: SectionDef;
  faction: Faction;
  onStartQuiz: () => void;
  onExit: () => void;
}

export default function LessonScreen({ lesson, section, faction, onStartQuiz, onExit }: Props) {
  const { language } = useLanguage();
  const factionColor = getFactionColor(faction);
  const content = getLessonContent(lesson.id);
  const [cardIndex, setCardIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const cards = content?.cards ?? [];
  const isLast = cardIndex >= cards.length - 1;

  const animateNext = (direction: 'next' | 'back') => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: direction === 'next' ? -20 : 20, duration: 120, useNativeDriver: true }),
      ]),
    ]).start(() => {
      if (direction === 'next') setCardIndex(i => i + 1);
      else setCardIndex(i => i - 1);
      slideAnim.setValue(direction === 'next' ? 20 : -20);
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLast) {
      onStartQuiz();
    } else {
      animateNext('next');
    }
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateNext('back');
  };

  // No content available — skip straight to quiz
  if (!content || cards.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.noContent}>
          <Text style={styles.lessonTitle}>{lesson.title[language] ?? lesson.title.en}</Text>
          <Text style={styles.noContentSub}>Lesson content coming soon.</Text>
          <TouchableOpacity style={[styles.quizBtn, { backgroundColor: factionColor }]} onPress={onStartQuiz} activeOpacity={0.85}>
            <Text style={styles.quizBtnText}>Start Quiz →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onExit} style={styles.exitLink}>
            <Text style={styles.exitLinkText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const card = cards[cardIndex];
  const loc = getLocalizedCard(card, language);
  const lessonIcon = LESSON_ICON_MAP[lesson.id];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.exitBtn}>
          <Text style={styles.exitText}>X</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {
            width: `${((cardIndex + 1) / cards.length) * 100}%`,
            backgroundColor: factionColor,
          }]} />
        </View>
        <Text style={styles.stepCount}>{cardIndex + 1}/{cards.length}</Text>
      </View>

      {/* Lesson badge */}
      <View style={styles.lessonBadge}>
        {lessonIcon && (
          <Image source={lessonIcon} style={styles.lessonIcon} resizeMode="contain" />
        )}
        <Text style={[styles.sectionLabel, { color: section.color }]}>
          {section.title[language] ?? section.title.en}
        </Text>
        <Text style={styles.lessonTitle}>{lesson.title[language] ?? lesson.title.en}</Text>
      </View>

      {/* Card content */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, { opacity: opacityAnim, transform: [{ translateX: slideAnim }] }]}>

          {/* Concept title */}
          <Text style={[styles.conceptTitle, { color: factionColor }]}>{loc.title}</Text>

          {/* Main explanation */}
          <View style={styles.bodyBox}>
            <Text style={styles.bodyText}>{loc.body}</Text>
          </View>

          {/* Real-world example */}
          <View style={styles.exampleBox}>
            <Text style={[styles.exampleLabel, { color: factionColor }]}>Real example</Text>
            <Text style={styles.exampleText}>{loc.example}</Text>
          </View>

          {/* Key takeaway */}
          <View style={[styles.takeawayBox, { borderColor: `${factionColor}40` }]}>
            <Text style={[styles.takeawayLabel, { color: factionColor }]}>Key takeaway</Text>
            <Text style={styles.takeawayText}>{loc.takeaway}</Text>
          </View>

        </Animated.View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.footer}>
        {cardIndex > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: factionColor, flex: cardIndex > 0 ? 1 : undefined, width: cardIndex > 0 ? undefined : '100%' }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? 'Start Quiz →' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, gap: 12,
  },
  exitBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: SURFACE, alignItems: 'center', justifyContent: 'center',
  },
  exitText: { color: MUTED, fontSize: 14, fontWeight: '700' },
  progressTrack: { flex: 1, height: 8, backgroundColor: SURFACE, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  stepCount: { color: MUTED, fontSize: 12, fontWeight: '600' },

  lessonBadge: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 12, gap: 6 },
  lessonIcon: { width: 48, height: 48, marginBottom: 4 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  lessonTitle: { color: TEXT, fontSize: 20, fontWeight: '800', textAlign: 'center', letterSpacing: -0.3 },

  scroll: { flex: 1 },

  card: { paddingHorizontal: 20, paddingBottom: 32, gap: 16 },

  conceptTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.4, lineHeight: 28 },

  bodyBox: {
    backgroundColor: SURFACE, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: BORDER,
  },
  bodyText: { color: TEXT, fontSize: 16, lineHeight: 24, fontWeight: '400' },

  exampleBox: {
    backgroundColor: '#0D1F17', borderRadius: 16,
    padding: 16, gap: 6, borderWidth: 1, borderColor: `${BRAND}25`,
  },
  exampleLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  exampleText: { color: '#A7F3D0', fontSize: 14, lineHeight: 21, fontStyle: 'italic' },

  takeawayBox: {
    borderRadius: 16, padding: 16, gap: 6,
    borderWidth: 2, backgroundColor: SURFACE,
  },
  takeawayLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  takeawayText: { color: TEXT, fontSize: 15, lineHeight: 22, fontWeight: '600' },

  footer: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12,
  },
  backBtn: {
    borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20,
    backgroundColor: SURFACE, alignItems: 'center', justifyContent: 'center',
  },
  backBtnText: { color: MUTED, fontSize: 15, fontWeight: '700' },
  nextBtn: {
    borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
  },
  nextBtnText: { color: '#000', fontSize: 16, fontWeight: '900' },

  // No content fallback
  noContent: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 32 },
  noContentSub: { color: MUTED, fontSize: 15, textAlign: 'center' },
  quizBtn: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center', width: '100%' },
  quizBtnText: { color: '#000', fontSize: 16, fontWeight: '900' },
  exitLink: { padding: 12 },
  exitLinkText: { color: MUTED, fontSize: 14 },
});
