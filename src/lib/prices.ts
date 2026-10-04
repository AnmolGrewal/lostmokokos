/**
 * Market price model.
 *
 * The sheet's "Market prices" tab has three kinds of numbers:
 *   - listings   (orange cells: what you see on the auction house, per tier)
 *   - unit prices (derived from listings, e.g. 100 red stones → 1 red stone)
 *   - currency   (gold ↔ blue crystal, royal crystal → gold, USD → royal crystal)
 *
 * People can override any listing, currency bundle, or a unit price that isn't derived from a
 * listing (cube ticket, hourglass, …). Everything downstream — chest value, chaos value, Mari's shop,
 * F4 packs — is recalculated from those, and falls back to the sheet value for anything not edited.
 *
 * Downstream values are recomputed as *sheet value + change caused by your prices*, so with default
 * prices every number matches the sheet exactly, and parts the sheet values without market data
 * (card packs, "other" pack contents) stay fixed.
 */
import type { ChaosRow, ChestValue, F4ItemKey, F4Pack, Gate, Market, MariDeal } from '@/data/sheet';

export type Overrides = Record<string, number>;
export type Col = 't41' | 't4';

export interface TierPrices {
  red: number;
  blue: number;
  leap: number;
  fusion: number;
}
export interface Prices {
  listings: Record<string, { t41: number | null; t4: number | null }>;
  units: Record<string, { t41: number | null; t4: number | null }>;
  conversions: Record<string, number>;
  t41: TierPrices;
  t4: TierPrices;
  shard: number;
  blueCrystal: number;
  royalCrystal: number;
  usdPerRoyalCrystal: number;
}

/** Keys used for overrides (and React keys for the inputs). */
export const listingKey = (name: string, col: Col) => `listing:${name}:${col}`;
export const unitKey = (name: string) => `unit:${name}`;
export const convKey = (label: string) => `conv:${label}`;

const SHARD_POUCHES: [string, number][] = [
  ['Shard Pouch (S)', 1000],
  ['Shard Pouch (M)', 2000],
  ['Shard Pouch (L)', 3000],
];
/** A Lv. 8 gem is 3^7 Lv. 1 gems. */
const GEM_LV8_TO_LV1 = 3 ** 7;

/** "1 Artisan's Tailoring Lv1" ↔ "Artisan's Tailoring: Level 1" */
const unitToListingName = (unit: string) => unit.replace(/^1 /, '').replace(/ Lv(\d)$/, ': Level $1');

/**
 * How a unit price is derived from listings, or null if it is entered directly
 * (cube ticket, hourglass, chaos gate, sevek… — the sheet works those out elsewhere).
 */
function deriveUnit(unit: string, col: Col, listing: (name: string, col: Col) => number | null, hasListing: (name: string) => boolean): number | null | undefined {
  const per = (name: string, n: number) => {
    const v = listing(name, col);
    return v === null ? null : v / n;
  };
  if (unit === '1 Blue stone') return per('100 Blue stones', 100);
  if (unit === '1 Red stone') return per('100 Red stones', 100);
  if (unit === '1 Fusion Mat') return per('Fusion Material', 1);
  if (unit === '1 Shard') {
    // Cheapest shard source; pouches are only listed once, so both tiers use the same column.
    const per1 = SHARD_POUCHES.map(([name, n]) => {
      const v = listing(name, 't41');
      return v === null ? Infinity : v / n;
    });
    const best = Math.min(...per1);
    return Number.isFinite(best) ? best : null;
  }
  if (unit === '1 Lv. 1 Tier 4 Gem') return per('Lv. 8 Tier 4 Gem', GEM_LV8_TO_LV1);
  if (hasListing(unit)) return per(unit, 1);
  const direct = unitToListingName(unit);
  if (hasListing(direct)) return per(direct, 1);
  return undefined; // not derivable → entered directly
}

/** Unit prices that are entered directly rather than derived from a listing. */
export function directUnits(market: Market): string[] {
  const names = new Set(market.listings.map((l) => l.name));
  return market.units.filter((u) => deriveUnit(u.name, 't41', () => 1, (n) => names.has(n)) === undefined).map((u) => u.name);
}

/** Currency entries you can edit (bundles); the "1 X" rows are derived from them. */
export const isDerivedConversion = (label: string) => /^1 /.test(label);

const countOf = (label: string) => Number(label.match(/^([\d,]+)/)?.[1].replace(/,/g, '') ?? 1);

