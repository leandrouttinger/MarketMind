import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
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

const LANGS: { code: Language; flag: string; name: string; sub: string }[] = [
  { code: 'en', flag: '🇬🇧', name: 'English',  sub: 'Continue in English'  },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch',  sub: 'Weiter auf Deutsch'   },
  { code: 'es', flag: '🇪🇸', name: 'Español',  sub: 'Continuar en español' },
];

interface Props {
  onContinue: () => void;
}

export default function LanguageScreen({ onContinue }: Props) {
  const { setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>('en');
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
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

        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>MM</Text>
          </View>
          <Text style={styles.appName}>MarketMind</Text>
        </View>

        {/* Heading */}
        <View style={styles.headingBlock}>
          <Text style={styles.title}>Choose your language</Text>
          <Text style={styles.subtitle}>You can change this anytime in settings.</Text>
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
                <View style={styles.cardText}>
                  <Text style={[styles.langName, isActive && styles.langNameActive]}>
                    {lang.name}
                  </Text>
                  <Text style={styles.langSub}>{lang.sub}</Text>
                </View>
                <View style={[styles.radio, isActive && styles.radioActive]}>
                  {isActive && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.btn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.btnText}>Continue →</Text>
        </TouchableOpacity>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 36 },

  logoWrap: { alignItems: 'center', gap: 10 },
  logo: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center',
    shadowColor: BRAND, shadowOpacity: 0.5, shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 }, elevation: 12,
  },
  logoText: { color: '#000', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  appName: { color: TEXT, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },

  headingBlock: { gap: 6 },
  title: { color: TEXT, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: MUTED, fontSize: 14 },

  cards: { gap: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: SURFACE, borderRadius: 18, padding: 18,
    borderWidth: 1.5, borderColor: BORDER,
  },
  cardActive: { borderColor: BRAND, backgroundColor: `${BRAND}0D` },
  flag: { fontSize: 32 },
  cardText: { flex: 1, gap: 2 },
  langName: { color: TEXT, fontSize: 17, fontWeight: '700' },
  langNameActive: { color: BRAND },
  langSub: { color: MUTED, fontSize: 12 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: BRAND },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: BRAND },

  btn: {
    backgroundColor: BRAND, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: BRAND, shadowOpacity: 0.3,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
  },
  btnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 0.2 },
});
