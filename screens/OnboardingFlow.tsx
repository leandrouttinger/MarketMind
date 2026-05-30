import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, KeyboardAvoidingView, Platform, Animated, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ICONS, BUCK, BUCK_VID, SHARED_VID } from '../utils/imageAssets';
import MascotVideo from '../components/MascotVideo';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';

type StepType = 'single' | 'multi' | 'transition' | 'notifications';

interface Option {
  id: string;
  label: string;
  sub?: string;
  icon: any; // require() image
}

interface Step {
  type: StepType;
  title: string;
  subtitle?: string;
  options?: Option[];
}

const STEPS: Step[] = [
  {
    type: 'single',
    title: 'Why MarketMind?',
    options: [
      { id: 'a', icon: ICONS.invest,   label: 'Learn how to invest' },
      { id: 'b', icon: ICONS.markets,  label: 'Understand the markets' },
      { id: 'c', icon: ICONS.school,   label: 'School or work' },
      { id: 'd', icon: ICONS.curious,  label: 'Just curious' },
    ],
  },
  {
    type: 'single',
    title: 'How did you\nfind us?',
    options: [
      { id: 'a', icon: ICONS.social,   label: 'Instagram / Social Media' },
      { id: 'b', icon: ICONS.friends,  label: 'Friend or family' },
      { id: 'c', icon: ICONS.ai,       label: 'ChatGPT / AI' },
      { id: 'd', icon: ICONS.other,    label: 'Other...' },
    ],
  },
  {
    type: 'single',
    title: 'Your finance\nlevel right now?',
    options: [
      { id: 'a', icon: ICONS.beginner,     label: 'Beginner',     sub: 'Just getting started' },
      { id: 'b', icon: ICONS.basic,        label: 'Basic',        sub: 'Know the basics' },
      { id: 'c', icon: ICONS.intermediate, label: 'Intermediate', sub: 'Stocks and markets' },
      { id: 'd', icon: ICONS.advanced,     label: 'Advanced',     sub: 'I actively trade' },
    ],
  },
  {
    type: 'transition',
    title: 'Good instincts.\nNow prove it.',
    subtitle: '5 questions. 2 minutes. Your level, locked in.',
  },
  {
    type: 'multi',
    title: 'What is your\nmain goal?',
    subtitle: 'Pick all that fit',
    options: [
      { id: 'a', icon: ICONS.wealth,    label: 'Build long-term wealth' },
      { id: 'b', icon: ICONS.investing, label: 'Start investing smart' },
      { id: 'c', icon: ICONS.decisions, label: 'Make better money decisions' },
      { id: 'd', icon: ICONS.career,    label: 'Career or education' },
      { id: 'e', icon: ICONS.love,      label: 'I just love finance' },
    ],
  },
  {
    type: 'single',
    title: 'Daily time\ncommitment?',
    options: [
      { id: 'a', icon: ICONS.min5,  label: '5 minutes',   sub: 'Quick wins every day' },
      { id: 'b', icon: ICONS.min10, label: '10 minutes',  sub: 'Steady and consistent' },
      { id: 'c', icon: ICONS.min15, label: '15 minutes',  sub: 'Serious progress' },
      { id: 'd', icon: ICONS.min20, label: '20+ minutes', sub: 'All in' },
    ],
  },
  {
    type: 'notifications',
    title: "Streaks die\nin silence.",
    subtitle: 'One reminder. That is all it takes.',
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
  const isMulti      = current.type === 'multi';
  const isNotif      = current.type === 'notifications';
  const showCustomInput = selected.includes('d') && step === 1;
  const canContinue =
    isTransition || isNotif ||
    (selected.length > 0 && (!showCustomInput || customText.trim().length > 0));

  const animateIn = () => {
    slideAnim.setValue(20);
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
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.stepCount}>{step + 1}/{STEPS.length}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>

          <Text style={styles.title}>{current.title.replace('{name}', userName)}</Text>
          {current.subtitle && <Text style={styles.subtitle}>{current.subtitle}</Text>}

          {/* ── Transition ── */}
          {isTransition && (
            <View style={styles.transitionContent}>
              <MascotVideo video={BUCK_VID.idle} fallback={BUCK.default} size={200} />
              <Text style={styles.transitionName}>Ready, {userName}?</Text>
              <Text style={styles.transitionDesc}>5 questions. No pressure.</Text>
            </View>
          )}

          {/* ── Options ── */}
          {current.options && (
            <View style={styles.options}>
              {current.options.map((opt) => {
                const isSelected = selected.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleOption(opt.id)}
                    activeOpacity={0.75}
                  >
                    <Image source={opt.icon} style={styles.optionIcon} resizeMode="contain" />
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

          {/* ── Notifications ── */}
          {isNotif && (
            <View style={styles.notifCard}>
              <MascotVideo video={BUCK_VID.idle} fallback={BUCK.default} size={120} />
              <MascotVideo video={SHARED_VID.bellRing} fallback={ICONS.bell} size={70} />
              <Text style={styles.notifStat}>
                Users with reminders are{' '}
                <Text style={styles.notifHighlight}>3x more consistent.</Text>
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
              {step === STEPS.length - 1 ? "Let's go!" : 'Continue →'}
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

  title: { color: TEXT, fontSize: 30, fontWeight: '800', lineHeight: 38, letterSpacing: -0.6, marginBottom: 8 },
  subtitle: { color: MUTED, fontSize: 15, lineHeight: 22, marginBottom: 28 },

  // Transition
  transitionContent: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  transitionMascot: { width: 180, height: 180 },
  transitionName: { color: BRAND, fontSize: 22, fontWeight: '800' },
  transitionDesc: { color: MUTED, fontSize: 15, textAlign: 'center' },

  // Options
  options: { gap: 11, marginTop: 4 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: SURFACE, borderRadius: 16,
    padding: 12, borderWidth: 1.5, borderColor: BORDER, gap: 12,
  },
  optionSelected: { borderColor: BRAND, backgroundColor: `${BRAND}0D` },
  optionIcon: { width: 48, height: 48, borderRadius: 12 },
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
    padding: 24, alignItems: 'center', gap: 14,
    marginTop: 8, borderWidth: 1, borderColor: BORDER,
  },
  notifMascot: { width: 120, height: 120 },
  notifBell: { width: 56, height: 56, marginTop: -8 },
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
