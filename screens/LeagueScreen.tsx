import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Share, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BUCK, GRIZ, BUCK_VID, GRIZ_VID, SHARED_VID, ICONS, LEAGUE_BADGES, getMascotVid, getMascotImg } from '../utils/imageAssets';
import MascotVideo from '../components/MascotVideo';
import { Faction } from './FactionScreen';

const BRAND = '#10B981';
const BG = '#0F0F0F';
const SURFACE = '#1C1C1E';
const BORDER = '#2C2C2E';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';
const GOLD = '#F59E0B';

const LEAGUES = [
  { name: 'Iron',     symbol: 'Fe', color: '#6B7280', minXP: 0    },
  { name: 'Bronze',   symbol: 'Br', color: '#CD7F32', minXP: 100  },
  { name: 'Silver',   symbol: 'Ag', color: '#9CA3AF', minXP: 250  },
  { name: 'Gold',     symbol: 'Au', color: GOLD,      minXP: 500  },
  { name: 'Emerald',  symbol: 'Em', color: '#10B981', minXP: 1000 },
  { name: 'Sapphire', symbol: 'Sa', color: '#60A5FA', minXP: 2000 },
  { name: 'Platinum', symbol: 'Pt', color: '#E2E8F0', minXP: 3500 },
  { name: 'Obsidian', symbol: 'Ob', color: '#7C3AED', minXP: 5000 },
];

const FAKE_LEADERBOARD = [
  { name: 'Felix M.',  xp: 340, flag: 'DE', streak: 14, faction: 'bull' as Faction },
  { name: 'Sarah K.',  xp: 310, flag: 'CH', streak: 11, faction: 'bear' as Faction },
  { name: 'Luca R.',   xp: 295, flag: 'IT', streak: 9,  faction: 'bull' as Faction },
  { name: 'Anna B.',   xp: 280, flag: 'AT', streak: 8,  faction: 'bear' as Faction },
  { name: 'Marc T.',   xp: 265, flag: 'FR', streak: 7,  faction: 'bull' as Faction },
  { name: 'YOU',       xp: 50,  flag: 'CH', streak: 1,  faction: null },
  { name: 'Julia H.',  xp: 45,  flag: 'DE', streak: 3,  faction: 'bull' as Faction },
  { name: 'Tom W.',    xp: 30,  flag: 'GB', streak: 2,  faction: 'bear' as Faction },
  { name: 'Nina S.',   xp: 20,  flag: 'CH', streak: 1,  faction: 'bull' as Faction },
  { name: 'Alex P.',   xp: 10,  flag: 'DE', streak: 1,  faction: 'bear' as Faction },
];

function FactionDot({ f }: { f: Faction }) {
  if (!f) return null;
  return (
    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: f === 'bull' ? BRAND : '#3B82F6' }} />
  );
}

function LeagueBadge({ league, animated }: { league: typeof LEAGUES[0]; animated: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!animated) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 900, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [animated]);

  const badgeImg = (LEAGUE_BADGES as any)[league.name];

  return (
    <Animated.View style={[badgeStyles.wrapper, { transform: [{ scale }] }]}>
      {badgeImg ? (
        <View style={[badgeStyles.imgWrap, { shadowColor: league.color }]}>
          <Image source={badgeImg} style={badgeStyles.img} resizeMode="contain" />
        </View>
      ) : (
        <View style={[badgeStyles.circle, { borderColor: league.color, shadowColor: league.color }]}>
          <Text style={[badgeStyles.symbol, { color: league.color }]}>{league.symbol}</Text>
        </View>
      )}
      <Text style={[badgeStyles.name, { color: league.color }]}>{league.name} League</Text>
    </Animated.View>
  );
}

const badgeStyles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 8 },
  imgWrap: {
    width: 100, height: 100,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 20, elevation: 14,
  },
  img: { width: 100, height: 100 },
  circle: {
    width: 90, height: 90, borderRadius: 45, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 16, elevation: 12,
  },
  symbol: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  name: { fontSize: 16, fontWeight: '800' },
});

