import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1A1A1A';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#6B7280';

const LANGS: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇬🇧', name: 'English'            },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch'            },
  { code: 'es', flag: '🇪🇸', name: 'Español'            },
  { code: 'pt', flag: '🇧🇷', name: 'Português'          },
];

// Placeholder — swap with Banana AI mascot image later
function MascotPlaceholder() {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[ph.box, { transform: [{ scale: pulse }] }]}>
      <Text style={ph.icon}>◈</Text>
      <Text style={ph.label}>MASCOT</Text>
    </Animated.View>
  );
}
const ph = StyleSheet.create({
  box: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: `${BRAND}0A`, borderWidth: 1.5,
    borderColor: `${BRAND}30`, alignItems: 'center',
    justifyContent: 'center', gap: 4,
  },
  icon:  { fontSize: 36, color: `${BRAND}60` },
  label: { color: `${BRAND}70`, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
});

interface Props { onContinue: () => void }

export default function LanguageScreen({ onContinue }: Props) {
  const { setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>('en');
  const fadeIn  = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, useNativeDriver: true, tension: 70, friction: 11 }),
    ]).start();
  }, []);

  const handleSelect = async (code: Language) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(code);
    setLanguage(code);
  };

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onContinue();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.inner, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>

        {/* Mascot placeholder */}
        <View style={styles.top}>
          <MascotPlaceholder />
          <View style={styles.headingBlock}>
            <Text style={styles.title}>Pick your language.</Text>
            <Text style={styles.subtitle}>Switch anytime in settings.</Text>
          </View>
        </View>

        {/* Language cards */}
        <View style={styles.cards}>
          {LANGS.map((lang) => {
            const isActive = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.card, isActive && styles.cardActive]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.75}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={[styles.langName, isActive && styles.langNameActive]}>
                  {lang.name}
                </Text>
                <View style={[styles.radio, isActive && styles.radioActive]}>
                  {isActive && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.btnText}>Let's go</Text>
        </TouchableOpacity>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 32 },

  top: { alignItems: 'center', gap: 20 },
  headingBlock: { alignItems: 'center', gap: 6 },
  title:    { color: TEXT,  fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { color: MUTED, fontSize: 14 },

  cards: { gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: SURFACE, borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: BORDER,
  },
  cardActive: { borderColor: BRAND, backgroundColor: `${BRAND}0D` },
  flag:            { fontSize: 28 },
  langName:        { flex: 1, color: TEXT,  fontSize: 16, fontWeight: '600' },
  langNameActive:  { color: BRAND },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: BRAND },
  radioDot:    { width: 10, height: 10, borderRadius: 5, backgroundColor: BRAND },

  btn: {
    backgroundColor: BRAND, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: BRAND, shadowOpacity: 0.25,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
  },
  btnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
});
