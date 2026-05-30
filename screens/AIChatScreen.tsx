import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Animated, Image, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';
import { IMAGES, BACKGROUNDS, BUCK, BUCK_VID } from '../utils/imageAssets';
import MascotVideo from '../components/MascotVideo';

// ─── Supabase Edge Function URL ───────────────────────────────────────────────
// Nach dem Deployen der Edge Function hier die URL eintragen:
// Format: https://<project-id>.supabase.co/functions/v1/ask-ai
const AI_EDGE_FUNCTION_URL = 'https://evmznabsffecwmwfcitc.supabase.co/functions/v1/ask-ai';

const PREMIUM_KEY = 'is_premium';

const SUPPORT_EMAIL = 'bommbeach6@gmail.com';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';

// Smart local knowledge base — works on web without any API
const FINANCE_KB: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['bitcoin', 'btc', '₿'],
    answer: "Bitcoin is the world's first decentralized digital currency, created in 2009 by the anonymous Satoshi Nakamoto. It has a fixed supply of 21 million coins and runs on a peer-to-peer blockchain network without any central authority.\n\n**Key takeaway:** Bitcoin's scarcity model (like digital gold) is why many see it as a hedge against inflation.",
  },
  {
    keywords: ['ethereum', 'eth', 'smart contract'],
    answer: "Ethereum is a blockchain platform that introduced programmable smart contracts — self-executing code that runs automatically when conditions are met. It powers DeFi, NFTs, and thousands of decentralized apps.\n\n**Key takeaway:** While Bitcoin is digital gold, Ethereum is more like a global decentralized computer.",
  },
  {
    keywords: ['stock', 'aktie', 'share', 'equity'],
    answer: "A stock represents ownership in a company. When you buy 1 share of Apple, you own a tiny piece of Apple Inc. and benefit from its growth through price appreciation and dividends.\n\n**Key takeaway:** Stocks historically return ~10% per year (S&P 500 average), beating inflation over the long run.",
  },
  {
    keywords: ['etf', 'index fund', 'indexfonds'],
    answer: "An ETF (Exchange-Traded Fund) holds a basket of assets — like all 500 companies in the S&P 500 — and trades like a single stock. Low fees, instant diversification.\n\n**Key takeaway:** Warren Buffett recommends S&P 500 index funds for most investors. 90%+ of active managers underperform them over 20 years.",
  },
  {
    keywords: ['inflation', 'kaufkraft', 'purchasing power'],
    answer: "Inflation is the general rise in prices over time, meaning your money buys less. Central banks target ~2% annual inflation as healthy. Above 5% erodes savings significantly.\n\n**Key takeaway:** $100 in 2000 buys only ~$59 worth of goods today. Keeping money in cash means losing to inflation.",
  },
  {
    keywords: ['compound interest', 'zinseszins', 'compound'],
    answer: "Compound interest means earning interest on your interest. $10,000 at 7% annual return grows to $76,000 in 30 years without adding anything extra.\n\n**Key takeaway:** Start investing early. Time is your most powerful asset. 10 years earlier = roughly double the final result.",
  },
  {
    keywords: ['pe ratio', 'p/e', 'price to earnings', 'kgv'],
    answer: "The P/E ratio shows how much investors pay per $1 of a company's annual earnings. P/E 20 = you're paying 20× the annual profit. The S&P 500 averages P/E 15–20.\n\n**Key takeaway:** High P/E = high growth expectations. Low P/E = potentially undervalued or declining business.",
  },
  {
    keywords: ['diversification', 'diversifikation', 'portfolio'],
    answer: "Diversification means spreading investments across different assets, sectors, and regions to reduce risk. If one sector crashes, others may offset the loss.\n\n**Key takeaway:** Never put all eggs in one basket. A global ETF gives instant diversification across 1,500+ companies.",
  },
  {
    keywords: ['bull market', 'bullish', 'bull'],
    answer: "A bull market means prices are rising over a sustained period (20%+ gains from lows). Bull markets historically last ~5 years on average.\n\n**Key takeaway:** The S&P 500 has been in a bull market more than 70% of all trading days in history. Bulls win long-term.",
  },
  {
    keywords: ['bear market', 'bearish', 'bear'],
    answer: "A bear market is a 20%+ decline from recent highs. They typically last 9–18 months. The 2020 COVID crash was the fastest bear market in history (down 34% in 5 weeks).\n\n**Key takeaway:** Bear markets are temporary. Every bear market in history has been followed by new all-time highs.",
  },
  {
    keywords: ['hedge fund', 'hedgefonds'],
    answer: "Hedge funds are private investment vehicles for wealthy investors. They use complex strategies — leverage, short selling, derivatives — to generate returns regardless of market direction.\n\n**Key takeaway:** Despite high fees, most hedge funds underperform a simple S&P 500 index fund over 10+ years.",
  },
  {
    keywords: ['short', 'short selling', 'short sell', 'leerverkauf'],
    answer: "Short selling means borrowing shares and selling them, hoping to buy back cheaper and profit from the price drop. If wrong, losses are theoretically unlimited.\n\n**Key takeaway:** Short selling is for experienced investors only. The GameStop squeeze in 2021 showed how dangerous shorting can be.",
  },
  {
    keywords: ['option', 'call option', 'put option', 'derivatives'],
    answer: "Options give you the right (not obligation) to buy (call) or sell (put) an asset at a fixed price before expiry. Calls profit from rising prices, puts from falling.\n\n**Key takeaway:** Options are leverage instruments. You can gain 500% — or lose 100% of your investment in days.",
  },
  {
    keywords: ['interest rate', 'zinsen', 'fed', 'federal reserve', 'ecb', 'central bank'],
    answer: "Central banks (Fed, ECB) set interest rates to control inflation and growth. High rates → expensive borrowing → slower economy. Low rates → cheap borrowing → faster growth.\n\n**Key takeaway:** Every market reacts to Fed decisions. 'Don't fight the Fed' is one of the oldest Wall Street rules.",
  },
  {
    keywords: ['recession', 'rezession'],
    answer: "A recession is two consecutive quarters of negative GDP growth. The US has had ~13 recessions since 1945, averaging about one every 6 years.\n\n**Key takeaway:** Recessions are normal and temporary. The best strategy: stay invested, keep contributing, don't panic sell.",
  },
  {
    keywords: ['how much money', 'wieviel geld', 'start investing', 'anfangen', 'minimum'],
    answer: "You can start investing with as little as $1–10 using fractional share platforms like Trade Republic, Scalable Capital, or Robinhood. You don't need to be rich to invest.\n\n**Key takeaway:** The amount matters less than starting early. $100/month for 30 years at 7% = $121,000. Time beats amount.",
  },
  {
    keywords: ['warren buffett', 'buffett'],
    answer: "Warren Buffett, the 'Oracle of Omaha,' built Berkshire Hathaway into a $900B+ empire by buying great companies at fair prices and holding them forever. He started investing at age 11.\n\n**Key takeaway:** Buffett's famous advice: 'Buy index funds.' Even he admits most people can't beat the market.",
  },
  {
    keywords: ['crypto', 'cryptocurrency', 'kryptowährung'],
    answer: "Cryptocurrency is digital money running on decentralized blockchain networks. Bitcoin, Ethereum, and thousands of 'altcoins' make up a $2+ trillion market.\n\n**Key takeaway:** Crypto is highly volatile. Only invest money you can afford to lose. Diversify — don't go all-in on any single coin.",
  },
  {
    keywords: ['reit', 'real estate', 'immobilien'],
    answer: "REITs (Real Estate Investment Trusts) let you invest in real estate without buying property. They trade like stocks and must pay 90% of income as dividends.\n\n**Key takeaway:** REITs offer real estate exposure with stock market liquidity. Average dividend yield: 3–6% annually.",
  },
  {
    keywords: ['dollar cost averaging', 'dca', 'sparplan'],
    answer: "Dollar-cost averaging means investing a fixed amount regularly (e.g., €200/month) regardless of market price. You buy more when cheap, less when expensive.\n\n**Key takeaway:** DCA removes emotion from investing. Most long-term wealth is built through consistent monthly investing, not timing the market.",
  },
  {
    keywords: ['what is investing', 'was ist investieren', 'investment'],
    answer: "Investing means putting money to work to generate returns over time. Unlike saving (keeping money in a bank), investing grows wealth through interest, dividends, and price appreciation.\n\n**Key takeaway:** The goal of investing is to make your money work for you while you sleep. Start early, stay consistent.",
  },
];

