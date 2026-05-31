import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const BRAND  = '#10B981';
const BG     = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER  = '#2C2C2E';
const TEXT    = '#FFFFFF';
const MUTED   = '#8E8E93';
const GOLD    = '#F59E0B';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  free: boolean;
}

interface Section {
  id: string;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  lessonCount: number;
  free: boolean;
  isCalculator?: boolean;
  lessons: Lesson[];
}

const SECTIONS: Section[] = [
  {
    id: 'basics',
    icon: '◈',
    color: BRAND,
    title: 'Grundlagen',
    subtitle: 'Kerzen, Trends, Support & Resistance',
    lessonCount: 8,
    free: true,
    lessons: [
      { id: 'candles',     title: 'Was ist eine Kerze?',        duration: '5 min', free: true  },
      { id: 'candletypes', title: 'Kerzen-Typen & Bedeutung',   duration: '6 min', free: false },
      { id: 'trends',      title: 'Trends erkennen',            duration: '7 min', free: false },
      { id: 'sr',          title: 'Support & Resistance',       duration: '8 min', free: false },
      { id: 'timeframes',  title: 'Timeframes verstehen',       duration: '6 min', free: false },
      { id: 'volume',      title: 'Volumen lesen',              duration: '5 min', free: false },
      { id: 'structure',   title: 'Marktstruktur Basics',       duration: '8 min', free: false },
      { id: 'firsttrade',  title: 'Dein erster Paper-Trade',    duration: '10 min', free: false },
    ],
  },
  {
    id: 'strategy',
    icon: '⬡',
    color: '#6366F1',
    title: 'Meine Strategie (ICT / SMC)',
    subtitle: 'Market Structure, Order Blocks, FVG, Entries',
    lessonCount: 12,
    free: false,
    lessons: [
      { id: 'msb',   title: 'Market Structure Break',    duration: '8 min',  free: false },
      { id: 'ob',    title: 'Order Blocks erkennen',     duration: '10 min', free: false },
      { id: 'fvg',   title: 'Fair Value Gaps (FVG)',     duration: '9 min',  free: false },
      { id: 'bos',   title: 'Break of Structure (BOS)',  duration: '7 min',  free: false },
      { id: 'entry', title: 'Entry-Präzision & Timing',  duration: '12 min', free: false },
      { id: 'sl',    title: 'Stop Loss richtig setzen',  duration: '8 min',  free: false },
      { id: 'tp',    title: 'Take Profit Strategie',     duration: '7 min',  free: false },
      { id: 'live',  title: 'Live-Trade Walkthrough',    duration: '15 min', free: false },
    ],
  },
  {
    id: 'psychology',
    icon: '◎',
    color: '#EC4899',
    title: 'Trading Psychologie',
    subtitle: 'Disziplin, Mindset, Journaling, Fehler vermeiden',
    lessonCount: 6,
    free: false,
    lessons: [
      { id: 'fear',      title: 'Angst & Gier kontrollieren', duration: '8 min', free: false },
      { id: 'journal',   title: 'Journaling wie ein Pro',     duration: '6 min', free: false },
      { id: 'rules',     title: 'Deine Regelsets bauen',      duration: '7 min', free: false },
      { id: 'revenge',   title: 'Revenge Trading vermeiden',  duration: '5 min', free: false },
      { id: 'discipline','title': 'Disziplin über Monate',    duration: '9 min', free: false },
      { id: 'routine',   title: 'Trader-Routine aufbauen',    duration: '8 min', free: false },
    ],
  },
  {
    id: 'calculator',
    icon: '◧',
    color: GOLD,
    title: 'Contract Rechner',
    subtitle: 'Lot Size berechnen, Risk % eingeben, Positionsgrösse',
    lessonCount: 0,
    free: false,
    isCalculator: true,
    lessons: [],
  },
  {
    id: 'propfirms',
    icon: '◉',
    color: '#F97316',
    title: 'Prop Firms & Skalieren',
    subtitle: 'Topstep, FTMO — vom Demo zum Funded Trader',
    lessonCount: 5,
    free: false,
    lessons: [
      { id: 'whatisprop', title: 'Was ist eine Prop Firm?',    duration: '6 min', free: false },
      { id: 'topstep',    title: 'Topstep Challenge Guide',    duration: '10 min', free: false },
      { id: 'ftmo',       title: 'FTMO Challenge Guide',       duration: '10 min', free: false },
      { id: 'rules2',     title: 'Prop-Regeln & Drawdown',     duration: '7 min',  free: false },
      { id: 'scale',      title: 'Skalieren nach dem ersten Payout', duration: '8 min', free: false },
    ],
  },
];

