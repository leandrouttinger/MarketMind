import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Linking, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';
import { BACKGROUNDS, CAT_BG } from '../utils/imageAssets';

const NEWS_CACHE_KEY = 'news_cache';
const NEWS_DATE_KEY = 'news_cache_date';

const BG = '#0A0A0A';
const SURFACE = '#141414';
const CARD = '#1A1A1A';
const BORDER = '#242424';
const TEXT = '#F0F0F0';
const MUTED = '#777';
const BRAND = '#10B981';
const UP = '#22C55E';
const DOWN = '#EF4444';

// Multiple RSS sources — tries each in order until one works
const RSS_SOURCES = [
  'https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US',
  'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  'https://feeds.reuters.com/reuters/businessNews',
].map(url => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=20`);

interface NewsItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
  category?: string;
  imageUrl?: string;
}

interface MarketPrice {
  symbol: string;
  name: string;
  price: string;
  change: string;
  up: boolean;
}

const MOCK_MARKETS: MarketPrice[] = [
  { symbol: 'SPX', name: 'S&P 500', price: '5,304', change: '+0.34%', up: true },
  { symbol: 'NDX', name: 'Nasdaq', price: '18,671', change: '+0.51%', up: true },
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,420', change: '+2.1%', up: true },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,180', change: '+1.4%', up: true },
  { symbol: 'EURUSD', name: 'EUR/USD', price: '1.0832', change: '-0.12%', up: false },
  { symbol: 'GLD', name: 'Gold', price: '$2,341', change: '+0.8%', up: true },
];

// No fake news fallback — we show an empty state instead of fabricated articles
const FALLBACK: NewsItem[] = [];

const CATEGORIES = ['All', 'Markets', 'Crypto', 'Macro', 'Stocks', 'Tech', 'Global', 'Commodities'];
const CAT_COLORS: Record<string, string> = {
  Markets: '#10B981', Crypto: '#F97316', Macro: '#60A5FA',
  Stocks: '#EC4899', Tech: '#8B5CF6', Global: '#06B6D4',
  Commodities: '#F59E0B', All: '#10B981',
};

function openArticle(url: string) {
  const clean = url?.trim();
  if (clean && clean.startsWith('http')) {
    Linking.openURL(clean);
  } else {
    Linking.openURL('https://finance.yahoo.com');
  }
}

function timeAgo(str: string) {
  const diff = Date.now() - new Date(str).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NewsScreen() {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => { loadNews(); }, []);

  const todayStr = () => new Date().toISOString().slice(0, 10);

  const loadNews = async () => {
    setLoading(true);
    try {
      const cachedDate = await AsyncStorage.getItem(NEWS_DATE_KEY);
      if (cachedDate === todayStr()) {
        const cached = await AsyncStorage.getItem(NEWS_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.length > 0) { setNews(parsed); setLoading(false); return; }
        }
      }
      await fetchNews();
    } catch {
      await fetchNews();
    }
  };

  const fetchNews = async () => {
    for (const apiUrl of RSS_SOURCES) {
      try {
        const res = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } });
        const data = await res.json();
        if (data.status === 'ok' && data.items?.length > 0) {
          const items: NewsItem[] = data.items.slice(0, 15).map((item: any) => ({
            title: item.title,
            description: (item.description ?? '').replace(/<[^>]*>/g, '').slice(0, 160),
            pubDate: item.pubDate,
            link: item.link,
            category: item.categories?.[0] ?? 'Markets',
            imageUrl: item.thumbnail || item.enclosure?.link || null,
          }));
          setNews(items);
          await AsyncStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(items));
          await AsyncStorage.setItem(NEWS_DATE_KEY, todayStr());
          setLoading(false);
          return;
        }
      } catch {
        // try next source
      }
    }
    setNews([]);
    setLoading(false);
  };

  const filtered = activeCategory === 'All' ? news : news.filter(n => n.category === activeCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>MarketMind</Text>
          <Text style={styles.headerSub}>Markets & Finance</Text>
        </View>
        <TouchableOpacity style={styles.liveTag} onPress={async () => { await AsyncStorage.removeItem(NEWS_DATE_KEY); await fetchNews(); }}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>

        {/* Market Ticker */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ticker}>
          {MOCK_MARKETS.map((m) => (
            <View key={m.symbol} style={styles.tickerItem}>
              <Text style={styles.tickerSymbol}>{m.symbol}</Text>
              <Text style={styles.tickerPrice}>{m.price}</Text>
              <Text style={[styles.tickerChange, { color: m.up ? UP : DOWN }]}>
                {m.change}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Category Filter (sticky) */}
        <View style={styles.filterWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterPill, activeCategory === cat && styles.filterPillActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={BRAND} />
          </View>
        ) : (
          <View style={styles.newsBody}>
            {filtered.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No live news available right now.</Text>
                <TouchableOpacity onPress={() => { AsyncStorage.removeItem(NEWS_DATE_KEY); fetchNews(); }} style={styles.retryBtn}>
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Hero story */}
            {filtered[0] && (
              <TouchableOpacity style={styles.heroCard} onPress={() => openArticle(filtered[0].link)} activeOpacity={0.85}>
                {filtered[0].imageUrl
                  ? <Image source={{ uri: filtered[0].imageUrl }} style={styles.heroImage} />
                  : <Image source={CAT_BG[filtered[0].category ?? 'Markets'] ?? BACKGROUNDS.bullMarket} style={styles.heroImage} />
                }
                <View style={styles.heroContent}>
                  <View style={styles.heroCatRow}>
                    <View style={[styles.catTag, { backgroundColor: CAT_COLORS[filtered[0].category ?? 'Markets'] ?? BRAND }]}>
                      <Text style={styles.catTagText}>{filtered[0].category ?? 'Markets'}</Text>
                    </View>
                    <Text style={styles.heroTime}>{timeAgo(filtered[0].pubDate)}</Text>
                  </View>
                  <Text style={styles.heroTitle} numberOfLines={3}>{filtered[0].title}</Text>
                  <Text style={styles.heroDesc} numberOfLines={2}>{filtered[0].description}</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Section label */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>Latest Stories</Text>
              <View style={styles.sectionLine} />
            </View>

            {/* Two-column grid for next 4 */}
            {filtered.length > 1 && (
              <View style={styles.grid}>
                {filtered.slice(1, 5).map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.gridCard}
                    onPress={() => openArticle(item.link)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.gridCatBar, { backgroundColor: CAT_COLORS[item.category ?? 'Markets'] ?? BRAND }]} />
                    <Text style={styles.gridTitle} numberOfLines={3}>{item.title}</Text>
                    <Text style={styles.gridTime}>{timeAgo(item.pubDate)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Section label */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>More News</Text>
              <View style={styles.sectionLine} />
            </View>

            {/* Compact list */}
            {filtered.slice(5).map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.listItem, i < filtered.length - 6 && styles.listItemBorder]}
                onPress={() => openArticle(item.link)}
                activeOpacity={0.75}
              >
                <View style={[styles.listCatDot, { backgroundColor: CAT_COLORS[item.category ?? 'Markets'] ?? BRAND }]} />
                <View style={styles.listContent}>
                  <Text style={styles.listTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.listFooter}>
                    <Text style={[styles.listCat, { color: CAT_COLORS[item.category ?? 'Markets'] ?? BRAND }]}>
                      {item.category ?? 'Markets'}
                    </Text>
                    <Text style={styles.listTime}>{timeAgo(item.pubDate)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Economic calendar teaser */}
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>Economic Calendar</Text>
                <Text style={styles.calendarSub}>Key events this week</Text>
              </View>
              {[
                { time: 'Thu 14:30', currency: 'USD', impact: 'HIGH', event: 'CPI y/y', forecast: '3.4%', prev: '3.5%' },
                { time: 'Thu 14:30', currency: 'USD', impact: 'HIGH', event: 'Core CPI m/m', forecast: '0.3%', prev: '0.4%' },
                { time: 'Fri 14:30', currency: 'USD', impact: 'MED', event: 'Retail Sales m/m', forecast: '0.4%', prev: '-0.6%' },
                { time: 'Fri 16:00', currency: 'EUR', impact: 'MED', event: 'Consumer Confidence', forecast: '-11', prev: '-12.8' },
              ].map((ev, i) => (
                <View key={i} style={[styles.calRow, i < 3 && styles.calRowBorder]}>
                  <Text style={styles.calTime}>{ev.time}</Text>
                  <View style={[styles.impactDot, { backgroundColor: ev.impact === 'HIGH' ? DOWN : '#F59E0B' }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.calEvent}>{ev.event}</Text>
                    <Text style={styles.calCurrency}>{ev.currency}</Text>
                  </View>
                  <View style={styles.calNumbers}>
                    <Text style={styles.calForecast}>{ev.forecast}</Text>
                    <Text style={styles.calPrev}>{ev.prev}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  headerTitle: { color: TEXT, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { color: MUTED, fontSize: 11, marginTop: 1 },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: `${UP}18`, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: `${UP}30` },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: UP },
  liveText: { color: UP, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  ticker: { paddingHorizontal: 12, paddingVertical: 10, gap: 4 },
  tickerItem: { backgroundColor: SURFACE, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', gap: 2, marginRight: 6, borderWidth: 1, borderColor: BORDER, minWidth: 72 },
  tickerSymbol: { color: MUTED, fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  tickerPrice: { color: TEXT, fontSize: 12, fontWeight: '700' },
  tickerChange: { fontSize: 11, fontWeight: '600' },

  filterWrap: { backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER },
  filters: { paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  filterPill: { borderRadius: 99, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: BORDER, backgroundColor: SURFACE },
  filterPillActive: { backgroundColor: BRAND, borderColor: BRAND },
  filterText: { color: MUTED, fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#000', fontWeight: '700' },

  loadingBox: { padding: 40, alignItems: 'center' },
  emptyBox: { padding: 40, alignItems: 'center', gap: 16 },
  emptyText: { color: MUTED, fontSize: 14, textAlign: 'center' },
  retryBtn: { backgroundColor: BRAND, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  retryBtnText: { color: '#000', fontWeight: '700', fontSize: 14 },

  newsBody: { padding: 12, gap: 14, paddingBottom: 120 },

  heroCard: { backgroundColor: CARD, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: BORDER },
  heroImage: { width: '100%', height: 180, resizeMode: 'cover' },
  heroContent: { padding: 14, gap: 8 },
  heroCatRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catTag: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  catTagText: { color: '#000', fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  heroTime: { color: MUTED, fontSize: 11 },
  heroTitle: { color: TEXT, fontSize: 17, fontWeight: '700', lineHeight: 23 },
  heroDesc: { color: MUTED, fontSize: 13, lineHeight: 18 },

  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionLabel: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  sectionLine: { flex: 1, height: 1, backgroundColor: BORDER },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridCard: { width: '48.5%', backgroundColor: CARD, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: BORDER, gap: 6, overflow: 'hidden' },
  gridCatBar: { height: 2, borderRadius: 1, marginBottom: 4 },
  gridTitle: { color: TEXT, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  gridTime: { color: MUTED, fontSize: 10 },

  listItem: { flexDirection: 'row', paddingVertical: 12, gap: 12, alignItems: 'flex-start' },
  listItemBorder: { borderBottomWidth: 1, borderBottomColor: BORDER },
  listCatDot: { width: 3, borderRadius: 2, alignSelf: 'stretch', minHeight: 32, marginTop: 2 },
  listContent: { flex: 1, gap: 5 },
  listTitle: { color: TEXT, fontSize: 14, fontWeight: '600', lineHeight: 19 },
  listFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  listCat: { fontSize: 11, fontWeight: '700' },
  listTime: { color: MUTED, fontSize: 11 },

  calendarCard: { backgroundColor: CARD, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: BORDER },
  calendarHeader: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BORDER },
  calendarTitle: { color: TEXT, fontSize: 14, fontWeight: '700' },
  calendarSub: { color: MUTED, fontSize: 11 },
  calRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11, gap: 10 },
  calRowBorder: { borderBottomWidth: 1, borderBottomColor: BORDER },
  calTime: { color: MUTED, fontSize: 11, width: 52 },
  impactDot: { width: 8, height: 8, borderRadius: 4 },
  calEvent: { color: TEXT, fontSize: 13, fontWeight: '500' },
  calCurrency: { color: MUTED, fontSize: 10, marginTop: 1 },
  calNumbers: { alignItems: 'flex-end', gap: 2 },
  calForecast: { color: TEXT, fontSize: 12, fontWeight: '600' },
  calPrev: { color: MUTED, fontSize: 11 },
});
