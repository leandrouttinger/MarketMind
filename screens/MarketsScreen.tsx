import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../contexts/LanguageContext';

const BRAND   = '#10B981';
const BG      = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER  = '#2C2C2E';
const TEXT    = '#FFFFFF';
const MUTED   = '#8E8E93';
const RED     = '#EF4444';
const ORANGE  = '#F97316';
const YELLOW  = '#EAB308';

type SubTab = 'calendar' | 'briefing';
type Impact = 'high' | 'medium' | 'low';

interface CalEvent {
  time: string;
  currency: string;
  impact: Impact;
  title: string;
  forecast: string;
  prev: string;
}

interface BriefItem {
  direction: 'up' | 'down' | 'neutral';
  text: string;
  source: string;
}

const IMPACT_COLOR: Record<Impact, string> = {
  high:   RED,
  medium: ORANGE,
  low:    YELLOW,
};

const DUMMY_EVENTS: CalEvent[] = [
  { time: '08:30', currency: 'USD', impact: 'high',   title: 'Non-Farm Payrolls',         forecast: '185K',   prev: '175K'   },
  { time: '10:00', currency: 'USD', impact: 'high',   title: 'Fed Interest Rate Decision', forecast: '5.25%',  prev: '5.25%'  },
  { time: '11:00', currency: 'EUR', impact: 'medium', title: 'ECB Pressekonferenz',        forecast: '—',      prev: '—'      },
  { time: '12:30', currency: 'CHF', impact: 'low',    title: 'SNB Quarterly Bulletin',     forecast: '—',      prev: '—'      },
  { time: '13:30', currency: 'GBP', impact: 'medium', title: 'UK Retail Sales m/m',        forecast: '0.4%',   prev: '0.2%'   },
  { time: '14:00', currency: 'USD', impact: 'medium', title: 'ISM Manufacturing PMI',      forecast: '49.5',   prev: '48.7'   },
  { time: '15:30', currency: 'CAD', impact: 'low',    title: 'BOC Gov Macklem Speaks',     forecast: '—',      prev: '—'      },
];

const DUMMY_BRIEFING: BriefItem[] = [
  {
    direction: 'up',
    text: 'US-Märkte zeigen bullishe Momentum nach Fed-Pause-Signalen. NFP-Daten morgen entscheidend.',
    source: 'Reuters',
  },
  {
    direction: 'neutral',
    text: 'EUR/USD konsolidiert bei 1.0850 — wichtige Resistance-Zone. Warte auf Break-Bestätigung vor Entry.',
    source: 'Bloomberg',
  },
  {
    direction: 'down',
    text: 'Gold unter Druck durch stärkeren DXY. Risk-Off Stimmung baut sich auf — Stops eng halten.',
    source: 'FX Street',
  },
  {
    direction: 'up',
    text: 'NAS100 testet ATH erneut. Tech-Earnings nächste Woche könnten Volatilität bringen.',
    source: 'CNBC',
  },
];

const FILTER_CURRENCIES = ['All', 'USD', 'EUR', 'GBP', 'CHF', 'JPY'];

