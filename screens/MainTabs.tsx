import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import LearningPathScreen from './LearningPathScreen';
import LessonScreen from './LessonScreen';
import LeagueScreen from './LeagueScreen';
import AIChatScreen from './AIChatScreen';
import ProfileScreen from './ProfileScreen';
import QuizScreen from './QuizScreen';
import TradingAcademyScreen from './TradingAcademyScreen';
import MarketsScreen from './MarketsScreen';
import ToolsScreen from './ToolsScreen';
import { useLanguage } from '../contexts/LanguageContext';
import { UserLevel, getDailyChallenge } from '../utils/questionPicker';
import { LessonDef, SectionDef } from '../data/learningPath';
import { getXPForAction } from '../utils/xpSystem';
import { IMAGES, SHARED_VID, ICONS } from '../utils/imageAssets';
import MascotVideo from '../components/MascotVideo';
import { saveState } from '../utils/storage';
import { getCurrentUser, upsertProfile } from '../utils/supabase';
import { Faction } from './FactionScreen';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const TAB_BG = '#0A0A0A';
const MUTED = '#3A3A3C';

type Tab = 'learn' | 'trading' | 'markets' | 'tools' | 'profile';
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'learn',   label: 'Learn',   icon: '◈' },
  { key: 'trading', label: 'Trading', icon: '▲' },
  { key: 'markets', label: 'Markets', icon: '◎' },
  { key: 'tools',   label: 'Tools',   icon: '◧' },
  { key: 'profile', label: 'Profile', icon: '◯' },
];

const STREAK_MILESTONES: Record<number, { msg: string; emoji: string }> = {
  3:  { msg: "3 days in a row! Great start.", emoji: "💪" },
  7:  { msg: "1 week! You're building a real habit.", emoji: "🔥" },
  14: { msg: "2 weeks strong! You're on your way.", emoji: "⚡" },
  21: { msg: "3 weeks! Consistency is everything.", emoji: "📈" },
  30: { msg: "1 month! You're a legend. Keep going.", emoji: "👑" },
};

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate();
}
function isYesterday(d: Date) {
  const y = new Date(); y.setDate(y.getDate() - 1);
  return isSameDay(d, y);
}

interface Props {
  userName: string;
  userLevel: UserLevel;
  userGoals: string[];
  streak: number;
  xp: number;
  totalQuestions: number;
  lastPlayedDate: string | null;
  completedLessons: string[];
  quizDoneToday: boolean;
  faction: Faction | null;
  onStreakUpdate: (s: number) => void;
  onXPUpdate: (xp: number) => void;
  onQuestionsUpdate: (count: number) => void;
  onLevelChange: (level: UserLevel) => void;
}

