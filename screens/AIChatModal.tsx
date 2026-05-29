import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Animated, Modal, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { IMAGES } from '../utils/imageAssets';

const BRAND = '#10B981';
const BG = '#0A0A0A';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';

// ─── Large knowledge base — no API key needed ────────────────────────────────
const KB: { keywords: string[]; answer: string }[] = [
  // Basics
  { keywords: ['what is investing', 'was ist investieren', 'start investing', 'anfangen', 'how to invest', 'wie investiere'],
    answer: "Investing means putting money to work so it grows over time. You can invest in stocks, bonds, ETFs, real estate, or crypto.\n\n**Key takeaway:** Start with a simple S&P 500 ETF. You can begin with as little as €10–50/month via platforms like Trade Republic or Scalable Capital." },
  { keywords: ['stock', 'aktie', 'share', 'equity', 'was ist eine aktie'],
    answer: "A stock is an ownership share in a company. Buy 1 Apple share = own a tiny piece of Apple. You profit when the company grows or pays dividends.\n\n**Key takeaway:** Stocks historically return ~10%/year (S&P 500 average), beating inflation over the long run." },
  { keywords: ['etf', 'index fund', 'indexfonds', 'was ist ein etf'],
    answer: "An ETF holds many assets (like all 500 S&P 500 companies) in one trade. Low fees (~0.07%/year), instant diversification, very liquid.\n\n**Key takeaway:** Buffett recommends S&P 500 index funds for most investors. 90%+ of active managers underperform them over 20 years." },
  { keywords: ['bond', 'anleihe', 'was ist eine anleihe', 'fixed income'],
    answer: "A bond is a loan you give to a government or company. They pay you fixed interest and return your principal at maturity.\n\n**Key takeaway:** Bonds are safer than stocks but return less. When rates rise, bond prices fall — they move inversely." },
  { keywords: ['dividend', 'dividende', 'dividend yield'],
    answer: "Dividends are cash payments companies make to shareholders, usually quarterly. Dividend yield = Annual dividend ÷ Stock price.\n\n**Key takeaway:** High dividend stocks (3–6% yield) are popular for income investing. Reinvesting dividends compounds returns significantly." },

  // Markets
  { keywords: ['bull market', 'bullish', 'bull'],
    answer: "A bull market = rising prices over a sustained period (20%+ from lows). Historically lasts ~5 years on average.\n\n**Key takeaway:** The S&P 500 has been in a bull market more than 70% of all trading days in history. Long-term bulls win." },
  { keywords: ['bear market', 'bearish', 'bear'],
    answer: "A bear market = 20%+ decline from recent highs. Usually lasts 9–18 months. The 2020 COVID crash was the fastest ever (down 34% in 5 weeks).\n\n**Key takeaway:** Every bear market in history was followed by new all-time highs. Stay invested, don't panic sell." },
  { keywords: ['market cap', 'market capitalization', 'marktkapitalisierung'],
    answer: "Market cap = Share Price × Total Shares Outstanding. Apple at $180/share × 15.4B shares = ~$2.8 trillion market cap.\n\n**Key takeaway:** Market cap classifies companies: Large-cap (>$10B), Mid-cap ($2–10B), Small-cap (<$2B). Larger = more stable, smaller = more volatile." },
  { keywords: ['volatility', 'volatilität', 'vix', 'fear gauge'],
    answer: "Volatility measures how much an asset's price swings. The VIX (fear gauge) tracks expected S&P 500 volatility. VIX >30 = high fear.\n\n**Key takeaway:** High volatility creates both risk AND opportunity. Experienced investors often buy during high-volatility periods." },
  { keywords: ['correction', 'market correction', 'marktkorrektur'],
    answer: "A market correction = 10–20% drop from recent highs. Happens roughly every 2 years. Different from a bear market (>20%).\n\n**Key takeaway:** Corrections are healthy — they reset overheated valuations. The S&P 500 has had 38 corrections since 1950, all recovered." },
  { keywords: ['liquidity', 'liquidität'],
    answer: "Liquidity = how quickly you can convert an asset to cash without moving its price. Cash = 100% liquid. Real estate takes months. Stocks = seconds.\n\n**Key takeaway:** Always hold some liquid assets (emergency fund). Illiquid investments can trap you when you need cash urgently." },

  // Macro & Economics
  { keywords: ['inflation', 'kaufkraft', 'purchasing power', 'cpi'],
    answer: "Inflation = general rise in prices, meaning money buys less. Central banks target ~2% annual inflation as healthy.\n\n**Key takeaway:** $100 in 2000 buys only ~$59 of goods today. Keeping money in cash = guaranteed loss of purchasing power. Invest to beat inflation." },
  { keywords: ['recession', 'rezession', 'economic downturn'],
    answer: "A recession = two consecutive quarters of negative GDP growth. The US has had ~13 recessions since 1945, averaging one every 6 years.\n\n**Key takeaway:** Recessions are temporary and normal. Every recession was followed by recovery. Don't try to time recessions — stay invested." },
  { keywords: ['gdp', 'gross domestic product', 'bruttoinlandsprodukt', 'wirtschaft'],
    answer: "GDP = total value of all goods and services produced in a country per year. US GDP: ~$27 trillion. Measures economic health.\n\n**Key takeaway:** GDP growth >2% = healthy economy. Negative GDP two quarters in a row = recession. Affects stock markets directly." },
  { keywords: ['interest rate', 'zinsen', 'fed', 'federal reserve', 'ecb', 'central bank', 'leitzins'],
    answer: "Central banks (Fed, ECB) set interest rates to control inflation. High rates → expensive borrowing → slower growth. Low rates → cheap borrowing → faster growth.\n\n**Key takeaway:** Markets react to every Fed decision. 'Don't fight the Fed' is Wall Street's oldest rule." },
  { keywords: ['quantitative easing', 'qe', 'money printing', 'gelddrucken'],
    answer: "QE = central bank creates money to buy bonds, injecting liquidity into the economy. The Fed's balance sheet grew from $1T (2008) to $9T (2022) via QE.\n\n**Key takeaway:** QE tends to push up asset prices (stocks, real estate). When QE ends (QT), markets often fall." },
  { keywords: ['yield curve', 'inverted yield', 'zinskurve'],
    answer: "The yield curve shows bond returns across different maturities. Normally long-term > short-term. When inverted (short > long) = recession warning.\n\n**Key takeaway:** An inverted yield curve has preceded every US recession since 1955. It inverted in 2022 — watch for economic slowdown." },

  // Crypto
  { keywords: ['bitcoin', 'btc', '₿', 'was ist bitcoin'],
    answer: "Bitcoin = world's first decentralized digital currency, created in 2009 by anonymous Satoshi Nakamoto. Fixed supply of 21 million coins ever.\n\n**Key takeaway:** Bitcoin's scarcity is its key value proposition. Like digital gold — limited supply, no central control. Major institutional adoption since 2020." },
  { keywords: ['ethereum', 'eth', 'smart contract', 'was ist ethereum'],
    answer: "Ethereum = blockchain platform for programmable smart contracts. Powers DeFi, NFTs, and thousands of decentralized applications.\n\n**Key takeaway:** While Bitcoin is digital gold, Ethereum is more like a global decentralized computer. ETH switched to 'Proof of Stake' in 2022, reducing energy use by 99.9%." },
  { keywords: ['crypto', 'cryptocurrency', 'kryptowährung', 'digital currency'],
    answer: "Cryptocurrency = digital money on decentralized blockchain networks. Bitcoin, Ethereum, and 10,000+ altcoins form a $2+ trillion market.\n\n**Key takeaway:** Crypto is highly volatile — 50-80% crashes are normal. Only invest what you can afford to lose. Stick to BTC and ETH for lower risk." },
  { keywords: ['defi', 'decentralized finance', 'dezentralisierte finanzen'],
    answer: "DeFi = financial services (lending, borrowing, trading) running on blockchain without banks or intermediaries. Total value locked: $50B+.\n\n**Key takeaway:** DeFi earns higher yields than banks but carries smart contract risk (code bugs can lose your funds). Research thoroughly before using." },
  { keywords: ['halving', 'bitcoin halving', 'halbierung'],
    answer: "Bitcoin halving = every ~4 years, the reward for mining new Bitcoin is cut in half. Reduces supply creation. Next halving: ~2028.\n\n**Key takeaway:** The last 3 halvings (2012, 2016, 2020) were each followed by major bull markets within 12–18 months. Not guaranteed but historically significant." },
  { keywords: ['stablecoin', 'usdt', 'usdc', 'tether'],
    answer: "Stablecoins = crypto pegged to $1 (or other currencies). USDT, USDC, BUSD. Used for trading without converting to fiat.\n\n**Key takeaway:** Stablecoins are useful for earning crypto yield (4-8% APY via DeFi platforms) without price volatility risk." },
  { keywords: ['nft', 'non-fungible token'],
    answer: "NFTs = unique digital assets verified on blockchain. Think digital certificates of ownership for art, collectibles, or gaming items.\n\n**Key takeaway:** The 2021 NFT bubble saw most assets lose 90%+ of value. NFT technology has real use cases (gaming, tickets) but speculative art NFTs are very risky." },
  { keywords: ['wallet', 'crypto wallet', 'krypto wallet', 'private key'],
    answer: "A crypto wallet stores your private key — the password to your funds. Hardware wallets (Ledger, Trezor) are most secure for large amounts.\n\n**Key takeaway:** 'Not your keys, not your coins.' Crypto on exchanges can be lost if the exchange goes bankrupt (like FTX in 2022)." },

  // Personal Finance
  { keywords: ['compound interest', 'zinseszins', 'compound', 'rule of 72'],
    answer: "$10,000 at 7% return grows to $76,000 in 30 years — without adding anything. This is compound interest. The Rule of 72: divide 72 by your return rate = years to double (72÷7 = ~10 years).\n\n**Key takeaway:** Start investing at 20 vs 30 → roughly double the final amount at 60. Time is the most powerful force in investing." },
  { keywords: ['budget', 'budgetieren', '50/30/20', 'spending'],
    answer: "The 50/30/20 budget rule: 50% Needs (rent, food), 30% Wants (entertainment, dining), 20% Savings & debt repayment.\n\n**Key takeaway:** Even saving 10% is life-changing over decades. Automate savings so you never 'forget' to invest — set up a standing order." },
  { keywords: ['emergency fund', 'notfonds', 'notrücklage', 'rainy day'],
    answer: "An emergency fund = 3–6 months of expenses in liquid cash savings. Protects against job loss, medical bills, car repairs.\n\n**Key takeaway:** Build your emergency fund BEFORE investing. Without it, any market crash might force you to sell investments at a loss." },
  { keywords: ['debt', 'schulden', 'credit card debt', 'kreditkarte'],
    answer: "Good debt (mortgage, student loans) builds assets or future income. Bad debt (credit card at 20% interest) destroys wealth.\n\n**Key takeaway:** Pay off high-interest debt (>8%) before investing. Guaranteed 20% return by eliminating 20% interest beats most market returns." },
  { keywords: ['passive income', 'passives einkommen', 'financial freedom', 'finanzielle freiheit'],
    answer: "Passive income = money earned without active daily work. Sources: dividends, rental income, interest, royalties, business ownership.\n\n**Key takeaway:** Financial freedom happens when passive income > living expenses. Build multiple passive income streams — don't rely on just one." },
  { keywords: ['net worth', 'vermögen', 'nettovermögen', 'wealth'],
    answer: "Net worth = Total Assets − Total Liabilities. $300K house + $100K investments − $200K mortgage = $200K net worth.\n\n**Key takeaway:** Focus on growing net worth, not just income. A high salary with high spending builds no wealth. A modest income saved consistently creates millions." },

  // Stocks & Analysis
  { keywords: ['pe ratio', 'p/e', 'kgv', 'price to earnings', 'kurs-gewinn'],
    answer: "P/E ratio = Share Price ÷ Annual Earnings Per Share. P/E 20 = you pay 20× the annual profit. S&P 500 averages 15–20 P/E.\n\n**Key takeaway:** High P/E (>30) = investors expect strong future growth. Low P/E (<15) may indicate undervaluation or declining business. Context matters." },
  { keywords: ['eps', 'earnings per share', 'gewinn pro aktie'],
    answer: "EPS = Net Profit ÷ Total Shares Outstanding. Rising EPS = company is growing profitability. One of the most-watched metrics in earnings season.\n\n**Key takeaway:** Consistent EPS growth over 5+ years is a hallmark of quality companies. Look for 10%+ annual EPS growth." },
  { keywords: ['short selling', 'short', 'leerverkauf', 'shorting'],
    answer: "Short selling = borrow shares, sell them, hope price falls, buy back cheaper, pocket the difference. Risk: unlimited losses if stock rises.\n\n**Key takeaway:** Short selling is for experienced traders only. The 2021 GameStop squeeze showed shorts can lose everything. 99% of retail investors should avoid shorting." },
  { keywords: ['value investing', 'value stock', 'warren buffett investing'],
    answer: "Value investing = buying stocks trading below their intrinsic value (what they're actually worth). Buy great businesses at fair prices.\n\n**Key takeaway:** Warren Buffett's approach: find wonderful businesses with competitive advantages, pay a fair price, hold forever. Simple but requires patience." },
  { keywords: ['growth investing', 'growth stock', 'wachstumsinvestment'],
    answer: "Growth investing = buying companies with high revenue/earnings growth, often at high P/E ratios. Think Tesla, Nvidia, early Amazon.\n\n**Key takeaway:** Growth stocks can return 10x in a bull market but crash 70-90% in bear markets. Higher risk, higher potential reward vs. value stocks." },
  { keywords: ['dividend growth', 'dividendenwachstum', 'dividend aristocrat'],
    answer: "Dividend Aristocrats = S&P 500 companies that have increased dividends for 25+ consecutive years. Examples: Coca-Cola, Johnson & Johnson, Procter & Gamble.\n\n**Key takeaway:** Dividend growth investing combines income AND capital appreciation. These companies tend to outperform in bear markets." },

  // Trading
  { keywords: ['technical analysis', 'ta', 'charting', 'chartanalyse'],
    answer: "Technical analysis = using price charts, patterns, and indicators (RSI, MACD, moving averages) to predict future price movements.\n\n**Key takeaway:** Technical analysis works best combined with fundamental analysis. About 70% of professional traders use some form of TA." },
  { keywords: ['support', 'resistance', 'support level', 'widerstand'],
    answer: "Support = price floor where buyers emerge. Resistance = price ceiling where sellers emerge. When price breaks through resistance, it often becomes support.\n\n**Key takeaway:** These levels are self-fulfilling — so many traders watch them that they often hold. Used to identify entry/exit points." },
  { keywords: ['rsi', 'relative strength', 'overbought', 'oversold'],
    answer: "RSI = momentum indicator (0-100). Above 70 = overbought (potential reversal down). Below 30 = oversold (potential reversal up).\n\n**Key takeaway:** RSI extremes signal potential reversals but not guaranteed. Works best combined with other indicators and overall market context." },
  { keywords: ['moving average', 'ma', 'sma', 'ema', 'gleitender durchschnitt'],
    answer: "Moving averages smooth price action. Golden Cross (50-day MA crosses above 200-day MA) = bullish signal. Death Cross = bearish.\n\n**Key takeaway:** MA crossovers are widely watched. The 200-day MA is the most important long-term trend indicator in both stocks and crypto." },
  { keywords: ['stop loss', 'stop-loss', 'risk management'],
    answer: "Stop-loss = automatic sell order triggered when price falls to a set level. Limits downside. Most pros risk 1-2% of portfolio per trade.\n\n**Key takeaway:** Never trade without a stop-loss. 'Let winners run, cut losers short' is the #1 rule of successful traders." },
  { keywords: ['risk reward', 'risk/reward', 'r:r ratio'],
    answer: "Risk:Reward ratio = how much you risk vs. how much you aim to gain. 1:3 R:R = risk $100 to potentially make $300.\n\n**Key takeaway:** Professional traders typically require at least 1:2 R:R before entering a trade. Positive expectancy over many trades = profitability." },

  // Advanced
  { keywords: ['options', 'call option', 'put option', 'derivate', 'derivative'],
    answer: "Options = rights to buy (call) or sell (put) assets at a fixed price before expiry. Leverage instruments — can gain 500% or lose 100% in days.\n\n**Key takeaway:** Options require deep understanding before trading. Start with paper trading. They're tools for hedging AND speculation — know the difference." },
  { keywords: ['hedge fund', 'hedgefonds'],
    answer: "Hedge funds = private investment vehicles using complex strategies (leverage, shorts, derivatives) for wealthy investors. Minimum investment: $1M+.\n\n**Key takeaway:** Despite high fees (2% management + 20% profits), most hedge funds underperform a simple index fund over 10+ years. Buffett proved this with his famous bet." },
  { keywords: ['leverage', 'hebel', 'margin', 'leveraged'],
    answer: "Leverage = using borrowed money to amplify gains (and losses). 10× leverage: if stock rises 10%, you gain 100%. If it falls 10%, you lose 100%.\n\n**Key takeaway:** Most retail traders who use high leverage eventually blow up their accounts. Start with no leverage until you have a proven profitable strategy." },
  { keywords: ['diversification', 'diversifikation', 'portfolio'],
    answer: "Diversification = spreading investments to reduce risk. Different assets, sectors, countries, and sizes. The only 'free lunch' in investing.\n\n**Key takeaway:** A globally diversified portfolio (stocks + bonds + real estate + some cash) smooths returns dramatically vs. single-asset investing." },
  { keywords: ['dollar cost averaging', 'dca', 'sparplan', 'monthly investing'],
    answer: "DCA = investing a fixed amount regularly (e.g., €200/month) regardless of price. Removes emotion, averages your cost over time.\n\n**Key takeaway:** DCA into a global ETF for 20+ years has beaten 80%+ of professional investors historically. Boring but extremely effective." },
  { keywords: ['rebalancing', 'portfolio rebalancing', 'rebalancierung'],
    answer: "Rebalancing = restoring your target asset allocation by selling winners and buying underperformers. Usually done quarterly or annually.\n\n**Key takeaway:** Annual rebalancing forces you to 'buy low, sell high' systematically. Shown to improve risk-adjusted returns by ~0.5-1% per year." },

  // Real Estate
  { keywords: ['real estate', 'immobilien', 'property', 'reit'],
    answer: "Real estate investing: direct property ownership (rental income + appreciation) OR REITs (real estate trusts that trade like stocks, pay 3-6% dividends).\n\n**Key takeaway:** Real estate has built more generational wealth than almost any other asset class. But it requires capital, management, and is illiquid." },

  // Famous investors
  { keywords: ['warren buffett', 'buffett', 'berkshire'],
    answer: "Warren Buffett built Berkshire Hathaway ($900B+) by buying great businesses at fair prices and holding forever. Started investing at age 11, first million at 30.\n\n**Key takeaway:** Buffett's advice: buy S&P 500 index funds, live below your means, never invest in what you don't understand, be fearful when others are greedy." },
  { keywords: ['peter lynch', 'magellan fund', 'lynch'],
    answer: "Peter Lynch ran the Magellan Fund (1977-1990) achieving 29.2% annual returns — the best 20-year run in mutual fund history. Philosophy: invest in what you know.\n\n**Key takeaway:** Lynch said ordinary people have an edge over Wall Street — you see consumer trends before analysts notice. Watch what people around you are buying and using." },
  { keywords: ['ray dalio', 'dalio', 'bridgewater', 'all weather'],
    answer: "Ray Dalio founded Bridgewater (largest hedge fund, $150B AUM). Created the 'All Weather Portfolio': 30% stocks, 40% long bonds, 15% intermediate bonds, 7.5% gold, 7.5% commodities.\n\n**Key takeaway:** Dalio's All Weather Portfolio survived every crisis since 1925 with lower volatility than stocks alone. Consider it for capital preservation." },

  // Market mechanics
  { keywords: ['bid ask spread', 'spread', 'bid', 'ask'],
    answer: "Bid = highest price buyers will pay. Ask = lowest price sellers will accept. Spread = difference. Liquid stocks have tiny spreads (pennies). Illiquid assets: huge spreads.\n\n**Key takeaway:** Always use limit orders (not market orders) for less liquid assets. Market orders on small-cap stocks can cost you 1-3% immediately." },
  { keywords: ['market maker', 'liquidity provider'],
    answer: "Market makers = firms that always offer to buy AND sell securities, providing liquidity. They profit from the bid-ask spread.\n\n**Key takeaway:** Market makers ensure you can always buy or sell stocks instantly. Without them, trading would be much slower and spreads far wider." },
  { keywords: ['ipo', 'initial public offering', 'börsengang', 'going public'],
    answer: "IPO = when a private company sells shares to the public for the first time. Founders and early investors cash out. Average first-day IPO return: ~18%.\n\n**Key takeaway:** Most IPOs underperform the market 3 years later. The best investments were often made in early private rounds — Uber, Airbnb, etc. were better private." },

  // How to learn
  { keywords: ['how to learn finance', 'finance education', 'learn investing', 'finanz lernen'],
    answer: "Best ways to learn finance: 1) Daily practice (like MarketMind!), 2) Read: 'The Intelligent Investor' (Buffett), 'Rich Dad Poor Dad' (Kiyosaki), 3) Follow: CNBC, Bloomberg, FT.\n\n**Key takeaway:** The best financial education is consistent daily learning + real investing experience. Even small investments teach more than any book." },

  // Fallback
  { keywords: ['help', 'hilfe', 'what can you do', 'was kannst du'],
    answer: "I can explain finance and investing topics: stocks, ETFs, crypto, bonds, trading strategies, economic concepts, famous investors, and more.\n\n**Key takeaway:** Just ask me anything about finance! Try: 'What is Bitcoin?', 'How does compound interest work?', 'What is a bull market?'" },
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const entry of KB) {
    if (entry.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return entry.answer;
    }
  }
  return "Great question! Finance is a broad topic. I can explain stocks, ETFs, crypto, bonds, trading, personal finance, and economic concepts in detail.\n\n**Key takeaway:** Try asking something specific like: 'What is compound interest?', 'How do ETFs work?', or 'What is the P/E ratio?'";
}

