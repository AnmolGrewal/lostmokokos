#!/usr/bin/env node
/**
 * Turns the CSV snapshots in data/sheet/*.csv (exported from the
 * "Raids, Dungeons and Guardians Rewards" Google Sheet) into
 * src/data/generated/sheet.json, which the site reads at build time.
 *
 * Column positions are validated against the sheet's header labels, so if the
 * sheet layout changes this script fails loudly instead of shipping bad data.
 *
 *   node scripts/build-data.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, num, text } from './lib/csv.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sheetDir = join(root, 'data', 'sheet');
const outFile = join(root, 'src', 'data', 'generated', 'sheet.json');

const read = (name) => parseCsv(readFileSync(join(sheetDir, `${name}.csv`), 'utf8'));
const squash = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

function expectHeaders(tab, row, expected) {
  for (const [index, label] of Object.entries(expected)) {
    const actual = squash(row[index]);
    if (actual.toLowerCase() !== label.toLowerCase()) {
      throw new Error(`[${tab}] expected column ${index} to be "${label}" but found "${actual}". The sheet layout changed; update scripts/build-data.mjs.`);
    }
  }
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Keep the slugs the old site used so existing links/bookmarks keep working.
const SLUG_OVERRIDES = {
  'Final Day': 'finalday',
  'Act 2: Brelshaza': 'brelshaza2',
};

function splitRaidName(raw) {
  const cleaned = raw.replace(/-\s*\n\s*/g, '-').replace(/\s*\n\s*/g, ' ').trim();
  const m = cleaned.match(/^([^:]+):\s*(.+)$/);
  const category = m ? m[1].trim() : null;
  const name = m ? m[2].trim() : cleaned;
  const full = category ? `${category}: ${name}` : name;
  const slug = SLUG_OVERRIDES[full] ?? SLUG_OVERRIDES[name] ?? slugify(name);
  return { name, category, slug };
}

// ---------------------------------------------------------------- Raid Info
const RAID_COLUMNS = {
  6: ['clear', 'gold', 'Gold'],
  7: ['clear', 'rosterBoundGold', 'Roster-bound Gold'],
  8: ['clear', 'characterBoundGold', 'Character-bound Gold'],
  9: ['clear', 'mainMaterials', 'Main Materials'],
  10: ['clear', 'clearMedal', 'Clear Medal'],
  11: ['clear', 'destinyStone', 'Destiny Stone'],
  12: ['clear', 'destructionStones', 'Destruction Stones'],
  13: ['clear', 'guardianStones', 'Guardian Stones'],
  14: ['clear', 'shards', 'Shards'],
  15: ['clear', 'leapstones', 'Leapstones'],
  16: ['bid', 'mainMaterials', 'Main Materials'],
  17: ['chest', 'cost', 'Chest cost'],
  18: ['chest', 'mainMaterials', 'Main Materials'],
  19: ['chest', 'destructionStones', 'Destruction Stones'],
  20: ['chest', 'guardianStones', 'Guardian Stones'],
  21: ['chest', 'shards', 'Shards'],
  22: ['chest', 'leapstones', 'Leapstones'],
  23: ['chest', 'cardPack', 'Card Pack'],
  25: ['value', 'atItemLevel', 'at item lvl'],
  26: ['value', 'atItemLevelNoShards', 'at item lvl without shards'],
  27: ['value', 'fiveToOne', '5:1 to T4.1 mats'],
  28: ['value', 'fiveToOneNoShards', '5:1 to T4.1 without shards'],
};

const LOOT_COLUMNS = {
  6: ['clear', 'arkGridCores', 'Ark Grid Cores'],
  7: ['clear', 'accessories', 'Accessories'],
  8: ['clear', 'abilityStones', 'Ability Stones'],
  9: ['clear', 'bracelets', 'Bracelets'],
  10: ['clear', 'stoneOfChaos', 'Stone of Chaos'],
  11: ['clear', 'fusedLeapstones', 'Fused Leapstones'],
  12: ['clear', 'honingTomes', 'Honing Tomes'],
  13: ['chest', 'arkGridCores', 'Ark Grid Cores'],
  14: ['chest', 'accessories', 'Accessories'],
  15: ['chest', 'abilityStones', 'Ability Stones'],
  16: ['chest', 'bracelets', 'Bracelets'],
  17: ['chest', 'fusedLeapstones', 'Fused Leapstones'],
};
const FIRST_CLEAR_COLUMNS = {
  18: ['silver', 'Silver'],
  19: ['mainMaterials', 'Mains Materials'],
  20: ['fusedLeapstones', 'Fused Leapstones'],
  21: ['stoneOfChaos', 'Stone of Chaos'],
  22: ['destinyStone', 'Destiny Stone'],
};

