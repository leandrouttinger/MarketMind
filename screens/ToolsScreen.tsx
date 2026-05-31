import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const BRAND   = '#10B981';
const BG      = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER  = '#2C2C2E';
const TEXT    = '#FFFFFF';
const MUTED   = '#8E8E93';
const GOLD    = '#F59E0B';
const PURPLE  = '#8B5CF6';
const CORAL   = '#F97316';

interface Tool {
  id: string;
  icon: string;
  color: string;
  title: string;
  desc: string;
  features: string[];
  badge: string;
  badgeColor: string;
  cta: string;
  available: boolean;
}

const TOOLS: Tool[] = [
  {
    id: 'ai',
    icon: '⬡',
    color: BRAND,
    title: 'AI Finance Advisor',
    desc: 'Frag alles über Märkte, deine Strategie oder Finanzen. Echte KI-Antworten — kein generischer Chatbot.',
    features: [
      'Unbegrenzte Fragen',
      'Markt-Kontext in Echtzeit',
      'Persönliche Finanzberatung',
      'Keine Themenlimits',
    ],
    badge: 'PRO',
    badgeColor: GOLD,
    cta: 'Chat öffnen',
    available: true,
  },
  {
    id: 'budget',
    icon: '◧',
    color: PURPLE,
    title: 'Budget Planer',
    desc: 'Gib dein Einkommen und Fixkosten ein. Die App berechnet deinen Sparplan und sagt dir, wie du dein Ziel erreichst.',
    features: [
      'Einkommen & Ausgaben',
      'Sparziel setzen',
      'KI-Spartipps',
      'Monatsplanung',
    ],
    badge: 'Bald',
    badgeColor: MUTED,
    cta: 'Budget planen',
    available: false,
  },
  {
    id: 'calculator',
    icon: '◈',
    color: CORAL,
    title: 'AI Calculator',
    desc: 'Sag der KI was du brauchst — z. B. "Erstell mir einen Rechner für meine Hochzeitsplanung" — und erhalte eine schöne, exportierbare Tabelle.',
    features: [
      'Beliebige Rechner erstellen',
      'Ästhetisches Design',
      'Beispielwerte automatisch',
      'Als CSV exportierbar',
    ],
    badge: 'Bald',
    badgeColor: MUTED,
    cta: 'Rechner erstellen',
    available: false,
  },
];

interface Props {
  onOpenAI: () => void;
}

export default function ToolsScreen({ onOpenAI }: Props) {
  const handlePress = async (tool: Tool) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (tool.id === 'ai') {
      onOpenAI();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tools</Text>
        <Text style={styles.subtitle}>Deine smarten Finanz-Werkzeuge</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TOOLS.map(tool => (
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
              <View style={[
                styles.badge,
                {
                  backgroundColor: `${tool.badgeColor}18`,
                  borderColor: `${tool.badgeColor}40`,
                },
              ]}>
                <Text style={[styles.badgeText, { color: tool.badgeColor }]}>{tool.badge}</Text>
              </View>
            </View>

            {/* Title + Desc */}
            <Text style={styles.toolTitle}>{tool.title}</Text>
            <Text style={styles.toolDesc}>{tool.desc}</Text>

            {/* Feature List */}
            <View style={styles.featureList}>
              {tool.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={[styles.featureCheck, { color: tool.color }]}>✓</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <View style={styles.divider} />
            <View style={styles.ctaRow}>
              <Text style={[styles.ctaText, { color: tool.available ? tool.color : MUTED }]}>
                {tool.cta} {tool.available ? '→' : ''}
              </Text>
              {!tool.available && (
                <View style={styles.comingSoonChip}>
                  <Text style={styles.comingSoonChipText}>Coming Soon</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>◎</Text>
          <View style={styles.infoRight}>
            <Text style={styles.infoTitle}>Mehr Tools kommen</Text>
            <Text style={styles.infoSub}>
              Contract Rechner, Portfolio Tracker und mehr — werden laufend hinzugefügt.
            </Text>
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
