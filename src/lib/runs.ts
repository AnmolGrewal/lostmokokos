/**
 * Raid runs with per-gate difficulty.
 *
 * After clearing a gate you can carry on at the same difficulty or drop to any lower one
 * (e.g. Hard G1 → Normal G2 → Solo G3), but never go back up. Solo / Matching count as the lowest
 * difficulty, so a run can drop into them but a run that starts there stays there.
 *
 * A run is stored as one mode slug per gate (`null` = that gate isn't done). Gates are cleared in
 * order, so everything after a `null` is `null` too.
 */
import { isAltEntry, modeSlug, sheet, type Gate, type Raid, type RaidMode } from '@/data/sheet';

export type RunModes = (string | null)[];

export interface RunGate {
  index: number;
  mode: RaidMode;
  gate: Gate;
}
export interface RunSummary {
  gates: RunGate[];
  total: number;
  tradable: number;
  rosterBound: number;
  characterBound: number;
  bound: number;
  chestCost: number;
  mixed: boolean;
  label: string;
}

export const gateGold = (g: Gate) => (g.clear.gold ?? 0) + (g.clear.rosterBoundGold ?? 0) + (g.clear.characterBoundGold ?? 0);
const gateIlvl = (mode: RaidMode, i: number) => mode.gates[i]?.itemLevel ?? mode.itemLevel ?? 0;

/** Most gates any difficulty of this raid has. */
export const gateCount = (raid: Raid) => Math.max(...raid.modes.map((m) => m.gates.length));

/**
 * Every difficulty, hardest first: regular ones by item level (higher = harder), then Solo /
 * Matching at the bottom. Pass `includeAlt: false` to leave Solo / Matching out.
 */
export function difficultyLadder(raid: Raid, opts: { includeAlt?: boolean } = {}): RaidMode[] {
  const rank = (m: RaidMode) => (isAltEntry(m.difficulty) ? 1 : 0);
  return raid.modes
    .filter((m) => opts.includeAlt !== false || !isAltEntry(m.difficulty))
    .map((m, i) => ({ m, i }))
    .sort((a, b) => rank(a.m) - rank(b.m) || (b.m.itemLevel ?? 0) - (a.m.itemLevel ?? 0) || a.i - b.i)
    .map(({ m }) => m);
}

const findMode = (raid: Raid, slug: string | null | undefined) => (slug ? raid.modes.find((m) => modeSlug(m.difficulty) === slug) : undefined);

/**
 * Difficulties you can pick for gate `index`, hardest first, given the previous gate's pick.
 * `itemLevel` (optional) hides gates you're not geared for.
 */
export function gateChoices(raid: Raid, index: number, prev: string | null | undefined, itemLevel?: number): RaidMode[] {
  const ok = (m: RaidMode) => index < m.gates.length && (itemLevel === undefined || gateIlvl(m, index) <= itemLevel);
  const ladder = difficultyLadder(raid);
  if (index === 0) return ladder.filter(ok);
  const prevMode = findMode(raid, prev);
  if (!prevMode) return []; // previous gate not done → can't continue
  return ladder.slice(ladder.indexOf(prevMode)).filter(ok);
}

/** Every gate at one difficulty. */
export function uniformRun(raid: Raid, slug: string): RunModes {
  const mode = findMode(raid, slug);
  return Array.from({ length: gateCount(raid) }, (_, i) => (mode && i < mode.gates.length ? slug : null));
}

/**
 * Make a run valid: keep each pick if it's still allowed, otherwise use the closest allowed
 * difficulty (same or the next one down). A `null` ends the run.
 */
export function normalizeRun(raid: Raid, modes: RunModes, itemLevel?: number): RunModes {
  const out: RunModes = [];
  let ended = false;
  for (let i = 0; i < gateCount(raid); i++) {
    const wanted = modes[i];
    if (ended || wanted === null) {
      out.push(null);
      ended = true;
      continue;
    }
    const choices = gateChoices(raid, i, out[i - 1], itemLevel);
    if (!choices.length) {
      out.push(null);
      ended = true;
      continue;
    }
    const keep = choices.find((m) => modeSlug(m.difficulty) === wanted);
    if (keep) {
      out.push(wanted ?? null);
      continue;
    }
    // Nearest allowed difficulty at or below what was wanted (falls back to the easiest allowed).
    const ladder = difficultyLadder(raid);
    const wantedMode = findMode(raid, wanted);
    const wantedRank = wantedMode ? ladder.indexOf(wantedMode) : -1;
    const below = wantedRank >= 0 ? choices.find((m) => ladder.indexOf(m) >= wantedRank) : undefined;
    out.push(modeSlug((below ?? choices[0]).difficulty));
  }
  return out;
}

