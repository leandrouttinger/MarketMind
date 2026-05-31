import React from 'react';
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
const GOLD    = '#F59E0B';
const PURPLE  = '#8B5CF6';
const CORAL   = '#F97316';

interface ToolDef {
  id: string;
  icon: string;
  color: string;
  titleKey: string;
  descKey: string;
  featureKeys: string[];
  badgeKey: string;
  badgeColor: string;
  ctaKey: string;
  available: boolean;
}

const TOOL_DEFS: ToolDef[] = [
  {
    id: 'ai', icon: '⬡', color: BRAND,
    titleKey: 'aiAdvisorTitle', descKey: 'aiAdvisorDesc',
    featureKeys: ['featureUnlimitedQ', 'featureRealTime', 'featurePersonal', 'featureNoLimits'],
    badgeKey: 'proBadge', badgeColor: GOLD, ctaKey: 'openChat', available: true,
  },
  {
    id: 'budget', icon: '◧', color: PURPLE,
    titleKey: 'budgetPlannerTitle', descKey: 'budgetPlannerDesc',
    featureKeys: ['featureIncomeExpenses', 'featureSavingGoal', 'featureAISavingTips', 'featureMonthly'],
    badgeKey: 'comingSoonBadge', badgeColor: MUTED, ctaKey: 'budgetPlannerCTA', available: false,
  },
  {
    id: 'calculator', icon: '◈', color: CORAL,
    titleKey: 'aiCalculatorTitle', descKey: 'aiCalculatorDesc',
    featureKeys: ['featureCustomCalc', 'featureAesthetic', 'featureAutoValues', 'featureCSV'],
    badgeKey: 'comingSoonBadge', badgeColor: MUTED, ctaKey: 'createCalcCTA', available: false,
  },
];

interface Props {
  onOpenAI: () => void;
}

export default function ToolsScreen({ onOpenAI }: Props) {
  const { t } = useLanguage();

  const handlePress = async (tool: ToolDef) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (tool.id === 'ai') onOpenAI();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('toolsTitle')}</Text>
        <Text style={styles.subtitle}>{t('toolsSubtitle')}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TOOL_DEFS.map(tool => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.card, { borderColor: tool.available ? `${tool.color}30` : BORDER }]}
            onPress={() => handlePress(tool)}
            activeOpacity={tool.available ? 0.8 : 0.6}
          >
            {/* Card Top */}
            <View style={styles.cardTop}>
              <View style={[styles.iconWrap, { backgroundColor: `${tool.color}18` }]}>
                <Text style={[styles.icon, { color: tool.color }]}>{tool.icon}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: `${tool.badgeColor}18`, borderColor: `${tool.badgeColor}40` }]}>
                <Text style={[styles.badgeText, { color: tool.badgeColor }]}>
                  {tool.id === 'ai' ? 'PRO' : t(tool.badgeKey)}
                </Text>
              </View>
            </View>

            {/* Title + Desc */}
            <Text style={styles.toolTitle}>{t(tool.titleKey)}</Text>
            <Text style={styles.toolDesc}>{t(tool.descKey)}</Text>

            {/* Feature List */}
            <View style={styles.featureList}>
              {tool.featureKeys.map((fk, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={[styles.featureCheck, { color: tool.color }]}>✓</Text>
                  <Text style={styles.featureText}>{t(fk)}</Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <View style={styles.divider} />
            <View style={styles.ctaRow}>
              <Text style={[styles.ctaText, { color: tool.available ? tool.color : MUTED }]}>
                {t(tool.ctaKey)} {tool.available ? '→' : ''}
              </Text>
              {!tool.available && (
                <View style={styles.comingSoonChip}>
                  <Text style={styles.comingSoonChipText}>{t('comingSoon')}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>◎</Text>
          <View style={styles.infoRight}>
            <Text style={styles.infoTitle}>{t('moreToolsTitle')}</Text>
            <Text style={styles.infoSub}>{t('moreToolsDesc')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 4 },
  title:    { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: MUTED, fontSize: 13 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 14, paddingBottom: 40 },

  card: {
    backgroundColor: SURFACE, borderRadius: 20,
    padding: 20, gap: 12,
    borderWidth: 1,
  },

  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconWrap: { width: 54, height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  icon:     { fontSize: 25 },
  badge: {
    borderRadius: 7, paddingHorizontal: 9, paddingVertical: 4,
    borderWidth: 1,
  },
  badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  toolTitle: { color: TEXT, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  toolDesc:  { color: MUTED, fontSize: 13, lineHeight: 20 },

  featureList: { gap: 7 },
  featureRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureCheck:{ fontSize: 14, fontWeight: '800', width: 18 },
  featureText: { color: TEXT, fontSize: 13 },

  divider: { height: 1, backgroundColor: BORDER },
  ctaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctaText: { fontSize: 14, fontWeight: '700' },
  comingSoonChip: {
    backgroundColor: '#2C2C2E', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  comingSoonChipText: { color: MUTED, fontSize: 11, fontWeight: '600' },

  infoCard: {
    backgroundColor: '#111', borderRadius: 14,
    padding: 16, flexDirection: 'row', alignItems: 'center',
    gap: 12, borderWidth: 1, borderColor: BORDER,
  },
  infoIcon:  { color: MUTED, fontSize: 22 },
  infoRight: { flex: 1, gap: 4 },
  infoTitle: { color: TEXT, fontSize: 13, fontWeight: '700' },
  infoSub:   { color: MUTED, fontSize: 12, lineHeight: 17 },
});
