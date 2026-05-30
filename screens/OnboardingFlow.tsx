import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, KeyboardAvoidingView, Platform, Animated, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ICONS, BUCK, BUCK_VID, SHARED_VID } from '../utils/imageAssets';
import MascotVideo from '../components/MascotVideo';
import { useLanguage } from '../contexts/LanguageContext';

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

// Steps are built dynamically using t() — see buildSteps() below

interface Props {
  userName: string;
  onComplete: (goals: string[]) => void;
}

function buildSteps(t: (k: string) => string): Step[] {
  return [
    {
      type: 'single', title: t('ob1Title'),
      options: [
        { id: 'a', icon: ICONS.invest,   label: t('ob1a') },
        { id: 'b', icon: ICONS.markets,  label: t('ob1b') },
        { id: 'c', icon: ICONS.school,   label: t('ob1c') },
        { id: 'd', icon: ICONS.curious,  label: t('ob1d') },
      ],
    },
    {
      type: 'single', title: t('ob2Title'),
      options: [
        { id: 'a', icon: ICONS.social,   label: t('ob2a') },
        { id: 'b', icon: ICONS.friends,  label: t('ob2b') },
        { id: 'c', icon: ICONS.ai,       label: t('ob2c') },
        { id: 'd', icon: ICONS.other,    label: t('ob2d') },
      ],
    },
    {
      type: 'single', title: t('ob3Title'),
      options: [
        { id: 'a', icon: ICONS.beginner,     label: t('ob3a'), sub: t('ob3aSub') },
        { id: 'b', icon: ICONS.basic,        label: t('ob3b'), sub: t('ob3bSub') },
        { id: 'c', icon: ICONS.intermediate, label: t('ob3c'), sub: t('ob3cSub') },
        { id: 'd', icon: ICONS.advanced,     label: t('ob3d'), sub: t('ob3dSub') },
      ],
    },
    { type: 'transition', title: t('ob4Title'), subtitle: t('ob4Sub') },
    {
      type: 'multi', title: t('ob5Title'), subtitle: t('ob5Sub'),
      options: [
        { id: 'a', icon: ICONS.wealth,    label: t('ob4a') },
        { id: 'b', icon: ICONS.investing, label: t('ob4b') },
        { id: 'c', icon: ICONS.decisions, label: t('ob4c') },
        { id: 'd', icon: ICONS.career,    label: t('ob4d') },
        { id: 'e', icon: ICONS.love,      label: t('ob4e') },
      ],
    },
    {
      type: 'single', title: t('ob6Title'),
      options: [
        { id: 'a', icon: ICONS.min5,  label: t('ob5a'), sub: t('ob5aSub') },
        { id: 'b', icon: ICONS.min10, label: t('ob5b'), sub: t('ob5bSub') },
        { id: 'c', icon: ICONS.min15, label: t('ob5c'), sub: t('ob5cSub') },
        { id: 'd', icon: ICONS.min20, label: t('ob5d'), sub: t('ob5dSub') },
      ],
    },
    { type: 'notifications', title: t('ob7Title'), subtitle: t('ob7Sub') },
  ];
}

export default function OnboardingFlow({ userName, onComplete }: Props) {
  const { t } = useLanguage();
  const STEPS = buildSteps(t);
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
              <Text style={styles.transitionName}>{t('readyName').replace('{name}', userName)}</Text>
              <Text style={styles.transitionDesc}>{t('fiveQuestionsNoPressure')}</Text>
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
                {t('notifStat')}{' '}
                <Text style={styles.notifHighlight}>{t('notifHighlight')}</Text>
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
                  {notifEnabled ? t('remindersEnabled') : t('enableReminders')}
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
              {step === STEPS.length - 1 ? t('letsGo') : t('continueBtn')}
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