export function buildPrices(market: Market, overrides: Overrides): Prices {
  const names = new Set(market.listings.map((l) => l.name));
  const has = (n: string) => names.has(n);
  const o = (key: string, fallback: number | null) => (key in overrides && Number.isFinite(overrides[key]) ? overrides[key] : fallback);

  const listings: Prices['listings'] = {};
  for (const l of market.listings) listings[l.name] = { t41: o(listingKey(l.name, 't41'), l.t41), t4: o(listingKey(l.name, 't4'), l.t4) };
  const listing = (name: string, col: Col) => listings[name]?.[col] ?? null;

  const units: Prices['units'] = {};
  for (const u of market.units) {
    const d41 = deriveUnit(u.name, 't41', listing, has);
    if (d41 === undefined) {
      const v = o(unitKey(u.name), u.t41);
      units[u.name] = { t41: v, t4: u.t4 === null ? null : v };
    } else {
      const d4 = deriveUnit(u.name, 't4', listing, has);
      // Shards aren't tiered: the sheet shows the same price in both columns.
      units[u.name] = { t41: d41, t4: u.t4 === null ? null : u.name === '1 Shard' ? d41 : (d4 ?? null) };
    }
  }

  const conversions: Prices['conversions'] = {};
  const bySection = new Map<string, Market['conversions']>();
  for (const c of market.conversions) {
    const s = c.section ?? '';
    bySection.set(s, [...(bySection.get(s) ?? []), c]);
  }
  for (const [, entries] of bySection) {
    const bundle = entries.find((c) => !isDerivedConversion(c.label));
    for (const c of entries) {
      if (!isDerivedConversion(c.label)) conversions[c.label] = o(convKey(c.label), c.value) ?? c.value;
    }
    for (const c of entries) {
      if (isDerivedConversion(c.label)) {
        conversions[c.label] = bundle ? conversions[bundle.label] / countOf(bundle.label) : c.value;
      }
    }
  }

  const u = (name: string, col: Col) => units[name]?.[col] ?? 0;
  const tier = (col: Col): TierPrices => ({ red: u('1 Red stone', col), blue: u('1 Blue stone', col), leap: u('1 Leapstone', col), fusion: u('1 Fusion Mat', col) });
  const usdBundle = market.conversions.find((c) => c.section?.startsWith('USD') && c.unit === 'USD');

  return {
    listings,
    units,
    conversions,
    t41: tier('t41'),
    t4: tier('t4'),
    shard: u('1 Shard', 't41'),
    blueCrystal: conversions['1 Blue Crystal'] ?? 0,
    royalCrystal: conversions['1 Royal Crystal'] ?? 0,
    usdPerRoyalCrystal: usdBundle ? conversions[usdBundle.label] / countOf(usdBundle.label) : 0,
  };
}

// ---------------------------------------------------------------------------------------------
// Valuation
// ---------------------------------------------------------------------------------------------

interface Mats {
  red: number;
  blue: number;
  leap: number;
  shards: number;
}
const matsValue = (m: Mats, tp: TierPrices, shard: number, withShards: boolean) => m.red * tp.red + m.blue * tp.blue + m.leap * tp.leap + (withShards ? m.shards * shard : 0);
const fiveToOne = (p: Prices): TierPrices => ({ red: p.t41.red / 5, blue: p.t41.blue / 5, leap: p.t41.leap / 5, fusion: p.t41.fusion / 5 });
const tierPrices = (p: Prices, tier: string | null): TierPrices | null => (tier === 'Tier 4.1' ? p.t41 : tier === 'Tier 4' ? p.t4 : null);

/** Chest value (% of chest cost) for a gate at the given prices. */
export function gateValue(gate: Gate, tier: string, p: Prices, d: Prices): ChestValue {
  const v = gate.value;
  const cost = gate.chest.cost ?? 0;
  const at = tierPrices(p, tier);
  const atD = tierPrices(d, tier);
  if (!cost || !at || !atD) return v;
  const m: Mats = { red: gate.chest.destructionStones ?? 0, blue: gate.chest.guardianStones ?? 0, leap: gate.chest.leapstones ?? 0, shards: gate.chest.shards ?? 0 };
  const shift = (sheetPct: number | null, mine: number, theirs: number) => (sheetPct === null ? null : Math.round(sheetPct + ((mine - theirs) / cost) * 100));
  return {
    atItemLevel: shift(v.atItemLevel, matsValue(m, at, p.shard, true), matsValue(m, atD, d.shard, true)),
    atItemLevelNoShards: shift(v.atItemLevelNoShards, matsValue(m, at, p.shard, false), matsValue(m, atD, d.shard, false)),
    fiveToOne: shift(v.fiveToOne, matsValue(m, fiveToOne(p), p.shard, true), matsValue(m, fiveToOne(d), d.shard, true)),
    fiveToOneNoShards: shift(v.fiveToOneNoShards, matsValue(m, fiveToOne(p), p.shard, false), matsValue(m, fiveToOne(d), d.shard, false)),
  };
}

