import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Animated, Dimensions, Image, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { LEARNING_SECTIONS, SectionDef, LessonDef } from '../data/learningPath';
import { getLevelInfo, getNextLevel, getProgressToNext } from '../utils/xpSystem';
import { UserLevel } from '../utils/questionPicker';
import { IMAGES, SHARED_VID, ICONS, LESSON_ICON_MAP, LESSON_ICONS } from '../utils/imageAssets';
import MascotVideo from '../components/MascotVideo';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';
const W = Dimensions.get('window').width;

// Node layout constants — tight like Duolingo
const NODE_SIZE = 62;
const NODE_GAP = 28; // vertical gap between nodes
const PATH_LEFT = W * 0.2;
const PATH_RIGHT = W * 0.65;

interface Props {
  userName: string;
  level: UserLevel;
  xp: number;
  streak: number;
  completedLessons: Set<string>;
  quizDoneToday: boolean;
  isPremium: boolean;
  onStartLesson: (lesson: LessonDef, section: SectionDef) => void;
  onStartDailyChallenge: () => void;
}

function StreakBadge({ streak }: { streak: number }) {
  const bounce = useRef(new Animated.Value(1)).current;
  const BRAND = '#10B981';

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0.96, duration: 500, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 1.06, duration: 400, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: bounce }] }}>
      <View style={[streakStyles.badge, { borderColor: BRAND }]}>
        <MascotVideo video={SHARED_VID.flameEmerald} fallback={ICONS.flameEmerald} size={22} bgColor="#0A1A0A" />
        <Text style={[streakStyles.num, { color: BRAND }]}>{streak}</Text>
      </View>
    </Animated.View>
  );
}

const streakStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#0A1A0A', borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1.5,
  },
  num: { fontSize: 15, fontWeight: '900' },
});

function ActivePulse({ color }: { color: string }) {
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(ring, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: NODE_SIZE + 20,
        height: NODE_SIZE + 20,
        borderRadius: (NODE_SIZE + 20) / 2,
        borderWidth: 2.5,
        borderColor: color,
        opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
        transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] }) }],
      }}
    />
  );
}

