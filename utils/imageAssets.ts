// ─── Mascot Images (PNG, transparent background) ─────────────────────────────
export const BUCK = {
  default:    require('../assets/mascots/buck_default.png'),
  correct:    require('../assets/mascots/buck_correct.png'),
  streakLost: require('../assets/mascots/buck_streak_lost.png'),
  fire:       require('../assets/mascots/buck_fire.png'),
  wrong:      require('../assets/mascots/buck_wrong.png'),
  levelUp:    require('../assets/mascots/buck_level_up.png'),
  faction:    require('../assets/mascots/buck_faction.png'),
  weeklyWin:  require('../assets/mascots/buck_weekly_win.png'),
};

export const GRIZ = {
  default:    require('../assets/mascots/griz_default.png'),
  correct:    require('../assets/mascots/griz_correct.png'),
  streakLost: require('../assets/mascots/griz_streak_lost.png'),
  ice:        require('../assets/mascots/griz_ice.png'),
  wrong:      require('../assets/mascots/griz_wrong.png'),
  levelUp:    require('../assets/mascots/griz_level_up.png'),
  faction:    require('../assets/mascots/griz_faction.png'),
  weeklyWin:  require('../assets/mascots/griz_weekly_win.png'),
};

export const BOTH = {
  onboarding: require('../assets/mascots/both_onboarding.png'),
};

// ─── Mascot Videos (MP4, animated) ───────────────────────────────────────────
export const BUCK_VID = {
  idle:      require('../assets/videos/buck_idle.mp4'),
  correct:   require('../assets/videos/buck_correct.mp4'),
  streakLost:require('../assets/videos/buck_streak_lost.mp4'),
  fire:      require('../assets/videos/buck_fire.mp4'),
  wrong:     require('../assets/videos/buck_wrong.mp4'),
  levelUp:   require('../assets/videos/buck_level_up.mp4'),
  faction:   require('../assets/videos/buck_faction.mp4'),
  weeklyWin: require('../assets/videos/buck_weekly_win.mp4'),
};

export const GRIZ_VID = {
  idle:      require('../assets/videos/griz_idle.mp4'),
  correct:   require('../assets/videos/griz_correct.mp4'),
  streakLost:require('../assets/videos/griz_streak_lost.mp4'),
  fire:      require('../assets/videos/griz_fire.mp4'),
  wrong:     require('../assets/videos/griz_wrong.mp4'),
  levelUp:   require('../assets/videos/griz_level_up.mp4'),
  faction:   require('../assets/videos/griz_faction.mp4'),
  weeklyWin: require('../assets/videos/griz_weekly_win.mp4'),
};

export const SHARED_VID = {
  bothOnboarding: require('../assets/videos/both_onboarding.mp4'),
  bellRing:       require('../assets/videos/bell_ring_v2.mp4'),
  flameIdle:      require('../assets/videos/flame_idle.mp4'),
  flameGreen:     require('../assets/videos/flame_green.mp4'),
  flameEmerald:   require('../assets/videos/flame_emerald.mp4'),
  flameGreenV2:   require('../assets/videos/flame_green_v2.mp4'),
  grizLanguage:   require('../assets/videos/griz_language.mp4'),
  iceAura:        require('../assets/videos/ice_aura.mp4'),
};

// ─── Faction-aware mascot helpers ─────────────────────────────────────────────
type Faction = 'bull' | 'bear' | null;

export function getMascotVid(faction: Faction, type: 'idle' | 'correct' | 'wrong' | 'levelUp' | 'fire' | 'streakLost' | 'weeklyWin' | 'faction') {
  if (faction === 'bear') {
    const bearMap = {
      idle: GRIZ_VID.idle, correct: GRIZ_VID.correct, wrong: GRIZ_VID.wrong,
      levelUp: GRIZ_VID.levelUp, fire: GRIZ_VID.fire, streakLost: GRIZ_VID.streakLost,
      weeklyWin: GRIZ_VID.weeklyWin, faction: GRIZ_VID.faction,
    };
    return bearMap[type];
  }
  return BUCK_VID[type];
}

export function getMascotImg(faction: Faction, type: 'default' | 'correct' | 'wrong' | 'levelUp' | 'fire' | 'streakLost' | 'weeklyWin' | 'faction') {
  if (faction === 'bear') {
    const bearMap = {
      default: GRIZ.default, correct: GRIZ.correct, wrong: GRIZ.wrong,
      levelUp: GRIZ.levelUp, fire: GRIZ.ice, streakLost: GRIZ.streakLost,
      weeklyWin: GRIZ.weeklyWin, faction: GRIZ.faction,
    };
    return bearMap[type];
  }
  const buckMap = {
    default: BUCK.default, correct: BUCK.correct, wrong: BUCK.wrong,
    levelUp: BUCK.levelUp, fire: BUCK.fire, streakLost: BUCK.streakLost,
    weeklyWin: BUCK.weeklyWin, faction: BUCK.faction,
  };
  return buckMap[type];
}

export function getFactionColor(faction: Faction): string {
  return faction === 'bear' ? '#3B82F6' : '#10B981';
}

