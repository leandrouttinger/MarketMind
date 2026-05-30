import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';
import { BUCK } from '../utils/imageAssets';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1A1A1A';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#6B7280';

const LANGS: { code: Language; flag: string; name: string; color: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English',   color: '#3B82F6' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch',   color: '#F59E0B' },
  { code: 'es', flag: '🇪🇸', name: 'Español',   color: '#EF4444' },
  { code: 'pt', flag: '🇧🇷', name: 'Português', color: '#10B981' },
];

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

        {/* Buck mascot — centered top */}
        <View style={styles.mascotWrap}>
          <Image source={BUCK.default} style={styles.mascot} resizeMode="contain" />
          <Text style={styles.title}>Pick your language.</Text>
          <Text style={styles.subtitle}>Switch anytime in settings.</Text>
        </View>

        {/* Language cards */}
        <View style={styles.cards}>
          {LANGS.map((lang) => {
            const isActive = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.card, isActive && { borderColor: lang.color, backgroundColor: `${lang.color}0D` }]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.75}
              >
                {/* Flag placeholder box */}
                <View style={[styles.flagBox, { backgroundColor: `${lang.color}20`, borderColor: `${lang.color}40` }]}>
                  <Text style={styles.flagEmoji}>{lang.flag}</Text>
                </View>

                <Text style={[styles.langName, isActive && { color: lang.color }]}>
                  {lang.name}
                </Text>

                <View style={[styles.radio, isActive && { borderColor: lang.color }]}>
                  {isActive && <View style={[styles.radioDot, { backgroundColor: lang.color }]} />}
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
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 28 },

  mascotWrap: { alignItems: 'center', gap: 12 },
  mascot: { width: 130, height: 130 },
  title:    { color: TEXT,  fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { color: MUTED, fontSize: 14 },

  cards: { gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: SURFACE, borderRadius: 16, padding: 14,
    borderWidth: 1.5, borderColor: BORDER,
  },
  flagBox: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  flagEmoji: { fontSize: 24 },
  langName: { flex: 1, color: TEXT, fontSize: 16, fontWeight: '600' },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },

  btn: {
    backgroundColor: BRAND, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: BRAND, shadowOpacity: 0.25,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
  },
  btnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
});