export default function MainTabs({
  userName, userLevel, userGoals,
  streak, xp, totalQuestions,
  lastPlayedDate: initialLastPlayed,
  completedLessons: initialCompleted,
  quizDoneToday: initialQuizDone,
  faction,
  onStreakUpdate, onXPUpdate, onQuestionsUpdate, onLevelChange,
}: Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [quizOpen, setQuizOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [quizMode, setQuizMode] = useState<'daily' | 'lesson'>('daily');
  const [lessonCtx, setLessonCtx] = useState<{ lesson: LessonDef; section: SectionDef } | null>(null);
  const [leagueOpen, setLeagueOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const [quizDoneToday, setQuizDoneToday] = useState(initialQuizDone);
  const [lastPlayedDate, setLastPlayedDate] = useState<Date | null>(
    initialLastPlayed ? new Date(initialLastPlayed) : null
  );
  const [currentStreak, setCurrentStreak] = useState(streak);
  const [currentXP, setCurrentXP] = useState(xp);
  const [currentTotal, setCurrentTotal] = useState(totalQuestions);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(initialCompleted)
  );
  const [milestoneModal, setMilestoneModal] = useState<{ msg: string; emoji: string } | null>(null);

  const insets = useSafeAreaInsets();
  const tabScales = useRef(TABS.map(() => new Animated.Value(1))).current;
  const milestoneScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (milestoneModal) {
      Animated.spring(milestoneScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }).start();
    }
  }, [milestoneModal]);

  const persist = async (patch: Parameters<typeof saveState>[0]) => {
    await saveState(patch);
    // Sync to Supabase if user is logged in
    try {
      const user = await getCurrentUser();
      if (user) {
        await upsertProfile(user.id, {
          username: userName,
          streak: currentStreak,
          xp: currentXP,
          total_questions: currentTotal,
          user_level: userLevel,
          user_goals: userGoals,
          last_played_date: lastPlayedDate?.toISOString() ?? null,
          completed_lessons: Array.from(completedLessons),
          quiz_done_today: quizDoneToday,
        });
      }
    } catch {
      // Supabase not configured yet — silently skip
    }
  };

  const switchTab = async (tab: Tab, idx: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(tabScales[idx], { toValue: 0.8, duration: 70, useNativeDriver: true }),
      Animated.spring(tabScales[idx], { toValue: 1, useNativeDriver: true, tension: 250, friction: 6 }),
    ]).start();
    setActiveTab(tab);
  };

  const addXP = (amount: number) => {
    const n = currentXP + amount;
    setCurrentXP(n);
    onXPUpdate(n);
    return n;
  };

  const handleDailyChallenge = () => {
    setQuizMode('daily');
    setLessonCtx(null);
    setQuizOpen(true);
  };

  const handleStartLesson = (lesson: LessonDef, section: SectionDef) => {
    setQuizMode('lesson');
    setLessonCtx({ lesson, section });
    setLessonOpen(true); // Show lesson cards first, then quiz
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizOpen(false);

    const newTotal = currentTotal + total;
    setCurrentTotal(newTotal);
    onQuestionsUpdate(newTotal);

    const xpGained = score * getXPForAction('correct') + (score === total ? getXPForAction('perfect') : 0);
    const newXP = addXP(xpGained);

    if (quizMode === 'daily' && !quizDoneToday) {
      const today = new Date();
      let newStreak: number;

      if (!lastPlayedDate) {
        newStreak = 1;
      } else if (isSameDay(lastPlayedDate, today)) {
        newStreak = currentStreak;
      } else if (isYesterday(lastPlayedDate)) {
        newStreak = currentStreak + 1;
      } else {
        newStreak = 1;
      }

      const dailyXP = addXP(getXPForAction('daily'));
      setQuizDoneToday(true);
      setLastPlayedDate(today);
      setCurrentStreak(newStreak);
      onStreakUpdate(newStreak);

      persist({
        quizDoneToday: true,
        lastPlayedDate: today.toISOString(),
        streak: newStreak,
        xp: newXP + dailyXP,
        totalQuestions: newTotal,
      });

      const milestone = STREAK_MILESTONES[newStreak];
      if (milestone) {
        setTimeout(() => setMilestoneModal(milestone), 400);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else if (quizMode === 'lesson' && lessonCtx) {
      const lessonXP = addXP(getXPForAction('lesson'));
      const newCompleted = new Set([...completedLessons, lessonCtx.lesson.id]);
      setCompletedLessons(newCompleted);

      persist({
        xp: newXP + lessonXP,
        totalQuestions: newTotal,
        completedLessons: Array.from(newCompleted),
      });
    }

    setLessonCtx(null);
  };

  // ── Full-screen overlays (rendered instead of tab UI) ──────────────────────

  if (lessonOpen && lessonCtx) {
    return (
      <LessonScreen
        lesson={lessonCtx.lesson}
        section={lessonCtx.section}
        faction={faction}
        onStartQuiz={() => { setLessonOpen(false); setQuizOpen(true); }}
        onExit={() => { setLessonOpen(false); setLessonCtx(null); }}
      />
    );
  }

  if (quizOpen) {
    return (
      <QuizScreen
        level={userLevel}
        goals={quizMode === 'daily' ? [] : userGoals}
        streak={currentStreak}
        faction={faction}
        isDailyChallenge={quizMode === 'daily'}
        onComplete={handleQuizComplete}
        onExit={() => { setQuizOpen(false); setLessonCtx(null); }}
      />
    );
  }

  if (leagueOpen) {
    return (
      <View style={{ flex: 1 }}>
        <LeagueScreen userName={userName} userXP={currentXP} streak={currentStreak} faction={faction} />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setLeagueOpen(false); }}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>← Zurück</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (aiChatOpen) {
    return (
      <View style={{ flex: 1 }}>
        <AIChatScreen />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setAiChatOpen(false); }}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>← Zurück</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tabH = 60 + insets.bottom;

  return (
    <View style={styles.container}>
      <View style={[styles.screen, { paddingBottom: tabH }]}>
        {activeTab === 'learn' && (
          <View style={{ flex: 1 }}>
            <LearningPathScreen
              userName={userName} level={userLevel} xp={currentXP} streak={currentStreak}
              completedLessons={completedLessons} quizDoneToday={quizDoneToday}
              isPremium={true} onStartLesson={handleStartLesson}
              onStartDailyChallenge={handleDailyChallenge}
            />
            {/* Liga floating button */}
            <TouchableOpacity
              style={styles.ligaBtn}
              onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setLeagueOpen(true); }}
              activeOpacity={0.85}
            >
              <Text style={styles.ligaBtnIcon}>◉</Text>
              <Text style={styles.ligaBtnText}>Liga</Text>
            </TouchableOpacity>
          </View>
        )}
        {activeTab === 'trading' && <TradingAcademyScreen />}
        {activeTab === 'markets' && <MarketsScreen />}
        {activeTab === 'tools' && <ToolsScreen onOpenAI={() => setAiChatOpen(true)} />}
        {activeTab === 'profile' && (
          <ProfileScreen
            userName={userName} level={userLevel} xp={currentXP}
            streak={currentStreak} totalQuestions={currentTotal}
            onLevelChange={onLevelChange}
          />
        )}
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { paddingBottom: insets.bottom, height: tabH }]}>
        {TABS.map((tab, idx) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => switchTab(tab.key, idx)} activeOpacity={0.7}>
              <Animated.View style={[styles.tabIconWrap, active && styles.tabIconWrapActive, { transform: [{ scale: tabScales[idx] }] }]}>
                <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{tab.icon}</Text>
              </Animated.View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.key === 'learn' || tab.key === 'profile' ? t(tab.key) : tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Streak Milestone Modal */}
      <Modal visible={!!milestoneModal} transparent animationType="fade">
        <View style={modal.backdrop}>
          <Animated.View style={[modal.card, { transform: [{ scale: milestoneScale }] }]}>
            <MascotVideo video={SHARED_VID.flameEmerald} fallback={ICONS.flameEmerald} size={80} bgColor="#111" />
            <Text style={modal.streakNum}>{currentStreak} Day Streak!</Text>
            <Text style={modal.msg}>{milestoneModal?.msg}</Text>
            <TouchableOpacity
              style={modal.btn}
              onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); setMilestoneModal(null); }}
              activeOpacity={0.85}
            >
              <Text style={modal.btnText}>Keep going! →</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  screen: { flex: 1 },
  tabBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', backgroundColor: TAB_BG,
    borderTopWidth: 1, borderTopColor: '#1C1C1E',
    paddingTop: 6,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabIconWrap: { width: 38, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tabIconWrapActive: { backgroundColor: `${BRAND}18` },
  tabIcon: { fontSize: 17, color: MUTED },
  tabIconActive: { color: BRAND },
  tabLabel: { fontSize: 9, fontWeight: '500', color: MUTED },
  tabLabelActive: { color: BRAND, fontWeight: '700' },

  // Liga floating button (Learn tab)
  ligaBtn: {
    position: 'absolute', top: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1C1C1E', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: '#2C2C2E',
  },
  ligaBtnIcon: { color: BRAND, fontSize: 13 },
  ligaBtnText: { color: BRAND, fontSize: 12, fontWeight: '700' },

  // Back button for overlay screens (League / AI Chat)
  backBtn: {
    position: 'absolute', top: 56, left: 16,
    backgroundColor: '#1C1C1E', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#2C2C2E',
    zIndex: 100,
  },
  backBtnText: { color: BRAND, fontSize: 13, fontWeight: '700' },
});

const modal = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: '#111', borderRadius: 24, padding: 32,
    alignItems: 'center', gap: 10, width: '82%',
    borderWidth: 1.5, borderColor: `${BRAND}40`,
  },
  streakNum: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  msg: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  btn: { backgroundColor: BRAND, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, marginTop: 8 },
  btnText: { color: '#000', fontSize: 15, fontWeight: '800' },
});
