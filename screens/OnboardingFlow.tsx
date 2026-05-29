import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';

// ─── Placeholder icon component (swap with Banana AI image later) ─────────────
const SHAPES = ['◆', '○', '▲', '⬡', '◈'];
const SHAPE_COLORS = ['#10B981', '#60A5FA', '#F59E0B', '#E879F9', '#F97316'];

function PlaceholderIcon({ index, selected }: { index: number; selected: boolean }) {
  const color = SHAPE_COLORS[index % SHAPE_COLORS.length];
  return (
    <View style={[ph.box, { borderColor: selected ? color : `${color}40`, backgroundColor: `${color}10` }]}>
      <Text style={[ph.shape, { color: selected ? color : `${color}60` }]}>
        {SHAPES[index % SHAPES.length]}
      </Text>
    </View>
  );
}

const ph = StyleSheet.create({
  box: {
    width: 50, height: 50, borderRadius: 14,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  shape: { fontSize: 22, fontWeight: '900' },
});

// ─── Mascot placeholder (swap with Banana AI character later) ────────────────
function MascotPlaceholder({ size = 160, label = 'MASCOT' }: { size?: number; label?: string }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[mp.wrap, { width: size, height: size, borderRadius: size * 0.28 }, { transform: [{ scale: pulse }] }]}>
      <Text style={mp.icon}>◈</Text>
      <Text style={mp.label}>{label}</Text>
      <Text style={mp.sub}>Banana AI</Text>
    </Animated.View>
  );
}