const BULL_COLOR = '#10B981';
const BEAR_COLOR = '#3B82F6';
const BULL_XP = 24530;
const BEAR_XP = 21840;
const TOTAL_XP = BULL_XP + BEAR_XP;

interface Props {
  userName: string;
  userXP: number;
  streak: number;
  faction: Faction;
}

type Tab = 'global' | 'friends';

export default function LeagueScreen({ userName, userXP, streak, faction }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const currentLeague = LEAGUES.filter(l => l.minXP <= userXP).pop() ?? LEAGUES[0];
  const nextLeague = LEAGUES.find(l => l.minXP > userXP);
  const progressToNext = nextLeague
    ? (userXP - currentLeague.minXP) / (nextLeague.minXP - currentLeague.minXP)
    : 1;
  const xpToNext = nextLeague ? nextLeague.minXP - userXP : 0;

  const handleInvite = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Ich lerne täglich Finanzen mit MarketMind — dem Quiz das dich richtig schlau macht. Lad dir die App herunter und fordere mich heraus! marketmind.app`,
        url: 'https://marketmind.app',
      });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Bulls vs Bears War */}
        <View style={war.card}>
          <Text style={war.title}>This Week's War</Text>
          <Text style={war.sub}>Every quiz earns XP for your faction</Text>

          <View style={war.mascots}>
            <View style={war.side}>
              <MascotVideo
                video={BULL_XP >= BEAR_XP ? BUCK_VID.weeklyWin : BUCK_VID.idle}
                fallback={BULL_XP >= BEAR_XP ? BUCK.weeklyWin : BUCK.default}
                size={90}
                bgColor="#111"
              />
              <Text style={[war.sideName, { color: BULL_COLOR }]}>Bulls</Text>
              <Text style={[war.sideXP, { color: BULL_COLOR }]}>{BULL_XP.toLocaleString()} XP</Text>
            </View>
            <View style={war.vsWrap}>
              <Text style={war.vs}>VS</Text>
              {faction && (
                <View style={[war.yourFaction, { backgroundColor: faction === 'bull' ? `${BULL_COLOR}20` : `${BEAR_COLOR}20`, borderColor: faction === 'bull' ? BULL_COLOR : BEAR_COLOR }]}>
                  <Text style={[war.yourFactionText, { color: faction === 'bull' ? BULL_COLOR : BEAR_COLOR }]}>
                    Your side
                  </Text>
                </View>
              )}
            </View>
            <View style={war.side}>
              <MascotVideo
                video={BEAR_XP > BULL_XP ? GRIZ_VID.weeklyWin : GRIZ_VID.idle}
                fallback={BEAR_XP > BULL_XP ? GRIZ.weeklyWin : GRIZ.default}
                size={90}
                bgColor="#111"
              />
              <Text style={[war.sideName, { color: BEAR_COLOR }]}>Bears</Text>
              <Text style={[war.sideXP, { color: BEAR_COLOR }]}>{BEAR_XP.toLocaleString()} XP</Text>
            </View>
          </View>

          <View style={war.barWrap}>
            <View style={[war.barFill, { width: `${(BULL_XP / TOTAL_XP) * 100}%`, backgroundColor: BULL_COLOR }]} />
            <View style={[war.barFill, { width: `${(BEAR_XP / TOTAL_XP) * 100}%`, backgroundColor: BEAR_COLOR }]} />
          </View>
          <Text style={war.barLabel}>
            Bulls lead by {(BULL_XP - BEAR_XP).toLocaleString()} XP · Resets Sunday
          </Text>
        </View>

        {/* Tab selector */}
        <View style={styles.tabRow}>
          {(['global', 'friends'] as Tab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab(tab); }}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                {tab === 'global' ? 'Leagues' : 'Friends'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'global' ? (
          <>
            {/* Current League Badge */}
            <View style={styles.leagueCard}>
              <LeagueBadge league={currentLeague} animated />
              <View style={styles.xpRow}>
                <Text style={styles.xpLabel}>Your XP this week</Text>
                <Text style={[styles.xpValue, { color: currentLeague.color }]}>{userXP} XP</Text>
              </View>
              {nextLeague && (
                <View style={styles.progressSection}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progressToNext * 100}%`, backgroundColor: currentLeague.color }]} />
                  </View>
                  <Text style={styles.progressLabel}>{xpToNext} XP to {nextLeague.name}</Text>
                </View>
              )}
            </View>

            {/* Leaderboard */}
            <Text style={styles.sectionTitle}>This Week's Leaderboard</Text>
            <View style={styles.leaderboardCard}>
              <View style={styles.zoneLabel}>
                <View style={[styles.zoneDot, { backgroundColor: BRAND }]} />
                <Text style={[styles.zoneLabelText, { color: BRAND }]}>Promotion Zone (Top 5)</Text>
              </View>

              {FAKE_LEADERBOARD.map((user, i) => {
                const isUser = user.name === 'YOU';
                const isPromotion = i < 5;
                const isDanger = i >= FAKE_LEADERBOARD.length - 2;
                return (
                  <View key={i}>
                    {i === 5 && <View style={styles.divider} />}
                    {i === FAKE_LEADERBOARD.length - 2 && (
                      <View style={styles.zoneLabel}>
                        <View style={[styles.zoneDot, { backgroundColor: '#FF453A' }]} />
                        <Text style={[styles.zoneLabelText, { color: '#FF453A' }]}>Demotion Zone</Text>
                      </View>
                    )}
                    <View style={[styles.row, isUser && styles.rowHighlight, isDanger && styles.rowDanger]}>
                      <Text style={[styles.rank, isPromotion && { color: GOLD }]}>
                        {i === 0 ? '#1' : i === 1 ? '#2' : i === 2 ? '#3' : `#${i + 1}`}
                      </Text>
                      <Text style={styles.flagText}>{user.flag}</Text>
                      <Text style={[styles.rowName, isUser && { color: BRAND, fontWeight: '800' }]}>
                        {isUser ? 'You' : user.name}
                      </Text>
                      <View style={styles.rowRight}>
                        <FactionDot f={isUser ? faction : user.faction} />
                        <View style={styles.streakWrap}>
                          <MascotVideo video={SHARED_VID.flameEmerald} fallback={ICONS.flameEmerald} size={14} bgColor={isUser ? `${BRAND}10` : '#1A1A1A'} />
                          <Text style={styles.rowStreak}>{user.streak}</Text>
                        </View>
                        <Text style={[styles.rowXP, isPromotion && { color: GOLD }]}>{user.xp} XP</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* How to earn XP */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>How to earn XP</Text>
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}><Text style={styles.infoIconText}>+</Text></View>
                <Text style={styles.infoText}>Complete daily quiz: +10 XP</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}><Text style={styles.infoIconText}>5</Text></View>
                <Text style={styles.infoText}>Perfect score (5/5): +5 bonus XP</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <MascotVideo video={SHARED_VID.flameEmerald} fallback={ICONS.flameEmerald} size={16} bgColor={SURFACE} />
                </View>
                <Text style={styles.infoText}>7-day streak bonus: +20 XP</Text>
              </View>
            </View>
          </>
        ) : (
          /* Friends Tab */
          <View style={styles.friendsWrap}>
            <View style={styles.friendsEmpty}>
              <View style={styles.friendsInviteCircle}>
                <Text style={styles.friendsInviteIcon}>+</Text>
              </View>
              <Text style={styles.friendsTitle}>Challenge your friends</Text>
              <Text style={styles.friendsSub}>
                Invite friends to MarketMind and see how you compare in the same league.
              </Text>
              <TouchableOpacity style={styles.inviteBtn} onPress={handleInvite} activeOpacity={0.85}>
                <Text style={styles.inviteBtnText}>Invite Friends</Text>
              </TouchableOpacity>
              <Text style={styles.friendsHint}>
                Friends you invite will appear here once they join.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const war = StyleSheet.create({
  card: { backgroundColor: '#111', borderRadius: 22, padding: 20, gap: 12, borderWidth: 1, borderColor: '#222' },
  title: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  sub: { color: '#6B7280', fontSize: 13, marginTop: -6 },
  mascots: { flexDirection: 'row', alignItems: 'center' },
  side: { flex: 1, alignItems: 'center', gap: 4 },
  sideName: { fontSize: 14, fontWeight: '800' },
  sideXP: { fontSize: 12, fontWeight: '600' },
  vsWrap: { alignItems: 'center', gap: 8, paddingHorizontal: 8 },
  vs: { color: '#444', fontSize: 18, fontWeight: '900' },
  yourFaction: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  yourFactionText: { fontSize: 10, fontWeight: '700' },
  barWrap: { flexDirection: 'row', height: 8, backgroundColor: '#1A1A1A', borderRadius: 99, overflow: 'hidden' },
  barFill: { height: '100%' },
  barLabel: { color: '#6B7280', fontSize: 11, textAlign: 'center' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  content: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8, gap: 20 },

  tabRow: { flexDirection: 'row', backgroundColor: SURFACE, borderRadius: 14, padding: 4, gap: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: BRAND },
  tabBtnText: { color: MUTED, fontSize: 14, fontWeight: '600' },
  tabBtnTextActive: { color: '#000', fontWeight: '800' },

  leagueCard: {
    backgroundColor: SURFACE, borderRadius: 22, padding: 24,
    alignItems: 'center', gap: 16, borderWidth: 1, borderColor: BORDER,
  },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  xpLabel: { color: MUTED, fontSize: 14 },
  xpValue: { fontSize: 22, fontWeight: '800' },
  progressSection: { width: '100%', gap: 6 },
  progressTrack: { height: 8, backgroundColor: BORDER, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  progressLabel: { color: MUTED, fontSize: 12, textAlign: 'center' },

  sectionTitle: { color: TEXT, fontSize: 18, fontWeight: '700' },

  leaderboardCard: {
    backgroundColor: SURFACE, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: BORDER,
  },
  zoneLabel: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#0F0F0F',
  },
  zoneDot: { width: 8, height: 8, borderRadius: 4 },
  zoneLabelText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: BORDER },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 8,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  rowHighlight: { backgroundColor: `${BRAND}10` },
  rowDanger: { backgroundColor: '#FF453A08' },
  rank: { color: MUTED, fontSize: 13, fontWeight: '700', width: 26, textAlign: 'center' },
  flagText: { color: MUTED, fontSize: 11, fontWeight: '600', width: 22 },
  rowName: { flex: 1, color: TEXT, fontSize: 15, fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rowStreak: { color: MUTED, fontSize: 12 },
  rowXP: { color: TEXT, fontSize: 14, fontWeight: '700', minWidth: 50, textAlign: 'right' },

  infoCard: { backgroundColor: SURFACE, borderRadius: 18, padding: 18, gap: 12, borderWidth: 1, borderColor: BORDER },
  infoTitle: { color: TEXT, fontSize: 15, fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIconBox: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: `${BRAND}20`,
    alignItems: 'center', justifyContent: 'center',
  },
  infoIconText: { color: BRAND, fontSize: 14, fontWeight: '900' },
  infoText: { color: MUTED, fontSize: 14, flex: 1 },

  // Friends tab
  friendsWrap: { gap: 20 },
  friendsEmpty: { alignItems: 'center', gap: 16, paddingVertical: 32, paddingHorizontal: 20 },
  friendsInviteCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: `${BRAND}20`, borderWidth: 2, borderColor: BRAND,
    alignItems: 'center', justifyContent: 'center',
  },
  friendsInviteIcon: { color: BRAND, fontSize: 32, fontWeight: '300' },
  friendsTitle: { color: TEXT, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  friendsSub: { color: MUTED, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  inviteBtn: {
    backgroundColor: BRAND, borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 40,
  },
  inviteBtnText: { color: '#000', fontSize: 15, fontWeight: '800' },
  friendsHint: { color: MUTED, fontSize: 12, textAlign: 'center' },
});
