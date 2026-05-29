import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const TEXT = '#FFFFFF';
const MUTED = '#555';

interface Props {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: Props) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(btnScale, { toValue: 1.06, duration: 1100, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.8, duration: 1100, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(btnScale, { toValue: 1, duration: 1100, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.4, duration: 1100, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  const handleStart = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // TODO: Play start sound here
    onStart();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.content, { opacity: fadeIn }]}>
        {/* Logo placeholder — replace with real logo later */}
        <View style={styles.logoWrapper}>
          <Animated.View style={[styles.logoGlow, { opacity: glowOpacity }]} />
          <View style={styles.logo}>
            <Text style={styles.logoText}>MM</Text>
          </View>
        </View>

        <Text style={styles.appName}>MarketMind</Text>
        <Text style={styles.tagline}>Daily Finance Quiz</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <Animated.View style={[styles.btnGlow, { opacity: glowOpacity }]} />
          <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.9}>
            <Text style={styles.startBtnText}>START</Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.hint}>Tap to begin your journey</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: BRAND,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 26,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
  },
  logoText: {
    color: '#000',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  appName: {
    color: TEXT,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  tagline: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 52,
    alignItems: 'center',
    gap: 14,
  },
  btnGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 28,
    backgroundColor: BRAND,
  },
  startBtn: {
    backgroundColor: BRAND,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 80,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 14,
  },
  startBtnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  hint: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '400',
  },
});