const SUGGESTED = [
  'What is Bitcoin?',
  'How do I start investing?',
  'What is an ETF?',
  'How does compound interest work?',
  'What is a bull market?',
  'What caused the 2008 crisis?',
];

interface Message { id: string; role: 'user' | 'assistant'; content: string }

function TypingDots() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  useEffect(() => { dots.forEach((d, i) => Animated.loop(Animated.sequence([Animated.delay(i * 180), Animated.timing(d, { toValue: 1, duration: 280, useNativeDriver: true }), Animated.timing(d, { toValue: 0, duration: 280, useNativeDriver: true }), Animated.delay(560)])).start()); }, []);
  return <View style={{ flexDirection: 'row', gap: 4, padding: 2 }}>{dots.map((d, i) => <Animated.View key={i} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: BRAND, opacity: d.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }), transform: [{ translateY: d.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }} />)}</View>;
}

interface Props { visible: boolean; onClose: () => void }

export default function AIChatModal({ visible, onClose }: Props) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const slideY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
    } else {
      Animated.timing(slideY, { toValue: 600, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  useEffect(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text.trim() }]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: findAnswer(text) }]);
    setLoading(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
        <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom, transform: [{ translateY: slideY }] }]}>

          {/* Header */}
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: IMAGES.chartHero }} style={styles.avatarImg} blurRadius={2} />
              <View style={styles.avatarOverlay}><Text style={styles.avatarIcon}>◈</Text></View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiName}>Finance AI</Text>
              <Text style={styles.aiStatus}>● {loading ? 'Thinking…' : '50+ topics covered'}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.75}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
              {messages.length === 0 && (
                <View style={styles.welcome}>
                  <Text style={styles.welcomeTitle}>Ask me anything about finance & markets</Text>
                  <View style={styles.suggestions}>
                    {SUGGESTED.map((q, i) => (
                      <TouchableOpacity key={i} style={styles.suggestion} onPress={() => send(q)} activeOpacity={0.75}>
                        <Text style={styles.sugArrow}>›</Text>
                        <Text style={styles.sugText}>{q}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              {messages.map(m => (
                <View key={m.id} style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
                  <Text style={[styles.bubbleText, m.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAI]}>{m.content}</Text>
                </View>
              ))}
              {loading && <View style={[styles.bubble, styles.bubbleAI, { paddingVertical: 14 }]}><TypingDots /></View>}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Ask about stocks, crypto, investing…" placeholderTextColor={MUTED} multiline maxLength={300} returnKeyType="send" onSubmitEditing={() => send(input)} />
              <TouchableOpacity style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnOff]} onPress={() => send(input)} disabled={!input.trim() || loading} activeOpacity={0.85}>
                <Text style={styles.sendIcon}>↑</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.disclaimer}>Educational only — not financial advice</Text>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  backdropTouch: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: BG, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    height: '88%', borderWidth: 1, borderColor: '#222',
  },
  handle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BORDER },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  avatarImg: { width: 40, height: 40, borderRadius: 20 },
  avatarOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(16,185,129,0.45)', alignItems: 'center', justifyContent: 'center' },
  avatarIcon: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  aiName: { color: TEXT, fontSize: 15, fontWeight: '700' },
  aiStatus: { color: BRAND, fontSize: 11 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: SURFACE, alignItems: 'center', justifyContent: 'center' },
  closeIcon: { color: MUTED, fontSize: 13, fontWeight: '700' },
  messages: { flex: 1 },
  messagesContent: { padding: 14, gap: 10, paddingBottom: 8 },
  welcome: { gap: 12 },
  welcomeTitle: { color: MUTED, fontSize: 13, textAlign: 'center', lineHeight: 19, paddingVertical: 8 },
  suggestions: { gap: 7 },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: SURFACE, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: BORDER },
  sugArrow: { color: BRAND, fontSize: 16, fontWeight: '800' },
  sugText: { color: TEXT, fontSize: 14, flex: 1 },
  bubble: { maxWidth: '83%', borderRadius: 18, paddingHorizontal: 13, paddingVertical: 10 },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: BRAND, borderBottomRightRadius: 4 },
  bubbleAI: { alignSelf: 'flex-start', backgroundColor: SURFACE, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: BORDER },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  bubbleTextUser: { color: '#000', fontWeight: '500' },
  bubbleTextAI: { color: TEXT },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 4, borderTopWidth: 1, borderTopColor: BORDER },
  input: { flex: 1, backgroundColor: SURFACE, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 11, color: TEXT, fontSize: 14, maxHeight: 90, borderWidth: 1, borderColor: BORDER },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center' },
  sendBtnOff: { backgroundColor: SURFACE },
  sendIcon: { color: '#000', fontSize: 19, fontWeight: '900' },
  disclaimer: { color: '#333', fontSize: 10, textAlign: 'center', paddingBottom: 6 },
});