const mp = StyleSheet.create({
  wrap: {
    backgroundColor: `${BRAND}0A`, borderWidth: 1.5,
    borderColor: `${BRAND}30`, alignItems: 'center',
    justifyContent: 'center', gap: 4,
  },
  icon: { fontSize: 44, color: `${BRAND}60` },
  label: { color: `${BRAND}80`, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  sub: { color: `${BRAND}40`, fontSize: 9, letterSpacing: 0.8 },
});

// ─── Step definitions ─────────────────────────────────────────────────────────
type StepType = 'single' | 'multi' | 'transition' | 'notifications';

interface Option { id: string; label: string; sub?: string }
interface Step {
  type: StepType;
  title: string;
  subtitle?: string;
  options?: Option[];
}

const STEPS: Step[] = [
  {
    type: 'single',
    title: 'Why did you download\nMarketMind?',
    options: [
      { id: 'a', label: 'Learn how to invest' },
      { id: 'b', label: 'Understand the markets' },
      { id: 'c', label: 'School or work' },
      { id: 'd', label: 'Just curious' },
    ],
  },
  {
    type: 'single',
    title: 'How did you hear\nabout us?',
    options: [
      { id: 'a', label: 'Instagram / Social Media' },
      { id: 'b', label: 'Friend or family' },
      { id: 'c', label: 'ChatGPT / AI' },
      { id: 'd', label: 'Other...' },
    ],
  },
  {
    type: 'single',
    title: 'How would you rate\nyour finance knowledge?',
    options: [
      { id: 'a', label: 'Beginner',     sub: "I'm just getting started" },
      { id: 'b', label: 'Basic',        sub: 'I know the fundamentals' },
      { id: 'c', label: 'Intermediate', sub: 'I understand stocks & markets' },
      { id: 'd', label: 'Advanced',     sub: 'I trade or invest actively' },
    ],
  },
  {
    type: 'transition',
    title: "You're on the right path.\nLet's make it official.",
    subtitle: "A quick 5-question test reveals exactly where you stand — and unlocks your personal learning path.",
  },
  {
    type: 'multi',
    title: 'What do you want to\nachieve with finance?',
    subtitle: 'Select all that apply',
    options: [
      { id: 'a', label: 'Build long-term wealth' },
      { id: 'b', label: 'Start investing smart' },
      { id: 'c', label: 'Make better money decisions' },
      { id: 'd', label: 'Career or education goals' },
      { id: 'e', label: "It's fun & I love it" },
    ],
  },
  {
    type: 'single',
    title: 'How much time can\nyou spare daily?',
    options: [
      { id: 'a', label: '5 minutes',  sub: 'Quick daily boost — always enough' },
      { id: 'b', label: '10 minutes', sub: 'Steady progress, every single day' },
      { id: 'c', label: '15 minutes', sub: 'Solid learning, real results' },
      { id: 'd', label: '20+ minutes', sub: 'Full focus — you mean business' },
    ],
  },
  {
    type: 'notifications',
    title: "The #1 reason people\nfail? They forget.",
    subtitle: "3× more likely to hit your goals with daily reminders. Takes 2 seconds to enable.",
  },
];

interface Props {
  userName: string;
  onComplete: (goals: string[]) => void;
}

export default function OnboardingFlow({ userName, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [customText, setCustomText] = useState('');
  const [goalsAnswer, setGoalsAnswer] = useState<string[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const current = STEPS[step];
  const progress = (step + 1) / STEPS.length;
  const isTransition = current.type === 'transition';
  const isMulti = current.type === 'multi';
  const isNotif = current.type === 'notifications';
  const showCustomInput = selected.includes('d') && step === 1;
  const canContinue =
    isTransition || isNotif ||
    (selected.length > 0 && (!showCustomInput || customText.trim().length > 0));

  const animateIn = () => {
    slideAnim.setValue(24);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
  };

  const handleOption = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isMulti) {
      setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setSelected([id]);
      setCustomText('');
    }
  };

  const handleContinue = async () => {
    if (!canContinue) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step === 4 && isMulti) setGoalsAnswer([...selected]);
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      setSelected([]);
      setCustomText('');
      animateIn();
    } else {
      onComplete(goalsAnswer);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Progress */}
      <View style={styles.header}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.stepCount}>{step + 1}/{STEPS.length}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>

          <Text style={styles.title}>{current.title.replace('{name}', userName)}</Text>
          {current.subtitle && <Text style={styles.subtitle}>{current.subtitle}</Text>}

          {/* ── Transition screen ── */}
          {isTransition && (
            <View style={styles.transitionContent}>
              <MascotPlaceholder size={170} label="MASCOT" />
              <View style={styles.transitionTextBlock}>
                <Text style={styles.transitionName}>Ready, {userName}?</Text>
                <Text style={styles.transitionDesc}>
                  Most people guess their level wrong.{'\n'}
                  5 questions. No pressure. Let's find out.
                </Text>
              </View>
            </View>
          )}

          {/* ── Options ── */}
          {current.options && (
            <View style={styles.options}>
              {current.options.map((opt, i) => {
                const isSelected = selected.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleOption(opt.id)}
                    activeOpacity={0.75}
                  >
                    <PlaceholderIcon index={i} selected={isSelected} />
                    <View style={styles.optionText}>
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                        {opt.label}
                      </Text>
                      {opt.sub && <Text style={styles.optionSub}>{opt.sub}</Text>}
                    </View>
                    {isMulti && (
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
              {showCustomInput && (
                <TextInput
                  style={styles.customInput}
                  value={customText}
                  onChangeText={setCustomText}
                  placeholder="Tell us how you found us..."
                  placeholderTextColor={MUTED}
                  autoFocus
                  maxLength={80}
                />
              )}
            </View>
          )}

          {/* ── Notification screen ── */}
          {isNotif && (
            <View style={styles.notifCard}>
              <MascotPlaceholder size={120} label="REMINDER" />
              <Text style={styles.notifStat}>
                Users with reminders are{' '}
                <Text style={styles.notifHighlight}>3× more consistent.</Text>
              </Text>
              <View style={styles.notifFactRow}>
                <View style={styles.notifFact}>
                  <Text style={styles.notifFactNum}>87%</Text>
                  <Text style={styles.notifFactLabel}>finish their daily quiz</Text>
                </View>
                <View style={styles.notifFactDivider} />
                <View style={styles.notifFact}>
                  <Text style={styles.notifFactNum}>5 min</Text>
                  <Text style={styles.notifFactLabel}>is all it takes</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.notifBtn, notifEnabled && styles.notifBtnActive]}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setNotifEnabled(v => !v);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.notifBtnText, notifEnabled && styles.notifBtnTextActive]}>
                  {notifEnabled ? '✓  Reminders enabled' : 'Enable daily reminders'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueBtn, !canContinue && styles.continueBtnOff]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={[styles.continueBtnText, !canContinue && styles.continueBtnTextOff]}>
              {step === STEPS.length - 1 ? "Let's go! →" : 'Continue →'}
            </Text>
          </TouchableOpacity>
          {isNotif && !notifEnabled && (
            <TouchableOpacity onPress={handleContinue} style={styles.skipLink}>
              <Text style={styles.skipLinkText}>Skip for now</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8, gap: 12,
  },
  progressTrack: { flex: 1, height: 5, backgroundColor: SURFACE, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: BRAND, borderRadius: 99 },
  stepCount: { color: MUTED, fontSize: 12, fontWeight: '600' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },

  title: {
    color: TEXT, fontSize: 30, fontWeight: '800',
    lineHeight: 38, letterSpacing: -0.6, marginBottom: 8,
  },
  subtitle: { color: MUTED, fontSize: 15, lineHeight: 22, marginBottom: 28 },

  // Transition
  transitionContent: { alignItems: 'center', paddingVertical: 28, gap: 24 },
  transitionTextBlock: { alignItems: 'center', gap: 8 },
  transitionName: { color: BRAND, fontSize: 22, fontWeight: '800' },
  transitionDesc: { color: MUTED, fontSize: 15, textAlign: 'center', lineHeight: 22 },

  // Options
  options: { gap: 11, marginTop: 4 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: SURFACE, borderRadius: 16,
    padding: 14, borderWidth: 1.5, borderColor: BORDER, gap: 14,
  },
  optionSelected: { borderColor: BRAND, backgroundColor: `${BRAND}0D` },
  optionText: { flex: 1, gap: 2 },
  optionLabel: { color: TEXT, fontSize: 15, fontWeight: '600' },
  optionLabelSelected: { color: BRAND },
  optionSub: { color: MUTED, fontSize: 12 },
  checkbox: {
    width: 24, height: 24, borderRadius: 7,
    borderWidth: 2, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: BRAND, borderColor: BRAND },
  checkboxTick: { color: '#000', fontSize: 13, fontWeight: '900' },
  customInput: {
    backgroundColor: SURFACE, borderRadius: 14, padding: 16,
    color: TEXT, fontSize: 15, borderWidth: 1.5, borderColor: BRAND, marginTop: 4,
  },

  // Notifications
  notifCard: {
    backgroundColor: SURFACE, borderRadius: 22,
    padding: 24, alignItems: 'center', gap: 18,
    marginTop: 8, borderWidth: 1, borderColor: BORDER,
  },
  notifStat: { color: MUTED, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  notifHighlight: { color: TEXT, fontWeight: '700' },
  notifFactRow: { flexDirection: 'row', width: '100%', alignItems: 'center' },
  notifFact: { flex: 1, alignItems: 'center', gap: 2 },
  notifFactNum: { color: BRAND, fontSize: 24, fontWeight: '900' },
  notifFactLabel: { color: MUTED, fontSize: 11, textAlign: 'center' },
  notifFactDivider: { width: 1, height: 40, backgroundColor: BORDER },
  notifBtn: {
    borderRadius: 14, paddingVertical: 16, paddingHorizontal: 28,
    borderWidth: 1.5, borderColor: BRAND, width: '100%', alignItems: 'center',
  },
  notifBtnActive: { backgroundColor: BRAND },
  notifBtnText: { color: BRAND, fontSize: 15, fontWeight: '700' },
  notifBtnTextActive: { color: '#000' },

  // Footer
  footer: { paddingHorizontal: 24, paddingBottom: 36, paddingTop: 10, gap: 10 },
  continueBtn: { backgroundColor: BRAND, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  continueBtnOff: { backgroundColor: SURFACE },
  continueBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
  continueBtnTextOff: { color: MUTED },
  skipLink: { alignItems: 'center', paddingVertical: 4 },
  skipLinkText: { color: MUTED, fontSize: 14 },
});