/** Walks a raid-shaped tab and yields { raidRaw, difficulty, tier, itemLevel, gate, row } with merged cells filled down. */
function* walkRaidRows(rows, startRow) {
  let tier = null;
  let raidRaw = null;
  let difficulty = null;
  let itemLevel = null;
  for (const row of rows.slice(startRow)) {
    const gate = squash(row[5]);
    if (!gate) continue;
    if (row[1]) tier = squash(row[1]);
    if (row[2]) raidRaw = row[2];
    if (row[3]) {
      difficulty = squash(row[3]);
      itemLevel = null;
    }
    if (row[4]) itemLevel = num(row[4]);
    yield { raidRaw, difficulty, tier, itemLevel, gate, row };
  }
}

function pick(row, columns, group) {
  const out = {};
  for (const [index, [g, key]] of Object.entries(columns)) {
    if (g === group) out[key] = num(row[index]);
  }
  return out;
}

function buildRaids() {
  const info = read('raid_info');
  const loot = read('raid_extra_loot');

  const lastUpdatedMatch = squash(info[0][1]).match(/Last updated:\s*(.+)$/i);
  expectHeaders('Raid Info', info[2], Object.fromEntries(Object.entries(RAID_COLUMNS).map(([i, [, , l]]) => [i, l])));
  expectHeaders('Raid extra loot', loot[2], {
    ...Object.fromEntries(Object.entries(LOOT_COLUMNS).map(([i, [, , l]]) => [i, l])),
    ...Object.fromEntries(Object.entries(FIRST_CLEAR_COLUMNS).map(([i, [, l]]) => [i, l])),
  });

  // Index extra loot rows by raid|difficulty|gate
  const lootIndex = new Map();
  const firstClearIndex = new Map();
  for (const r of walkRaidRows(loot, 3)) {
    const key = `${squash(r.raidRaw)}|${r.difficulty}`;
    lootIndex.set(`${key}|${r.gate}`, { clear: pick(r.row, LOOT_COLUMNS, 'clear'), chest: pick(r.row, LOOT_COLUMNS, 'chest') });
    if (r.gate === 'Gate 1') {
      const fc = {};
      for (const [index, [k]] of Object.entries(FIRST_CLEAR_COLUMNS)) fc[k] = k === 'silver' ? text(r.row[index]) : num(r.row[index]);
      firstClearIndex.set(key, fc);
    }
  }

  const raids = [];
  const bySlug = new Map();
  for (const r of walkRaidRows(info, 3)) {
    const { name, category, slug } = splitRaidName(r.raidRaw);
    let raid = bySlug.get(slug);
    if (!raid) {
      raid = { slug, name, category, tiers: [], modes: [] };
      bySlug.set(slug, raid);
      raids.push(raid);
    }
    let mode = raid.modes.find((m) => m.difficulty === r.difficulty);
    if (!mode) {
      const key = `${squash(r.raidRaw)}|${r.difficulty}`;
      mode = {
        difficulty: r.difficulty,
        tier: r.tier,
        itemLevel: r.itemLevel,
        gates: [],
        total: null,
        firstClear: firstClearIndex.get(key) ?? null,
      };
      raid.modes.push(mode);
      if (!raid.tiers.includes(r.tier)) raid.tiers.push(r.tier);
    }
    const lootRow = lootIndex.get(`${squash(r.raidRaw)}|${r.difficulty}|${r.gate}`) ?? null;
    const entry = {
      gate: r.gate,
      itemLevel: r.itemLevel,
      clear: pick(r.row, RAID_COLUMNS, 'clear'),
      bid: pick(r.row, RAID_COLUMNS, 'bid'),
      chest: pick(r.row, RAID_COLUMNS, 'chest'),
      value: pick(r.row, RAID_COLUMNS, 'value'),
      extra: lootRow,
    };
    if (r.gate === 'Total') {
      mode.total = { ...entry, totalGold: entry.clear.gold };
      delete mode.total.gate;
      delete mode.total.itemLevel;
      delete mode.total.value;
    } else {
      mode.gates.push(entry);
    }
  }

  // Derived numbers used across the site.
  for (const raid of raids) {
    for (const mode of raid.modes) {
      const sum = (fn) => mode.gates.reduce((s, g) => s + (fn(g) ?? 0), 0);
      const tradable = sum((g) => g.clear.gold);
      const bound = sum((g) => (g.clear.rosterBoundGold ?? 0) + (g.clear.characterBoundGold ?? 0));
      mode.gold = {
        tradable,
        rosterBound: sum((g) => g.clear.rosterBoundGold),
        characterBound: sum((g) => g.clear.characterBoundGold),
        bound,
        total: mode.total?.totalGold ?? tradable + bound,
        chestCost: sum((g) => g.chest.cost),
      };
      if (mode.total && mode.total.totalGold !== null && mode.total.totalGold !== tradable + bound) {
        console.warn(`! ${raid.name} ${mode.difficulty}: sheet total ${mode.total.totalGold} != gate sum ${tradable + bound}`);
      }
    }
  }

  return { lastUpdated: lastUpdatedMatch ? lastUpdatedMatch[1].trim() : null, raids };
}