function LessonNode({ lesson, section, index, isCompleted, isActive, isLocked, onPress }: {
  lesson: LessonDef; section: SectionDef; index: number;
  isCompleted: boolean; isActive: boolean; isLocked: boolean; onPress: () => void;
}) {
  const { language } = useLanguage();
  const scale = useRef(new Animated.Value(1)).current;
  const isLeft = index % 2 === 0;
  const xPos = isLeft ? PATH_LEFT : PATH_RIGHT;
  const bgColor = isCompleted ? BRAND : isActive ? section.color : '#282828';

  const tap = async () => {
    if (isLocked) { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); return; }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, tension: 300, friction: 5 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 6 }),
    ]).start();
    onPress();
  };

  return (
    <View style={[nodeS.row, { marginBottom: NODE_GAP }]}>
      <View style={[nodeS.col, { left: xPos - NODE_SIZE / 2 }]}>
        {isActive && <ActivePulse color={section.color} />}
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity
            style={[
              nodeS.node,
              { backgroundColor: bgColor },
              isActive && { shadowColor: section.color, shadowOpacity: 0.8, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 10 },
              isCompleted && { shadowColor: BRAND, shadowOpacity: 0.5, shadowRadius: 8, elevation: 6 },
            ]}
            onPress={tap}
            activeOpacity={0.85}
          >
            {isCompleted ? (
              <Text style={nodeS.check}>✓</Text>
            ) : isLocked ? (
              <Text style={[nodeS.icon, { opacity: 0.25 }]}>○</Text>
            ) : LESSON_ICON_MAP[lesson.id] ? (
              <Image source={LESSON_ICON_MAP[lesson.id]} style={nodeS.iconImg} resizeMode="contain" />
            ) : (
              <Text style={nodeS.icon}>{lesson.icon}</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        <Text style={[nodeS.label, isActive && { color: section.color }]} numberOfLines={2}>
          {lesson.title[language]}
        </Text>
        {!isLocked && <Text style={nodeS.xp}>+{lesson.xp} XP</Text>}
      </View>
    </View>
  );
}

const nodeS = StyleSheet.create({
  row: { height: NODE_SIZE + 36, position: 'relative' },
  col: { position: 'absolute', alignItems: 'center', width: NODE_SIZE },
  node: {
    width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2,
    alignItems: 'center', justifyContent: 'center',
  },
  check: { color: '#000', fontSize: 24, fontWeight: '900' },
  icon: { fontSize: 22, color: '#fff' },
  iconImg: { width: NODE_SIZE - 18, height: NODE_SIZE - 18 },
  label: { color: TEXT, fontSize: 10, fontWeight: '600', textAlign: 'center', marginTop: 4, maxWidth: NODE_SIZE + 20, lineHeight: 13 },
  xp: { color: MUTED, fontSize: 9, marginTop: 1 },
});

export default function LearningPathScreen({
  userName, level, xp, streak, completedLessons, quizDoneToday, isPremium, onStartLesson, onStartDailyChallenge,
}: Props) {
  const { t, language } = useLanguage();
  const levelInfo = getLevelInfo(xp);
  const nextLevel = getNextLevel(xp);
  const progress = getProgressToNext(xp);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelEmoji}>{levelInfo.emoji}</Text>
          <View>
            <Text style={styles.levelTitle}>{levelInfo.title}</Text>
            <Text style={styles.levelSub}>Level {levelInfo.level}</Text>
          </View>
        </View>
        <View style={styles.xpWrap}>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${progress * 100}%`, backgroundColor: levelInfo.color }]} />
          </View>
          <Text style={styles.xpLabel}>{xp} XP{nextLevel ? ` / ${nextLevel.minXP}` : ''}</Text>
        </View>
        <StreakBadge streak={streak} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Daily Challenge */}
        <DailyCard done={quizDoneToday} onPress={onStartDailyChallenge} t={t} />

        {/* Path */}
        {LEARNING_SECTIONS.map((section) => {
          const isLocked = section.tier === 'premium' && !isPremium;
          const firstUncompletedIdx = section.lessons.findIndex(l => !completedLessons.has(l.id));
          const completedCount = section.lessons.filter(l => completedLessons.has(l.id)).length;

          return (
            <View key={section.id} style={styles.section}>
              {/* Section banner */}
              <View style={[styles.sectionBanner, { borderColor: `${section.color}35` }]}>
                <View style={[styles.sectionIconCircle, { backgroundColor: `${section.color}18` }]}>
                  <Text style={styles.sectionIconText}>{section.icon}</Text>
                </View>
                <View style={styles.sectionInfo}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title[language]}</Text>
                    {isLocked && <View style={styles.premiumChip}><Text style={styles.premiumChipText}>PRO</Text></View>}
                  </View>
                  <Text style={styles.sectionSub}>{section.subtitle[language]}</Text>
                  {!isLocked && <Text style={[styles.sectionProgress, { color: section.color }]}>{completedCount}/{section.lessons.length}</Text>}
                </View>
              </View>

              {/* Nodes — tight zigzag */}
              <View style={styles.pathContainer}>
                {section.lessons.map((lesson, idx) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const isActive = !isLocked && idx === firstUncompletedIdx && !isCompleted;
                  const nodeLocked = isLocked || (!isCompleted && idx > (firstUncompletedIdx === -1 ? section.lessons.length : firstUncompletedIdx));

                  return (
                    <LessonNode
                      key={lesson.id}
                      lesson={lesson} section={section} index={idx}
                      isCompleted={isCompleted} isActive={isActive} isLocked={nodeLocked}
                      onPress={() => onStartLesson(lesson, section)}
                    />
                  );
                })}
              </View>

              {/* No premium gate — all courses free */}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function DailyCard({ done, onPress, t }: { done: boolean; onPress: () => void; t: (k: string) => string }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (done) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.02, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [done]);

  return (
    <Animated.View style={[dailyS.card, done && dailyS.cardDone, { transform: [{ scale: pulse }] }]}>
      <View style={dailyS.left}>
        <View style={done ? { opacity: 0.5 } : {}}>
          <Image source={LESSON_ICONS.daily} style={dailyS.dailyIcon} resizeMode="contain" />
        </View>
        <View>
          <Text style={dailyS.title}>{done ? t('comeTomorrow') : t('dailyChallenge')}</Text>
          <Text style={dailyS.sub}>{done ? t('streakSafe') : t('questionsMin')}</Text>
        </View>
      </View>
      {!done && (
        <TouchableOpacity style={dailyS.btn} onPress={onPress} activeOpacity={0.85}>
          <Text style={dailyS.btnText}>GO</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const dailyS = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#0D1F17', borderRadius: 18, padding: 16,
    borderWidth: 1.5, borderColor: `${BRAND}45`, marginBottom: 24,
  },
  cardDone: { opacity: 0.6, borderColor: BORDER },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  dailyIcon: { width: 40, height: 40 },
  title: { color: TEXT, fontSize: 15, fontWeight: '700' },
  sub: { color: MUTED, fontSize: 12, marginTop: 1 },
  btn: { backgroundColor: BRAND, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  btnText: { color: '#000', fontSize: 15, fontWeight: '900' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 10,
  },
  levelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: SURFACE, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: BORDER,
  },
  levelEmoji: { fontSize: 18 },
  levelTitle: { color: TEXT, fontSize: 12, fontWeight: '700' },
  levelSub: { color: MUTED, fontSize: 9 },
  xpWrap: { flex: 1, gap: 3 },
  xpTrack: { height: 7, backgroundColor: SURFACE, borderRadius: 99, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 99 },
  xpLabel: { color: MUTED, fontSize: 9 },

  scroll: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 8 },

  section: { marginBottom: 32 },
  sectionBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: SURFACE, borderRadius: 16, padding: 14,
    borderWidth: 1, marginBottom: 16,
  },
  sectionIconCircle: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  sectionIconText: { fontSize: 22 },
  sectionInfo: { flex: 1, gap: 2 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  premiumChip: { backgroundColor: '#F59E0B', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1 },
  premiumChipText: { color: '#000', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  sectionSub: { color: MUTED, fontSize: 11 },
  sectionProgress: { fontSize: 11, fontWeight: '600' },

  pathContainer: { position: 'relative' },

  gate: {
    borderRadius: 16, overflow: 'hidden', height: 120,
    borderWidth: 1, borderColor: '#F59E0B30', marginTop: 8,
  },
  gateImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gateOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center',
    justifyContent: 'center', gap: 6, padding: 16,
  },
  gateTitle: { color: TEXT, fontSize: 15, fontWeight: '800' },
  gateSub: { color: MUTED, fontSize: 11, textAlign: 'center' },
  gateBtn: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24, marginTop: 4 },
  gateBtnText: { color: '#000', fontSize: 13, fontWeight: '800' },
});