/** Chaos / Kurzan Front run value at the given prices. */
export function chaosValue(row: ChaosRow, p: Prices, d: Prices): { normal: number | null; rested: number | null } {
  const tp = tierPrices(p, row.tier);
  const td = tierPrices(d, row.tier);
  if (row.valueNormal === null || !tp || !td) return { normal: row.valueNormal, rested: row.valueRested };
  const m: Mats = { red: row.destructionStones ?? 0, blue: row.guardianStones ?? 0, leap: row.leapstones ?? 0, shards: row.shards ?? 0 };
  const delta = matsValue(m, tp, p.shard, true) - matsValue(m, td, d.shard, true);
  return { normal: Math.round(row.valueNormal + delta), rested: row.valueRested === null ? null : Math.round(row.valueRested + 2 * delta) };
}

/** Market price of one unit of a Mari's shop item, or null when it has no market listing. */
function mariUnitPrice(item: string, p: Prices): number | null {
  const unit = (name: string) => p.units[name]?.t41 ?? null;
  if (item === 'Superior Abidos Fusion Material') return p.t41.fusion;
  if (item === 'Abidos Fusion Material') return p.t4.fusion;
  if (item === 'Destiny Crystallized Destruction Stone') return p.t41.red;
  if (item === 'Destiny Crystallized Guardian Stone') return p.t41.blue;
  if (item === 'Great Destiny Leapstone') return p.t41.leap;
  if (item === 'Destiny Leapstone') return p.t4.leap;
  const pouch = item.match(/Shard Pouch \((S|M|L)\)/);
  if (pouch) return p.shard * { S: 1000, M: 2000, L: 3000 }[pouch[1] as 'S' | 'M' | 'L'];
  const hellfire = item.match(/^(Tailoring|Metallurgy): Hellfire \[11-14\]$/);
  if (hellfire) return unit(`1 ${hellfire[1]} 11-14`);
  const artisan = item.match(/^Artisan's (Tailoring|Metallurgy): Level (\d)$/);
  if (artisan) return unit(`1 Artisan's ${artisan[1]} Lv${artisan[2]}`);
  return unit(`1 ${item}`);
}

export interface MariValue extends MariDeal {
  savings: number | null;
}
export function mariValue(deal: MariDeal, p: Prices, d: Prices): MariValue {
  const ratio = (a: number | null, b: number | null) => (a !== null && b ? a / b : 1);
  const goldEquivalent = deal.goldEquivalent === null ? null : Math.round(deal.goldEquivalent * ratio(p.blueCrystal, d.blueCrystal));
  const marketGold = deal.marketGold === null ? null : Math.round(deal.marketGold * ratio(mariUnitPrice(deal.item, p), mariUnitPrice(deal.item, d)));
  const comparable = marketGold !== null && goldEquivalent !== null;
  return {
    ...deal,
    goldEquivalent,
    marketGold,
    cheaper: comparable ? (marketGold! < goldEquivalent! ? 'Market' : 'Mari') : deal.cheaper,
    savings: comparable ? marketGold! - goldEquivalent! : null,
  };
}

/** F4 contents are valued at T4 market prices (they're the T4 versions of the mats). */
function f4UnitPrice(key: F4ItemKey, p: Prices): number | null {
  switch (key) {
    case 'destructionStones':
      return p.t4.red;
    case 'guardianStones':
      return p.t4.blue;
    case 'leapstones':
      return p.t4.leap;
    case 'fusionMaterial':
      return p.t4.fusion;
    case 'glaciersBreath':
      return p.units["1 Glacier's Breath"]?.t41 ?? null;
    case 'lavasBreath':
      return p.units["1 Lava's Breath"]?.t41 ?? null;
    case 'shards':
      return p.shard;
    case 'cubeTickets':
      return Object.entries(p.units).find(([n]) => /cube ticket/i.test(n))?.[1].t41 ?? null;
    case 'blueCrystals':
      return p.blueCrystal;
    case 'royalCrystals':
      return null; // refunded crystals aren't counted as value by the sheet
  }
}

/** Items where a pack lets you pick one or the other; the sheet only counts the better pick. */
const F4_CHOICES: [F4ItemKey, F4ItemKey][] = [
  ['glaciersBreath', 'lavasBreath'],
  ['destructionStones', 'guardianStones'],
];

/**
 * Which contents the sheet left out of a pack's total (the unpicked side of a choice, or items it
 * doesn't value). Found by matching the sheet's own total, so it follows whatever the sheet does.
 */
const excludedCache = new Map<string, Set<F4ItemKey>>();
function excludedContents(pack: F4Pack): Set<F4ItemKey> {
  const cacheKey = `${pack.name}|${pack.totalGold}`;
  const hit = excludedCache.get(cacheKey);
  if (hit) return hit;
  const valued = pack.contents.filter((c) => c.gold !== null);
  const diff = valued.reduce((s, c) => s + c.gold!, 0) + (pack.otherGold ?? 0) - (pack.totalGold ?? 0);
  let best: F4ItemKey[] = [];
  if (pack.totalGold !== null && Math.abs(diff) > 2) {
    let bestSize = Infinity;
    for (let mask = 1; mask < 1 << valued.length; mask++) {
      const picked = valued.filter((_, i) => mask & (1 << i));
      const sum = picked.reduce((s, c) => s + c.gold!, 0);
      if (Math.abs(sum - diff) <= 2 && picked.length < bestSize) {
        best = picked.map((c) => c.key);
        bestSize = picked.length;
      }
    }
  }
  const result = new Set(best);
  excludedCache.set(cacheKey, result);
  return result;
}

/** Gold the sheet counts for a pack's contents, given per-item gold values. */
function countedGold(pack: F4Pack, gold: Map<F4ItemKey, number>, excluded: Set<F4ItemKey>, withShards: boolean): number {
  let total = 0;
  const handled = new Set<F4ItemKey>();
  for (const [a, b] of F4_CHOICES) {
    const pickA = gold.has(a) && gold.has(b) && (excluded.has(a) !== excluded.has(b));
    if (pickA) {
      total += Math.max(gold.get(a)!, gold.get(b)!);
      handled.add(a).add(b);
    }
  }
  for (const [key, g] of gold) {
    if (handled.has(key) || excluded.has(key) || (!withShards && key === 'shards')) continue;
    total += g;
  }
  return total;
}

export function f4Value(pack: F4Pack, p: Prices, d: Prices): F4Pack {
  const ratio = (a: number | null, b: number | null) => (a !== null && b ? a / b : 1);
  const contents = pack.contents.map((c) => ({ ...c, gold: c.gold === null ? null : Math.round(c.gold * ratio(f4UnitPrice(c.key, p), f4UnitPrice(c.key, d))) }));
  const before = new Map(pack.contents.filter((c) => c.gold !== null).map((c) => [c.key, c.gold!]));
  const after = new Map(contents.filter((c) => c.gold !== null).map((c) => [c.key, c.gold!]));
  const excluded = excludedContents(pack);
  const delta = (withShards: boolean) => countedGold(pack, after, excluded, withShards) - countedGold(pack, before, excluded, withShards);

  const goldCost = pack.goldCost === null ? null : Math.round(pack.goldCost * ratio(p.royalCrystal, d.royalCrystal));
  const totalGold = pack.totalGold === null ? null : pack.totalGold + delta(true);
  // Royal Crystal priced packs scale with the USD rate; fixed-price founder packs don't.
  const rcPriced = pack.usd !== null && pack.royalCrystals !== null && Math.abs(pack.usd - pack.royalCrystals * d.usdPerRoyalCrystal) < 0.05;
  const shift = (sheetPct: number | null, dGold: number) => {
    if (sheetPct === null || !goldCost || !pack.goldCost) return sheetPct;
    return Math.round((((sheetPct / 100) * pack.goldCost + dGold) / goldCost) * 10000) / 100;
  };
  return {
    ...pack,
    contents,
    usd: rcPriced ? Math.round(pack.royalCrystals! * p.usdPerRoyalCrystal * 100) / 100 : pack.usd,
    goldCost,
    totalGold,
    efficiency: shift(pack.efficiency, delta(true)),
    efficiencyNoShards: shift(pack.efficiencyNoShards, delta(false)),
  };
}