const SUGGESTED = [
  'What is Bitcoin?',
  'How do I start investing?',
  'What is compound interest?',
  'What causes inflation?',
  'What is the S&P 500?',
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  outOfScope?: boolean;
  originalQuestion?: string;
}

function findLocalAnswer(input: string): string | null {
  const lower = input.toLowerCase();
  for (const entry of FINANCE_KB) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return null;
}

function TypingDots() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  useEffect(() => {
    dots.forEach((d, i) => Animated.loop(Animated.sequence([
      Animated.delay(i * 200),
      Animated.timing(d, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(d, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.delay(600),
    ])).start());
  }, []);
  return (
    <View style={{ flexDirection: 'row', gap: 4, padding: 2 }}>
      {dots.map((d, i) => (
        <Animated.View key={i} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: BRAND, opacity: d.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }), transform: [{ translateY: d.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }} />
      ))}
    </View>
  );
}

function openSupport(question: string) {
  const subject = encodeURIComponent('MarketMind Support Question');
  const body = encodeURIComponent(`Hi,\n\nI had a question that MarketMind couldn't answer:\n\n"${question}"\n\nCould you help me?\n\nThanks!`);
  Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
}

export default function AIChatScreen() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    AsyncStorage.getItem(PREMIUM_KEY).then(v => setIsPremium(v === 'true'));
  }, []);

  useEffect(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(AI_EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history: messages.slice(-6) }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply }]);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        throw new Error('API error');
      }
    } catch {
      const localAnswer = findLocalAnswer(text);
      if (localAnswer) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: localAnswer }]);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "That question is outside my Finance knowledge base. I can answer topics like stocks, ETFs, Bitcoin, inflation, compound interest, and more.\n\nFor other questions, you can send a support message and I'll get back to you personally.",
          outOfScope: true,
          originalQuestion: text.trim(),
        }]);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Image source={BACKGROUNDS.tradingRoom} style={styles.avatarBg} blurRadius={6} />
            <Image source={BUCK.default} style={styles.avatarMascot} />
          </View>
          <View>
            <Text style={styles.aiName}>{t('aiTitle')}</Text>
            <Text style={styles.aiStatus}>● Premium only</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerBadge}>Finance AI</Text>
          </View>
        </View>
        <View style={styles.gateWrap}>
          <MascotVideo video={BUCK_VID.idle} fallback={BUCK.default} size={120} />
          <View style={styles.gateBadge}>
            <Text style={styles.gateBadgeText}>PRO</Text>
          </View>
          <Text style={styles.gateTitle}>AI Finance Advisor</Text>
          <Text style={styles.gateSub}>
            Ask Buck anything — stocks, crypto, market news, your portfolio strategy. Unlimited real AI answers, only for Premium members.
          </Text>
          <View style={styles.gateFeatures}>
            {['Unlimited questions', 'Real-time market context', 'Personalized advice', 'No topic limits'].map((f, i) => (
              <View key={i} style={styles.gateFeatureRow}>
                <Text style={styles.gateFeatureCheck}>✓</Text>
                <Text style={styles.gateFeatureText}>{f}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.gateBtn}
            activeOpacity={0.85}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              // TODO: RevenueCat purchase flow hier einbauen
              // Für Dev-Testing: temporär auf Premium schalten
              await AsyncStorage.setItem(PREMIUM_KEY, 'true');
              setIsPremium(true);
            }}
          >
            <Text style={styles.gateBtnText}>Upgrade to Premium — 2 CHF/month</Text>
          </TouchableOpacity>
          <Text style={styles.gateNote}>Cancel anytime. No commitments.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Image source={BACKGROUNDS.tradingRoom} style={styles.avatarBg} blurRadius={6} />
          <Image source={BUCK.default} style={styles.avatarMascot} />
        </View>
        <View>
          <Text style={styles.aiName}>{t('aiTitle')}</Text>
          <Text style={styles.aiStatus}>● {loading ? 'Thinking…' : 'Online'}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerBadge}>Finance AI</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>

          {messages.length === 0 && (
            <View style={styles.welcome}>
              <View style={styles.welcomeHeroWrap}>
                <Image source={BACKGROUNDS.tradingRoom} style={styles.welcomeHero} />
                <MascotVideo video={BUCK_VID.idle} fallback={BUCK.default} width={110} height={140} style={styles.welcomeMascot} />
              </View>
              <Text style={styles.welcomeTitle}>{t('aiSubtitle')}</Text>
              <Text style={styles.suggestedLabel}>{t('suggestedQuestions')}</Text>
              <View style={styles.suggestions}>
                {SUGGESTED.map((q, i) => (
                  <TouchableOpacity key={i} style={styles.suggestion} onPress={() => sendMessage(q)} activeOpacity={0.75}>
                    <Text style={styles.suggestionArrow}>›</Text>
                    <Text style={styles.suggestionText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map(msg => (
            <View key={msg.id} style={msg.role === 'user' ? styles.bubbleUserWrap : styles.bubbleAIWrap}>
              <View style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={[styles.bubbleText, msg.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAI]}>
                  {msg.content}
                </Text>
              </View>
              {msg.outOfScope && msg.originalQuestion && (
                <TouchableOpacity
                  style={styles.supportBtn}
                  onPress={() => openSupport(msg.originalQuestion!)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.supportBtnText}>✉ Contact Support</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {loading && (
            <View style={[styles.bubble, styles.bubbleAI, { paddingVertical: 14 }]}>
              <TypingDots />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input} value={input} onChangeText={setInput}
            placeholder={t('typingPlaceholder')} placeholderTextColor={MUTED}
            multiline maxLength={500} returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnOff]}
            onPress={() => sendMessage(input)} activeOpacity={0.85}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.disclaimer}>{t('aiDisclaimer')}</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  avatarWrap: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', position: 'relative' },
  avatarBg: { width: 44, height: 44, borderRadius: 22 },
  avatarMascot: { position: 'absolute', width: 36, height: 36, bottom: 0, alignSelf: 'center', resizeMode: 'contain' },
  aiName: { color: TEXT, fontSize: 16, fontWeight: '700' },
  aiStatus: { color: BRAND, fontSize: 11, marginTop: 1 },
  headerRight: { flex: 1, alignItems: 'flex-end' },
  headerBadge: { color: BRAND, fontSize: 11, fontWeight: '700', backgroundColor: `${BRAND}18`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: `${BRAND}30` },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 12, paddingBottom: 8 },
  welcome: { gap: 16, paddingTop: 4 },
  welcomeHeroWrap: { width: '100%', height: 160, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  welcomeHero: { width: '100%', height: 160, borderRadius: 16, resizeMode: 'cover' },
  welcomeMascot: { position: 'absolute', bottom: 0, right: 20, width: 110, height: 140, resizeMode: 'contain' },
  welcomeTitle: { color: MUTED, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  suggestedLabel: { color: MUTED, fontSize: 13, fontWeight: '600', marginTop: 4 },
  suggestions: { gap: 8 },
  suggestion: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: SURFACE, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: BORDER,
  },
  suggestionArrow: { color: BRAND, fontSize: 16, fontWeight: '700' },
  suggestionText: { color: TEXT, fontSize: 14, flex: 1 },
  bubbleUserWrap: { alignItems: 'flex-end' },
  bubbleAIWrap: { alignItems: 'flex-start', gap: 8 },
  bubble: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 11 },
  bubbleUser: { backgroundColor: BRAND, borderBottomRightRadius: 4 },
  bubbleAI: { backgroundColor: SURFACE, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: BORDER },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  bubbleTextUser: { color: '#000', fontWeight: '500' },
  bubbleTextAI: { color: TEXT },
  supportBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1C2E27', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: `${BRAND}40`,
  },
  supportBtnText: { color: BRAND, fontSize: 13, fontWeight: '700' },
  inputArea: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4,
    borderTopWidth: 1, borderTopColor: BORDER,
  },
  input: {
    flex: 1, backgroundColor: SURFACE, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 12, color: TEXT,
    fontSize: 15, maxHeight: 100, borderWidth: 1, borderColor: BORDER,
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center' },
  sendBtnOff: { backgroundColor: SURFACE },
  sendIcon: { color: '#000', fontSize: 20, fontWeight: '900' },
  disclaimer: { color: '#3A3A3C', fontSize: 10, textAlign: 'center', paddingHorizontal: 16, paddingBottom: 8 },

  gateWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 28, gap: 16,
  },
  gateMascot: { width: 120, height: 120 },
  gateBadge: {
    backgroundColor: '#F59E0B', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  gateBadgeText: { color: '#000', fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  gateTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', textAlign: 'center', letterSpacing: -0.3 },
  gateSub: { color: '#8E8E93', fontSize: 14, textAlign: 'center', lineHeight: 21 },
  gateFeatures: { width: '100%', gap: 8, paddingHorizontal: 8 },
  gateFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gateFeatureCheck: { color: BRAND, fontSize: 16, fontWeight: '800', width: 20 },
  gateFeatureText: { color: '#FFF', fontSize: 14 },
  gateBtn: {
    width: '100%', backgroundColor: BRAND, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  gateBtnText: { color: '#000', fontSize: 15, fontWeight: '800' },
  gateNote: { color: '#3A3A3C', fontSize: 11, textAlign: 'center' },
});