export default function MarketsScreen() {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<SubTab>('calendar');
  const [currencyFilter, setCurrencyFilter] = useState('All');

  const today = new Date().toLocaleDateString('de-CH', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const switchSubTab = async (tab: SubTab) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSubTab(tab);
  };

  const filteredEvents = DUMMY_EVENTS.filter(ev =>
    currencyFilter === 'All' || ev.currency === currencyFilter
  );

  const directionIcon = (dir: BriefItem['direction']) => {
    if (dir === 'up')      return { icon: '▲', color: BRAND };
    if (dir === 'down')    return { icon: '▼', color: RED   };
    return { icon: '●', color: MUTED };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        <Text style={styles.date}>{today}</Text>
      </View>

      {/* Sub-tabs */}
      <View style={styles.subTabBar}>
        {(['calendar', 'briefing'] as SubTab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.subTab, subTab === tab && styles.subTabActive]}
            onPress={() => switchSubTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.subTabText, subTab === tab && styles.subTabTextActive]}>
              {tab === 'calendar' ? t('economicCalendar') : t('aiBriefing')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Calendar Tab ── */}
        {subTab === 'calendar' && (
          <>
            {/* Impact Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: RED }]} />
                <Text style={styles.legendText}>{t('highImpact')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: ORANGE }]} />
                <Text style={styles.legendText}>{t('impactMedium')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: YELLOW }]} />
                <Text style={styles.legendText}>{t('impactLow')}</Text>
              </View>
            </View>

            {/* Currency Filter */}
            <ScrollView
              horizontal showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterContent}
            >
              {FILTER_CURRENCIES.map(cur => (
                <TouchableOpacity
                  key={cur}
                  style={[styles.filterChip, currencyFilter === cur && styles.filterChipActive]}
                  onPress={() => setCurrencyFilter(cur)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, currencyFilter === cur && styles.filterChipTextActive]}>
                    {cur === 'All' ? t('allFilter') : cur}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Events */}
            {filteredEvents.map((ev, i) => (
              <View
                key={i}
                style={[
                  styles.eventCard,
                  ev.impact === 'high' && { borderColor: `${RED}30` },
                ]}
              >
                <View style={[styles.impactBar, { backgroundColor: IMPACT_COLOR[ev.impact] }]} />
                <View style={styles.eventLeft}>
                  <Text style={styles.eventTime}>{ev.time}</Text>
                  <View style={[styles.currencyBadge, {
                    borderColor: `${IMPACT_COLOR[ev.impact]}50`,
                    backgroundColor: `${IMPACT_COLOR[ev.impact]}12`,
                  }]}>
                    <Text style={[styles.currencyText, { color: IMPACT_COLOR[ev.impact] }]}>
                      {ev.currency}
                    </Text>
                  </View>
                </View>
                <View style={styles.eventRight}>
                  <Text style={styles.eventTitle}>{ev.title}</Text>
                  <View style={styles.eventMeta}>
                    <Text style={styles.eventMetaText}>{t('forecastLabel')}: {ev.forecast}</Text>
                    <Text style={styles.metaDot}>·</Text>
                    <Text style={styles.eventMetaText}>{t('prevLabel')}: {ev.prev}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Push Notification Notice */}
            <View style={styles.noticeCard}>
              <Text style={styles.noticeIcon}>◎</Text>
              <View style={styles.noticeRight}>
                <Text style={styles.noticeTitle}>{t('pushNotificationsTitle')}</Text>
                <Text style={styles.noticeSub}>{t('pushNotificationsDesc')}</Text>
              </View>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>{t('comingSoonBadge')}</Text>
              </View>
            </View>
          </>
        )}

        {/* ── AI Briefing Tab ── */}
        {subTab === 'briefing' && (
          <>
            {/* Briefing Header */}
            <View style={styles.briefingHeader}>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>{t('aiAgentsLabel')}</Text>
              </View>
              <Text style={styles.briefingTitle}>{t('dailyBriefingTitle')}</Text>
              <Text style={styles.briefingSub}>{t('briefingDesc')}</Text>
            </View>

            {/* Briefing Items */}
            {DUMMY_BRIEFING.map((item, i) => {
              const { icon, color } = directionIcon(item.direction);
              return (
                <View key={i} style={styles.briefingCard}>
                  <Text style={[styles.briefingIcon, { color }]}>{icon}</Text>
                  <View style={styles.briefingRight}>
                    <Text style={styles.briefingText}>{item.text}</Text>
                    <TouchableOpacity>
                      <Text style={styles.briefingSource}>via {item.source} →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Ask Card */}
            <View style={styles.askCard}>
              <Text style={styles.askTitle}>{t('askMarketAgent')}</Text>
              <View style={styles.askExamples}>
                {[t('marketExample1'), t('marketExample2'), t('marketExample3')].map((q, i) => (
                  <View key={i} style={styles.askExampleRow}>
                    <Text style={styles.askExampleArrow}>›</Text>
                    <Text style={styles.askExampleText}>{q}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.askBtn} activeOpacity={0.85}>
                <Text style={styles.askBtnText}>{t('openAIAdvisor')}</Text>
              </TouchableOpacity>
            </View>

            {/* Sources info */}
            <View style={styles.sourcesCard}>
              <Text style={styles.sourcesTitle}>{t('aiAgentSources')}</Text>
              <View style={styles.sourcesList}>
                {['Reuters', 'Bloomberg', 'FX Street', 'Investing.com', 'ForexFactory'].map(s => (
                  <View key={s} style={styles.sourceChip}>
                    <Text style={styles.sourceChipText}>{s}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.sourcesNote}>{t('sourcesDisclaimer')}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  title: { color: TEXT, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  date:  { color: MUTED, fontSize: 12 },

  subTabBar: {
    flexDirection: 'row', marginHorizontal: 16,
    backgroundColor: SURFACE, borderRadius: 12,
    padding: 3, marginBottom: 4,
    borderWidth: 1, borderColor: BORDER,
  },
  subTab:           { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  subTabActive:     { backgroundColor: BRAND },
  subTabText:       { color: MUTED, fontSize: 13, fontWeight: '600' },
  subTabTextActive: { color: '#000', fontWeight: '800' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, gap: 10, paddingBottom: 40 },

  legend:     { flexDirection: 'row', gap: 18, paddingBottom: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:        { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: MUTED, fontSize: 11 },

  filterScroll:  { marginBottom: 2 },
  filterContent: { gap: 8, paddingRight: 8 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: SURFACE,
    borderWidth: 1, borderColor: BORDER,
  },
  filterChipActive:     { backgroundColor: BRAND, borderColor: BRAND },
  filterChipText:       { color: MUTED, fontSize: 12, fontWeight: '600' },
  filterChipTextActive: { color: '#000', fontWeight: '800' },

  eventCard: {
    backgroundColor: SURFACE, borderRadius: 13,
    flexDirection: 'row', overflow: 'hidden',
    borderWidth: 1, borderColor: BORDER,
  },
  impactBar: { width: 4 },
  eventLeft: {
    width: 68, padding: 12,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  eventTime:    { color: TEXT, fontSize: 12, fontWeight: '700' },
  currencyBadge: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  currencyText:  { fontSize: 10, fontWeight: '800' },
  eventRight: { flex: 1, padding: 12, justifyContent: 'center', gap: 5 },
  eventTitle:    { color: TEXT, fontSize: 13, fontWeight: '600' },
  eventMeta:     { flexDirection: 'row', gap: 6, alignItems: 'center' },
  eventMetaText: { color: MUTED, fontSize: 11 },
  metaDot:       { color: BORDER, fontSize: 11 },

  noticeCard: {
    backgroundColor: '#0D1F1A', borderRadius: 14,
    padding: 16, flexDirection: 'row', alignItems: 'center',
    gap: 12, borderWidth: 1, borderColor: `${BRAND}25`,
  },
  noticeIcon:   { color: BRAND, fontSize: 22 },
  noticeRight:  { flex: 1, gap: 3 },
  noticeTitle:  { color: TEXT, fontSize: 13, fontWeight: '700' },
  noticeSub:    { color: MUTED, fontSize: 12, lineHeight: 17 },
  comingSoonBadge: {
    backgroundColor: `${BRAND}18`, borderRadius: 7,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: `${BRAND}35`,
  },
  comingSoonText: { color: BRAND, fontSize: 10, fontWeight: '800' },

  briefingHeader: { gap: 8, paddingBottom: 4 },
  aiBadge: {
    alignSelf: 'flex-start', backgroundColor: `${BRAND}18`,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: `${BRAND}35`,
  },
  aiBadgeText:  { color: BRAND, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  briefingTitle: { color: TEXT, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  briefingSub:   { color: MUTED, fontSize: 13, lineHeight: 19 },

  briefingCard: {
    backgroundColor: SURFACE, borderRadius: 14,
    padding: 14, flexDirection: 'row', gap: 12,
    borderWidth: 1, borderColor: BORDER,
  },
  briefingIcon:   { fontSize: 15, fontWeight: '900', marginTop: 2 },
  briefingRight:  { flex: 1, gap: 5 },
  briefingText:   { color: TEXT, fontSize: 13, lineHeight: 19 },
  briefingSource: { color: BRAND, fontSize: 11, fontWeight: '600' },

  askCard: {
    backgroundColor: '#0A1F17', borderRadius: 18,
    borderWidth: 1.5, borderColor: `${BRAND}35`,
    padding: 20, gap: 12,
  },
  askTitle:       { color: TEXT, fontSize: 16, fontWeight: '800' },
  askExamples:    { gap: 8 },
  askExampleRow:  { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  askExampleArrow:{ color: BRAND, fontSize: 14, fontWeight: '700', marginTop: 1 },
  askExampleText: { color: MUTED, fontSize: 13, flex: 1, lineHeight: 18, fontStyle: 'italic' },
  askBtn: {
    backgroundColor: BRAND, borderRadius: 13,
    paddingVertical: 13, alignItems: 'center',
  },
  askBtnText: { color: '#000', fontSize: 14, fontWeight: '800' },

  sourcesCard: {
    backgroundColor: SURFACE, borderRadius: 14,
    padding: 16, gap: 10, borderWidth: 1, borderColor: BORDER,
  },
  sourcesTitle: { color: TEXT, fontSize: 13, fontWeight: '700' },
  sourcesList:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sourceChip: {
    backgroundColor: '#2C2C2E', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  sourceChipText: { color: MUTED, fontSize: 11, fontWeight: '600' },
  sourcesNote:    { color: '#3A3A3C', fontSize: 11, lineHeight: 16 },
});