// -------------------------------------------------------------- Daily Chaos
function buildChaos() {
  const rows = read('daily_chaos');
  expectHeaders('Daily Chaos', rows[1], { 2: 'Tier', 3: 'Continent', 4: 'Item level', 5: 'Clear rewards', 10: 'Market value' });
  expectHeaders('Daily Chaos', rows[2], { 10: 'Normal', 12: 'Rested' });
  const out = [];
  let type = null;
  let tier = null;
  let continent = null;
  for (const row of rows.slice(3)) {
    if (!row[4]) continue;
    if (row[1]) type = squash(row[1]);
    if (row[2]) tier = squash(row[2]);
    if (row[3]) continent = squash(row[3]);
    out.push({
      type,
      tier,
      continent,
      itemLevel: num(row[4]),
      destructionStones: num(row[5]),
      guardianStones: num(row[6]),
      leapstones: num(row[7]),
      shards: num(row[8]),
      silver: num(row[9]),
      valueNormal: num(row[10]),
      valueRested: num(row[12]),
    });
  }
  return out;
}

// ----------------------------------------------------------- Guardian Raids
function buildGuardians() {
  const rows = read('guardian_raids');
  expectHeaders('Guardian Raids', rows[1], { 2: 'Guardian Raids', 3: 'Item level', 4: 'Clear rewards' });
  expectHeaders('Guardian Raids', rows[2], { 11: 'Accessories' });
  const out = [];
  let tier = null;
  for (const row of rows.slice(3)) {
    if (!row[3]) continue;
    if (row[1]) tier = squash(row[1]);
    out.push({
      tier,
      name: squash(row[2]) || out[out.length - 1]?.name || '',
      itemLevel: num(row[3]),
      silver: num(row[4]),
      gemsT4: text(row[5]),
      gemsT3: text(row[6]),
      abilityStones: text(row[7]),
      bracelets: text(row[8]),
      fragments: text(row[9]),
      accessories: text(row[10]),
      accessoryGrade: text(row[11]),
    });
  }
  return out;
}