export default function TradingAcademyScreen() {
  const [expanded, setExpanded] = useState<string | null>('basics');

  const toggle = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(prev => prev === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Trading Academy</Text>
          <Text style={styles.subtitle}>Von Null zum profitablen Trader</Text>
        </View>
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sections */}
        {SECTIONS.map(section => {
          const isOpen = expanded === section.id;
          return (
            <TouchableOpacity
              key={section.id}
              style={[styles.card, isOpen && { borderColor: `${section.color}40` }]}
              onPress={() => toggle(section.id)}
              activeOpacity={0.8}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: `${section.color}18` }]}>
                  <Text style={[styles.icon, { color: section.color }]}>{section.icon}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.sectionTitle} numberOfLines={1}>{section.title}</Text>
                    {section.free
                      ? <View style={[styles.badge, { backgroundColor: `${BRAND}20`, borderColor: `${BRAND}40` }]}>
                          <Text style={[styles.badgeText, { color: BRAND }]}>FREE</Text>
                        </View>
                      : <View style={[styles.badge, { backgroundColor: `${GOLD}18`, borderColor: `${GOLD}40` }]}>
                          <Text style={[styles.badgeText, { color: GOLD }]}>PRO</Text>
                        </View>
                    }
                  </View>
                  <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                  {!section.isCalculator && (
                    <Text style={styles.lessonCount}>{section.lessonCount} Lektionen</Text>
                  )}
                </View>
                <Text style={[styles.chevron, { color: section.color }]}>{isOpen ? '▲' : '▼'}</Text>
              </View>

              {/* Expanded: Lesson List */}
              {isOpen && !section.isCalculator && (
                <View style={styles.lessonList}>
                  {section.lessons.map((lesson, i) => (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[styles.lessonRow, !lesson.free && styles.lessonRowLocked]}
                      activeOpacity={lesson.free ? 0.7 : 0.4}
                    >
                      <View style={[styles.lessonNum, { backgroundColor: lesson.free ? `${section.color}20` : BORDER }]}>
                        <Text style={[styles.lessonNumText, { color: lesson.free ? section.color : MUTED }]}>
                          {i + 1}
                        </Text>
                      </View>
                      <View style={styles.lessonInfo}>
                        <Text style={[styles.lessonTitle, !lesson.free && { color: MUTED }]}>{lesson.title}</Text>
                        <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                      </View>
                      <Text style={[styles.lessonArrow, { color: lesson.free ? section.color : BORDER }]}>
                        {lesson.free ? '→' : '🔒'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Expanded: Calculator Placeholder */}
              {isOpen && section.isCalculator && (
                <View style={styles.calcPlaceholder}>
                  <Text style={styles.calcIcon}>◧</Text>
                  <Text style={styles.calcTitle}>Contract Rechner</Text>
                  <Text style={styles.calcDesc}>
                    Gib deinen Risk % ein und erhalte sofort die richtige Lot Size für dein Konto.
                  </Text>
                  <View style={styles.calcComingSoon}>
                    <Text style={styles.calcComingSoonText}>Coming Soon</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Upgrade Card */}
        <View style={styles.upgradeCard}>
          <View style={styles.upgradeTop}>
            <Text style={styles.upgradeEmoji}>◈</Text>
            <Text style={styles.upgradeTitle}>Vollzugang freischalten</Text>
          </View>
          <Text style={styles.upgradeSub}>
            Alle 31 Lektionen · Contract Rechner · Prop Firm Guide · Meine persönliche ICT/SMC Strategie
          </Text>
          <TouchableOpacity style={styles.upgradeBtn} activeOpacity={0.85}>
            <Text style={styles.upgradeBtnText}>Jetzt upgraden — ab 4 CHF / Monat</Text>
          </TouchableOpacity>
          <Text style={styles.upgradeNote}>Jederzeit kündbar.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
  },
  headerLeft: { gap: 4 },
  title: { color: TEXT, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: MUTED, fontSize: 13 },
  proBadge: {
    backgroundColor: GOLD, borderRadius: 7,
    paddingHorizontal: 9, paddingVertical: 4, marginTop: 4,
  },
  proBadgeText: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 12, paddingBottom: 40 },

  card: {
    backgroundColor: SURFACE, borderRadius: 18,
    borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  iconWrap: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 21 },
  cardInfo: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: TEXT, fontSize: 15, fontWeight: '700', flex: 1 },
  badge: {
    borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2,
    borderWidth: 1,
  },
  badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.9 },
  sectionSubtitle: { color: MUTED, fontSize: 12, lineHeight: 17 },
  lessonCount: { color: '#4B5563', fontSize: 11, marginTop: 1 },
  chevron: { fontSize: 10, fontWeight: '700' },

  lessonList: {
    borderTopWidth: 1, borderTopColor: BORDER,
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
  },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  lessonRowLocked: { opacity: 0.6 },
  lessonNum: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  lessonNumText: { fontSize: 12, fontWeight: '800' },
  lessonInfo: { flex: 1, gap: 2 },
  lessonTitle: { color: TEXT, fontSize: 13, fontWeight: '600' },
  lessonDuration: { color: MUTED, fontSize: 11 },
  lessonArrow: { fontSize: 14 },

  calcPlaceholder: {
    borderTopWidth: 1, borderTopColor: BORDER,
    padding: 24, alignItems: 'center', gap: 10,
  },
  calcIcon: { color: GOLD, fontSize: 36 },
  calcTitle: { color: TEXT, fontSize: 16, fontWeight: '800' },
  calcDesc: { color: MUTED, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  calcComingSoon: {
    backgroundColor: `${GOLD}18`, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: `${GOLD}30`,
    marginTop: 4,
  },
  calcComingSoonText: { color: GOLD, fontSize: 12, fontWeight: '700' },

  upgradeCard: {
    backgroundColor: '#0A1A13', borderRadius: 18,
    borderWidth: 1.5, borderColor: `${BRAND}35`,
    padding: 22, gap: 12, alignItems: 'center', marginTop: 4,
  },
  upgradeTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  upgradeEmoji: { color: BRAND, fontSize: 22 },
  upgradeTitle: { color: TEXT, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  upgradeSub: {
    color: MUTED, fontSize: 13, textAlign: 'center', lineHeight: 20,
  },
  upgradeBtn: {
    width: '100%', backgroundColor: BRAND,
    borderRadius: 14, paddingVertical: 15, alignItems: 'center',
  },
  upgradeBtnText: { color: '#000', fontSize: 14, fontWeight: '800' },
  upgradeNote: { color: '#3A3A3C', fontSize: 11 },
});