export function summarizeRun(raid: Raid, modes: RunModes): RunSummary {
  const gates: RunGate[] = [];
  modes.forEach((slug, index) => {
    const mode = findMode(raid, slug);
    const gate = mode?.gates[index];
    if (mode && gate) gates.push({ index, mode, gate });
  });
  const sum = (f: (g: Gate) => number | null) => gates.reduce((s, x) => s + (f(x.gate) ?? 0), 0);
  const rosterBound = sum((g) => g.clear.rosterBoundGold);
  const characterBound = sum((g) => g.clear.characterBoundGold);
  return {
    gates,
    total: sum(gateGold),
    tradable: sum((g) => g.clear.gold),
    rosterBound,
    characterBound,
    bound: rosterBound + characterBound,
    chestCost: sum((g) => g.chest.cost),
    mixed: new Set(gates.map((g) => g.mode.difficulty)).size > 1,
    label: runLabel(gates),
  };
}

/** "Hard" or "Hard G1–2 → Normal G3 → Solo G4". */
function runLabel(gates: RunGate[]): string {
  if (!gates.length) return 'Not planned';
  const groups: { difficulty: string; from: number; to: number }[] = [];
  for (const g of gates) {
    const last = groups[groups.length - 1];
    if (last && last.difficulty === g.mode.difficulty) last.to = g.index;
    else groups.push({ difficulty: g.mode.difficulty, from: g.index, to: g.index });
  }
  if (groups.length === 1) {
    const g = groups[0];
    const full = g.from === 0 && g.to === gates[gates.length - 1].mode.gates.length - 1;
    return full ? g.difficulty : `${g.difficulty} G${g.from + 1}${g.to > g.from ? `–${g.to + 1}` : ''}`;
  }
  return groups.map((g) => `${g.difficulty} G${g.from + 1}${g.to > g.from ? `–${g.to + 1}` : ''}`).join(' → ');
}

/**
 * Highest-gold run of a raid at an item level, mixing difficulties where that pays more
 * (e.g. Hard for the gates you're geared for, Normal for the rest).
 */
export function bestRun(raid: Raid, itemLevel: number, opts: { includeAlt?: boolean } = {}): RunModes | null {
  // Solo / Matching pay the same as Normal, so they only matter when explicitly included.
  const ladder = difficultyLadder(raid, { includeAlt: !!opts.includeAlt });
  const n = gateCount(raid);
  const memo = new Map<string, { gold: number; picks: RunModes }>();
  // best(i, r): best gold from gate i onward when gate i may use ladder[r..] (r = hardest allowed).
  const best = (i: number, r: number): { gold: number; picks: RunModes } => {
    if (i >= n) return { gold: 0, picks: [] };
    const key = `${i}:${r}`;
    const cached = memo.get(key);
    if (cached) return cached;
    let result: { gold: number; picks: RunModes } = { gold: 0, picks: Array(n - i).fill(null) };
    for (let k = r; k < ladder.length; k++) {
      const m = ladder[k];
      if (i >= m.gates.length || gateIlvl(m, i) > itemLevel) continue;
      const rest = best(i + 1, k);
      const gold = gateGold(m.gates[i]) + rest.gold;
      if (gold > result.gold) result = { gold, picks: [modeSlug(m.difficulty), ...rest.picks] };
    }
    memo.set(key, result);
    return result;
  };
  const winner = best(0, 0);
  return winner.gold > 0 ? winner.picks : null;
}

export interface PlannedRun {
  raid: Raid;
  modes: RunModes;
  summary: RunSummary;
}

/** Best `count` raids for an item level, one run per raid, most gold first. */
export function bestRunsFor(itemLevel: number, count = 3, opts: { includeAlt?: boolean } = {}): PlannedRun[] {
  return sheet.raids
    .map((raid) => {
      const modes = bestRun(raid, itemLevel, opts);
      return modes ? { raid, modes, summary: summarizeRun(raid, modes) } : null;
    })
    .filter((x): x is PlannedRun => x !== null)
    .sort((a, b) => b.summary.total - a.summary.total)
    .slice(0, count);
}

/** Link to a raid page showing the run's first difficulty. */
export const runHref = (run: PlannedRun) => `/raids/${run.raid.slug}?mode=${run.modes[0] ?? ''}`;