// ------------------------------------------------------------ Market prices
function buildMarket() {
  const rows = read('market_prices');
  const titleRow = rows.find((r) => /market prices/i.test(r[3] ?? ''));
  expectHeaders('Market prices', rows[3], { 3: 'T4.1', 4: 'T4', 8: 'T4.1', 9: 'T4' });
  const listings = [];
  const units = [];
  const conversions = [];
  let section = null;
  for (const row of rows.slice(4)) {
    if (row[2]) {
      const t4 = num(row[4]);
      listings.push({ name: squash(row[2]), t41: num(row[3]), t4, note: t4 === null && row[4] && row[4] !== '-' ? squash(row[4]) : null });
    }
    if (row[7]) units.push({ name: squash(row[7]), t41: num(row[8]), t4: num(row[9]) });
  }
  for (const row of rows.slice(2)) {
    if (row[11] && !row[12]) section = squash(row[11]);
    else if (row[11] && num(row[12]) !== null) conversions.push({ section, label: squash(row[11]), value: num(row[12]), unit: squash(row[13]) });
  }
  const title = titleRow ? squash(titleRow[3]) : null;
  const dateMatch = title?.match(/-\s*([A-Z]+)\s*-\s*(.+)$/);
  return { title, region: dateMatch?.[1] ?? null, date: dateMatch?.[2] ?? null, listings, units, conversions };
}

// --------------------------------------------------------------- Mari's Shop
function buildMari() {
  const rows = read('maris_shop');
  expectHeaders("Mari's Shop", rows[2], { 3: 'Quantity', 4: 'BC cost', 5: 'Gold cost equivalent', 6: 'Gold cost' });
  return rows
    .slice(3)
    .filter((r) => r[2])
    .map((r) => ({
      item: squash(r[2]),
      quantity: num(r[3]),
      blueCrystals: num(r[4]),
      goldEquivalent: num(r[5]),
      marketGold: num(r[6]),
      cheaper: text(r[7]),
    }));
}

// ------------------------------------------------------------------ F4 Shop
const F4_ITEMS = [
  'destructionStones',
  'guardianStones',
  'leapstones',
  'fusionMaterial',
  'glaciersBreath',
  'lavasBreath',
  'shards',
  'cubeTickets',
  'blueCrystals',
  'royalCrystals',
];

function buildF4() {
  const rows = read('f4_shop');
  expectHeaders('F4 Shop', rows[1], { 2: 'Royal Crystal packs', 3: 'Availability', 4: 'USD cost', 5: 'Royal Crystal cost', 6: 'Gold cost equivalent', 7: 'Pack content', 20: 'Pack efficiency', 21: 'Pack efficiency without shards', 22: 'Notes' });
  expectHeaders('F4 Shop', rows[2], { 7: 'Item', 18: 'Other', 19: 'Total gold value' });
  const sections = [{ name: 'Royal Crystal packs', note: null, packs: [] }];
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (row[1] && squash(row[7]) !== 'Quantity') {
      sections.push({ name: squash(row[1]), note: text(row[3]), packs: [] });
      continue;
    }
    if (!row[1]) continue;
    const goldRow = squash(rows[i + 1]?.[7]) === 'Gold value' ? rows[i + 1] : [];
    const contents = F4_ITEMS.map((key, j) => ({ key, quantity: num(row[8 + j]), gold: num(goldRow[8 + j]) })).filter((c) => c.quantity !== null);
    sections[sections.length - 1].packs.push({
      name: squash(row[1]),
      availability: text(row[3]),
      usd: num(row[4]),
      royalCrystals: num(row[5]),
      goldCost: num(row[6]),
      contents,
      otherGold: num(goldRow[18]),
      totalGold: num(row[19]),
      efficiency: num(row[20]),
      efficiencyNoShards: num(row[21]),
      notes: text(row[22]),
    });
  }
  return sections;
}

// --------------------------------------------------------------------- main
const data = {
  source: 'https://docs.google.com/spreadsheets/d/1YQpWt8iOK6yO5_7r3rvZZKkoRy8Z0aEAPHy11gYZZQ8',
  ...buildRaids(),
  chaos: buildChaos(),
  guardians: buildGuardians(),
  market: buildMarket(),
  mari: buildMari(),
  f4: buildF4(),
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(data, null, 2) + '\n');
console.log(
  `Wrote ${outFile.replace(root + '/', '')}: ${data.raids.length} raids (${data.raids.reduce((s, r) => s + r.modes.length, 0)} modes), ` +
    `${data.chaos.length} chaos rows, ${data.guardians.length} guardians, ${data.market.listings.length} market listings, ` +
    `${data.mari.length} Mari deals, ${data.f4.reduce((s, x) => s + x.packs.length, 0)} F4 packs.`
);
