import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';
import { BUCK, BUCK_VID, ICONS } from '../utils/imageAssets';
import MascotVideo from '../components/MascotVideo';

const BRAND  = '#10B981';
const BG     = '#0F0F0F';
const SURFACE = '#1A1A1A';
const BORDER  = '#2C2C2E';
const TEXT    = '#FFFFFF';
const MUTED   = '#6B7280';

const LANGS: { code: Language; flag: any; name: string }[] = [
  { code: 'en', flag: ICONS.flagEn, name: 'English'   },
  { code: 'de', flag: ICONS.flagDe, name: 'Deutsch'   },
  { code: 'es', flag: ICONS.flagEs, name: 'Español'   },
  { code: 'pt', flag: ICONS.flagPt, name: 'Português' },
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

        {/* Buck mascot — transparent */}
        <View style={styles.mascotWrap}>
          <MascotVideo video={BUCK_VID.idle} fallback={BUCK.default} size={150} />
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
                style={[styles.card, isActive && styles.cardActive]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.75}
              >
                <View style={styles.flagWrap}>
                  <Image source={lang.flag} style={styles.flagImg} resizeMode="cover" />
                </View>
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
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 28 },

  mascotWrap: { alignItems: 'center', gap: 8 },
  mascot: { width: 150, height: 150 },
  title:    { color: TEXT,  fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { color: MUTED, fontSize: 14 },

  cards: { gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: SURFACE, borderRadius: 16, padding: 14,
    borderWidth: 1.5, borderColor: BORDER,
  },
  cardActive: { borderColor: BRAND, backgroundColor: `${BRAND}0D` },
  flagWrap: { width: 44, height: 44, borderRadius: 10, overflow: 'hidden', backgroundColor: '#1C2C1C' },
  flagImg: { width: 44, height: 44 },
  langName: { flex: 1, color: TEXT, fontSize: 16, fontWeight: '600' },
  langNameActive: { color: BRAND },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: BRAND },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: BRAND },

  btn: {
    borderRadius: 16, paddingVertical: 18, alignItems: 'center',
    backgroundColor: BRAND,
  },
  btnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
});