// ─── Onboarding Icons ─────────────────────────────────────────────────────────
export const ICONS = {
  invest:       require('../assets/icons/icon_invest.png'),
  markets:      require('../assets/icons/icon_markets.png'),
  school:       require('../assets/icons/icon_school.png'),
  curious:      require('../assets/icons/icon_curious.png'),
  social:       require('../assets/icons/icon_social.png'),
  friends:      require('../assets/icons/icon_friends.png'),
  ai:           require('../assets/icons/icon_ai.png'),
  other:        require('../assets/icons/icon_other.png'),
  beginner:     require('../assets/icons/icon_beginner.png'),
  basic:        require('../assets/icons/icon_basic.png'),
  intermediate: require('../assets/icons/icon_intermediate.png'),
  advanced:     require('../assets/icons/icon_advanced.png'),
  wealth:       require('../assets/icons/icon_wealth.png'),
  investing:    require('../assets/icons/icon_investing.png'),
  decisions:    require('../assets/icons/icon_decisions.png'),
  career:       require('../assets/icons/icon_career.png'),
  love:         require('../assets/icons/icon_love.png'),
  min5:         require('../assets/icons/icon_5min.png'),
  min10:        require('../assets/icons/icon_10min.png'),
  min15:        require('../assets/icons/icon_15min.png'),
  min20:        require('../assets/icons/icon_20min.png'),
  bell:         require('../assets/icons/icon_bell.png'),
  flame:        require('../assets/icons/icon_flame.png'),
  flameEmerald: require('../assets/icons/icon_flame_emerald.png'),
  flagEn:       require('../assets/icons/flag_en.png'),
  flagDe:       require('../assets/icons/flag_de.png'),
  flagEs:       require('../assets/icons/flag_es.png'),
  flagPt:       require('../assets/icons/flag_pt.png'),
  cloudSynced:      require('../assets/icons/icon_cloud_synced.png'),
  cloudBackup:      require('../assets/icons/icon_cloud_backup.png'),
  diffBeginner:     require('../assets/icons/icon_diff_beginner.png'),
  diffIntermediate: require('../assets/icons/icon_diff_intermediate.png'),
  diffAdvanced:     require('../assets/icons/icon_diff_advanced.png'),
};

// ─── League Badges ───────────────────────────────────────────────────────────
export const LEAGUE_BADGES = {
  Iron:     require('../assets/badges/badge_iron.png'),
  Bronze:   require('../assets/badges/badge_bronze.png'),
  Silver:   require('../assets/badges/badge_silver.png'),
  Gold:     require('../assets/badges/badge_gold.png'),
  Emerald:  require('../assets/badges/badge_emerald.png'),
  Sapphire: require('../assets/badges/badge_sapphire.png'),
  Platinum: require('../assets/badges/badge_platinum.png'),
  Obsidian: require('../assets/badges/badge_obsidian.png'),
};

// ─── Lesson Icons ────────────────────────────────────────────────────────────
export const LESSON_ICONS = {
  investing:       require('../assets/icons/lesson_investing.png'),
  stocks:          require('../assets/icons/lesson_stocks.png'),
  bullBear:        require('../assets/icons/lesson_bull_bear.png'),
  diversification: require('../assets/icons/lesson_diversification.png'),
  etf:             require('../assets/icons/lesson_etf.png'),
  compound:        require('../assets/icons/lesson_compound.png'),
  dca:             require('../assets/icons/lesson_dca.png'),
  daily:           require('../assets/icons/icon_daily.png'),
  heart:           require('../assets/icons/icon_heart.png'),
};

// ─── Lesson ID → Image mapping (no emoji needed when image exists) ────────────
export const LESSON_ICON_MAP: Record<string, any> = {
  l1_1: require('../assets/icons/lesson_investing.png'),
  l1_2: require('../assets/icons/lesson_stocks.png'),
  l1_3: require('../assets/icons/lesson_bull_bear.png'),
  l1_4: require('../assets/icons/lesson_diversification.png'),
  l1_5: require('../assets/icons/lesson_etf.png'),
  l2_1: require('../assets/icons/lesson_compound.png'),
  l2_2: require('../assets/icons/lesson_dca.png'),
};

// ─── Backgrounds ─────────────────────────────────────────────────────────────
export const BACKGROUNDS = {
  tradingRoom: require('../assets/backgrounds/bg_trading_room.png'),
  bullMarket:  require('../assets/backgrounds/bg_bull_market.png'),
  bearMarket:  require('../assets/backgrounds/bg_bear_market.png'),
};

// ─── Category background images for news ──────────────────────────────────────
export const CAT_BG: Record<string, any> = {
  Markets:     BACKGROUNDS.bullMarket,
  Crypto:      BACKGROUNDS.bearMarket,
  Macro:       BACKGROUNDS.tradingRoom,
  Stocks:      BACKGROUNDS.bullMarket,
  Tech:        BACKGROUNDS.tradingRoom,
  Global:      BACKGROUNDS.bearMarket,
  Commodities: BACKGROUNDS.bullMarket,
};

// Legacy support
export const IMAGES = {
  flame:     require('../assets/icons/icon_flame.png'),
  chartHero: require('../assets/icons/icon_markets.png'),
  newsHero:  require('../assets/icons/icon_markets.png'),
};
