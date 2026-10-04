/**
 * Typed access to the community rewards sheet.
 * Source of truth: data/sheet/*.csv → `npm run data` (or `npm run sync-sheet`) → generated/sheet.json
 */
import raw from './generated/sheet.json';

export type N = number | null;

export interface ClearRewards {
  gold: N;
  rosterBoundGold: N;
  characterBoundGold: N;
  mainMaterials: N;
  clearMedal: N;
  destinyStone: N;
  destructionStones: N;
  guardianStones: N;
  shards: N;
  leapstones: N;
}
export interface ChestRewards {
  cost: N;
  mainMaterials: N;
  destructionStones: N;
  guardianStones: N;
  shards: N;
  leapstones: N;
  cardPack: N;
}
export interface ChestValue {
  atItemLevel: N;
  atItemLevelNoShards: N;
  fiveToOne: N;
  fiveToOneNoShards: N;
}
export interface ExtraLoot {
  clear: { arkGridCores: N; accessories: N; abilityStones: N; bracelets: N; stoneOfChaos: N; fusedLeapstones: N; honingTomes: N };
  chest: { arkGridCores: N; accessories: N; abilityStones: N; bracelets: N; fusedLeapstones: N };
}
export interface FirstClear {
  silver: string | null;
  mainMaterials: N;
  fusedLeapstones: N;
  stoneOfChaos: N;
  destinyStone: N;
}
export interface Gate {
  gate: string;
  itemLevel: N;
  clear: ClearRewards;
  bid: { mainMaterials: N };
  chest: ChestRewards;
  value: ChestValue;
  extra: ExtraLoot | null;
}
export interface ModeTotal {
  totalGold: N;
  clear: ClearRewards;
  bid: { mainMaterials: N };
  chest: ChestRewards;
  extra: ExtraLoot | null;
}
export interface RaidMode {
  difficulty: string;
  tier: string;
  itemLevel: N;
  gates: Gate[];
  total: ModeTotal | null;
  firstClear: FirstClear | null;
  gold: { tradable: number; rosterBound: number; characterBound: number; bound: number; total: number; chestCost: number };
}
export interface Raid {
  slug: string;
  name: string;
  category: string | null;
  tiers: string[];
  modes: RaidMode[];
}
export interface ChaosRow {
  type: string;
  tier: string;
  continent: string;
  itemLevel: N;
  destructionStones: N;
  guardianStones: N;
  leapstones: N;
  shards: N;
  silver: N;
  valueNormal: N;
  valueRested: N;
}
export interface GuardianRow {
  tier: string;
  name: string;
  itemLevel: N;
  silver: N;
  gemsT4: string | null;
  gemsT3: string | null;
  abilityStones: string | null;
  bracelets: string | null;
  fragments: string | null;
  accessories: string | null;
  accessoryGrade: string | null;
}
export interface Market {
  title: string | null;
  region: string | null;
  date: string | null;
  listings: { name: string; t41: N; t4: N; note: string | null }[];
  units: { name: string; t41: N; t4: N }[];
  conversions: { section: string | null; label: string; value: number; unit: string }[];
}
export interface MariDeal {
  item: string;
  quantity: N;
  blueCrystals: N;
  goldEquivalent: N;
  marketGold: N;
  cheaper: string | null;
}
export type F4ItemKey =
  | 'destructionStones'
  | 'guardianStones'
  | 'leapstones'
  | 'fusionMaterial'
  | 'glaciersBreath'
  | 'lavasBreath'
  | 'shards'
  | 'cubeTickets'
  | 'blueCrystals'
  | 'royalCrystals';
export interface F4Pack {
  name: string;
  availability: string | null;
  usd: N;
  royalCrystals: N;
  goldCost: N;
  contents: { key: F4ItemKey; quantity: number; gold: N }[];
  otherGold: N;
  totalGold: N;
  efficiency: N;
  efficiencyNoShards: N;
  notes: string | null;
}
export interface F4Section {
  name: string;
  note: string | null;
  packs: F4Pack[];
}
export interface SheetData {
  source: string;
  lastUpdated: string | null;
  raids: Raid[];
  chaos: ChaosRow[];
  guardians: GuardianRow[];
  market: Market;
  mari: MariDeal[];
  f4: F4Section[];
}

export const sheet = raw as unknown as SheetData;

export const TIER_ORDER = ['Tier 4.1', 'Tier 4', 'Tier 3', 'Tier 2'];

export const modeSlug = (difficulty: string) => difficulty.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const getRaid = (slug: string) => sheet.raids.find((r) => r.slug === slug);

/** The newest tier a raid belongs to (raids like Horizon Cathedral span T4.1 and T4). */
export const primaryTier = (raid: Raid) => TIER_ORDER.find((t) => raid.tiers.includes(t)) ?? raid.tiers[0];

/** Flattened list of every (raid, difficulty) pair — handy for tables and planners. */
export interface RaidModeRef {
  raid: Raid;
  mode: RaidMode;
  key: string;
}
export const allModes = (): RaidModeRef[] =>
  sheet.raids.flatMap((raid) => raid.modes.map((mode) => ({ raid, mode, key: `${raid.slug}:${modeSlug(mode.difficulty)}` })));

export const findMode = (key: string): RaidModeRef | undefined => allModes().find((m) => m.key === key);

/** Solo & Matching share rewards with Normal; they are separate entry points, not separate gold sources. */
export const isAltEntry = (difficulty: string) => /^(solo|matching)$/i.test(difficulty);

/**
 * Best gold-earning raids for an item level: one mode per raid (you can only earn gold from
 * one difficulty of a raid per week), highest total gold first.
 */
export function bestRaidsFor(itemLevel: number, count = 3, opts: { includeSolo?: boolean } = {}): RaidModeRef[] {
  const eligible = allModes().filter(
    ({ mode }) => (mode.itemLevel ?? 0) <= itemLevel && (opts.includeSolo || !isAltEntry(mode.difficulty))
  );
  const bestPerRaid = new Map<string, RaidModeRef>();
  for (const ref of eligible) {
    const current = bestPerRaid.get(ref.raid.slug);
    if (!current || ref.mode.gold.total > current.mode.gold.total) bestPerRaid.set(ref.raid.slug, ref);
  }
  return [...bestPerRaid.values()].sort((a, b) => b.mode.gold.total - a.mode.gold.total).slice(0, count);
}
