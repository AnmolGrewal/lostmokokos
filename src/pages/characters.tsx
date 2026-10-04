import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Seo from '@/components/Seo';
import { Empty, Gold, PageHeader, Stat, TierBadge } from '@/components/ui';
import { allModes, bestRaidsFor, findMode, modeSlug, sheet, type Gate, type RaidModeRef } from '@/data/sheet';
import { fmt } from '@/lib/format';
import { formatCountdown, lastWeeklyReset, nextWeeklyReset, useNow } from '@/lib/resets';
import { useStoredState } from '@/lib/useStoredState';

const GOLD_RAIDS_PER_CHARACTER = 3;

interface RaidPick {
  key: string; // raidSlug:modeSlug
  cleared: boolean[];
  chests: boolean[];
}
interface Character {
  id: string;
  name: string;
  itemLevel: number;
  raids: RaidPick[];
}
interface Roster {
  weekOf: number;
  characters: Character[];
}

const EMPTY: Roster = { weekOf: 0, characters: [] };
const uid = () => Math.random().toString(36).slice(2, 10);
const gateGold = (g: Gate) => (g.clear.gold ?? 0) + (g.clear.rosterBoundGold ?? 0) + (g.clear.characterBoundGold ?? 0);
const pickFor = (ref: RaidModeRef): RaidPick => ({ key: ref.key, cleared: ref.mode.gates.map(() => false), chests: ref.mode.gates.map(() => false) });

function pickStats(pick: RaidPick) {
  const ref = findMode(pick.key);
  if (!ref) return { potential: 0, earned: 0, spent: 0 };
  const gates = ref.mode.gates;
  return {
    potential: gates.reduce((s, g) => s + gateGold(g), 0),
    earned: gates.reduce((s, g, i) => s + (pick.cleared[i] ? gateGold(g) : 0), 0),
    spent: gates.reduce((s, g, i) => s + (pick.chests[i] ? (g.chest.cost ?? 0) : 0), 0),
  };
}

function characterStats(c: Character) {
  return c.raids.map(pickStats).reduce((a, b) => ({ potential: a.potential + b.potential, earned: a.earned + b.earned, spent: a.spent + b.spent }), { potential: 0, earned: 0, spent: 0 });
}

function RaidRow({ pick, itemLevel, onChange, onRemove }: { pick: RaidPick; itemLevel: number; onChange: (p: RaidPick) => void; onRemove: () => void }) {
  const ref = findMode(pick.key);
  if (!ref) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-bad/30 bg-bad/5 px-3 py-2 text-sm text-bad">
        This raid is no longer in the sheet.
        <button className="btn" onClick={onRemove}>
          Remove
        </button>
      </div>
    );
  }
  const { raid, mode } = ref;
  const modes = raid.modes.filter((m) => (m.itemLevel ?? 0) <= itemLevel || modeSlug(m.difficulty) === modeSlug(mode.difficulty));
  const stats = pickStats(pick);
  const toggle = (field: 'cleared' | 'chests', i: number) => onChange({ ...pick, [field]: pick[field].map((v, j) => (j === i ? !v : v)) });

  return (
    <div className="rounded-lg border border-ink-800 bg-ink-850/60 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/raids/${raid.slug}?mode=${modeSlug(mode.difficulty)}`} className="font-semibold text-ink-100 hover:text-gold-300">
          {raid.name}
        </Link>
        <TierBadge tier={mode.tier} />
        <select
          className="input py-1 text-xs"
          value={modeSlug(mode.difficulty)}
          aria-label={`${raid.name} difficulty`}
          onChange={(e) => {
            const next = findMode(`${raid.slug}:${e.target.value}`);
            if (next) onChange(pickFor(next));
          }}
        >
          {modes.map((m) => (
            <option key={m.difficulty} value={modeSlug(m.difficulty)}>
              {m.difficulty} ({m.itemLevel})
            </option>
          ))}
        </select>
        <span className="ml-auto text-xs text-ink-400">
          <Gold value={stats.earned} /> / {fmt(stats.potential)}
        </span>
        <button className="text-xs text-ink-500 hover:text-bad" onClick={onRemove} aria-label={`Remove ${raid.name}`}>
          ✕
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {mode.gates.map((g, i) => (
          <div key={g.gate} className={clsx('flex items-center gap-1 rounded-lg border px-2 py-1 text-xs', pick.cleared[i] ? 'border-good/40 bg-good/10' : 'border-ink-700')}>
            <label className="flex cursor-pointer items-center gap-1.5">
              <input type="checkbox" className="accent-emerald-500" checked={!!pick.cleared[i]} onChange={() => toggle('cleared', i)} />
              <span className="text-ink-200">{g.gate.replace('Gate ', 'G')}</span>
              <span className="num text-gold-300">{fmt(gateGold(g))}</span>
            </label>
            {g.chest.cost ? (
              <label className="ml-1 flex cursor-pointer items-center gap-1 border-l border-ink-700 pl-2 text-ink-400" title="Bought the bonus chest">
                <input type="checkbox" className="accent-amber-500" checked={!!pick.chests[i]} onChange={() => toggle('chests', i)} />
                chest <span className="num">−{fmt(g.chest.cost)}</span>
              </label>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCard({ c, onChange, onRemove }: { c: Character; onChange: (c: Character) => void; onRemove: () => void }) {
  const [adding, setAdding] = useState('');
  const stats = characterStats(c);
  const taken = new Set(c.raids.map((r) => r.key.split(':')[0]));
  const options = useMemo(() => {
    const seen = new Map<string, RaidModeRef>();
    for (const ref of allModes()) {
      if ((ref.mode.itemLevel ?? 0) > c.itemLevel || taken.has(ref.raid.slug)) continue;
      const cur = seen.get(ref.raid.slug);
      if (!cur || ref.mode.gold.total > cur.mode.gold.total) seen.set(ref.raid.slug, ref);
    }
    return [...seen.values()].sort((a, b) => b.mode.gold.total - a.mode.gold.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c.itemLevel, c.raids]);
  const full = c.raids.length >= GOLD_RAIDS_PER_CHARACTER;

  return (
    <article className="card flex flex-col gap-3 p-4">
      <header className="flex flex-wrap items-center gap-2">
        <input className="input min-w-0 flex-1 font-semibold" value={c.name} aria-label="Character name" onChange={(e) => onChange({ ...c, name: e.target.value })} />
        <input
          className="input w-24"
          type="number"
          inputMode="numeric"
          aria-label="Item level"
          value={c.itemLevel || ''}
          onChange={(e) => onChange({ ...c, itemLevel: Number(e.target.value) || 0 })}
        />
        <button className="btn text-xs" onClick={onRemove} aria-label={`Remove ${c.name}`}>
          Remove
        </button>
      </header>

      <div className="flex items-center justify-between text-xs text-ink-400">
        <span>
          Earned <Gold value={stats.earned} /> of {fmt(stats.potential)}
          {stats.spent ? <span className="text-bad"> · chests −{fmt(stats.spent)}</span> : null}
        </span>
        <button className="btn btn-primary text-xs" onClick={() => onChange({ ...c, raids: bestRaidsFor(c.itemLevel, GOLD_RAIDS_PER_CHARACTER).map(pickFor) })} disabled={!c.itemLevel}>
          Auto-pick top {GOLD_RAIDS_PER_CHARACTER}
        </button>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-ink-800">
        <div className="h-full rounded-full bg-gold-500" style={{ width: `${stats.potential ? (stats.earned / stats.potential) * 100 : 0}%` }} />
      </div>

      <div className="space-y-2">
        {c.raids.map((pick, i) => (
          <RaidRow
            key={pick.key}
            pick={pick}
            itemLevel={c.itemLevel}
            onChange={(p) => onChange({ ...c, raids: c.raids.map((r, j) => (j === i ? p : r)) })}
            onRemove={() => onChange({ ...c, raids: c.raids.filter((_, j) => j !== i) })}
          />
        ))}
        {!c.raids.length && <p className="text-sm text-ink-500">No raids yet — auto-pick or add one below.</p>}
      </div>

      {!full && (
        <div className="flex gap-2">
          <select className="input flex-1 text-sm" value={adding} onChange={(e) => setAdding(e.target.value)} aria-label="Add raid">
            <option value="">{options.length ? 'Add a raid…' : 'No more raids at this item level'}</option>
            {options.map((o) => (
              <option key={o.key} value={o.key}>
                {o.raid.name} — {o.mode.difficulty} ({fmt(o.mode.gold.total)}g)
              </option>
            ))}
          </select>
          <button
            className="btn"
            disabled={!adding}
            onClick={() => {
              const ref = findMode(adding);
              if (ref) onChange({ ...c, raids: [...c.raids, pickFor(ref)] });
              setAdding('');
            }}
          >
            Add
          </button>
        </div>
      )}
    </article>
  );
}

export default function CharactersPage() {
  const [roster, setRoster, loaded] = useStoredState<Roster>('lm.roster.v1', EMPTY);
  const [name, setName] = useState('');
  const [ilvl, setIlvl] = useState('');
  const now = useNow();

  // Wipe weekly checkmarks after the Wednesday reset.
  useEffect(() => {
    if (!loaded || !now) return;
    const week = lastWeeklyReset(now).getTime();
    if (roster.weekOf !== week) {
      setRoster((r) => ({
        weekOf: week,
        characters: r.characters.map((c) => ({ ...c, raids: c.raids.map((p) => ({ ...p, cleared: p.cleared.map(() => false), chests: p.chests.map(() => false) })) })),
      }));
    }
  }, [loaded, now, roster.weekOf, setRoster]);

  const totals = roster.characters.map(characterStats).reduce((a, b) => ({ potential: a.potential + b.potential, earned: a.earned + b.earned, spent: a.spent + b.spent }), { potential: 0, earned: 0, spent: 0 });

  const updateChar = (id: string, next: Character) => setRoster((r) => ({ ...r, characters: r.characters.map((c) => (c.id === id ? next : c)) }));
  const addChar = () => {
    const itemLevel = Number(ilvl) || 0;
    setRoster((r) => ({
      ...r,
      characters: [...r.characters, { id: uid(), name: name.trim() || `Character ${r.characters.length + 1}`, itemLevel, raids: itemLevel ? bestRaidsFor(itemLevel, GOLD_RAIDS_PER_CHARACTER).map(pickFor) : [] }],
    }));
    setName('');
    setIlvl('');
  };

  return (
    <>
      <Seo title="Roster gold tracker" description="Track weekly Lost Ark raid gold across your roster. Checkmarks reset every Wednesday." />
      <PageHeader eyebrow={sheet.lastUpdated ?? 'Weekly'} title="Roster gold tracker">
        Add your characters, pick up to {GOLD_RAIDS_PER_CHARACTER} gold raids each, and tick gates off as you clear them. Saved in this browser; checkmarks reset
        at the weekly reset{now ? ` (in ${formatCountdown(nextWeeklyReset(now).getTime() - now.getTime())})` : ''}.
      </PageHeader>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Earned this week">
          <Gold value={totals.earned} size={20} />
        </Stat>
        <Stat label="Still available">
          <Gold value={totals.potential - totals.earned} size={20} />
        </Stat>
        <Stat label="Spent on chests">
          <Gold value={totals.spent} size={20} tone="bad" />
        </Stat>
        <Stat label="Net" hint={`${roster.characters.length} character${roster.characters.length === 1 ? '' : 's'}`}>
          <Gold value={totals.earned - totals.spent} size={20} />
        </Stat>
      </div>

      <form
        className="card mb-6 flex flex-wrap items-end gap-3 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          addChar();
        }}
      >
        <label className="flex flex-1 flex-col gap-1 text-xs text-ink-400">
          Name
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mokoko Bard" />
        </label>
        <label className="flex w-32 flex-col gap-1 text-xs text-ink-400">
          Item level
          <input className="input" type="number" inputMode="numeric" value={ilvl} onChange={(e) => setIlvl(e.target.value)} placeholder="1720" />
        </label>
        <button className="btn btn-primary" type="submit">
          Add character
        </button>
      </form>

      {loaded && !roster.characters.length ? (
        <div className="card">
          <Empty>Your roster is empty. Add a character above — their best {GOLD_RAIDS_PER_CHARACTER} raids are picked automatically.</Empty>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {roster.characters.map((c) => (
            <CharacterCard key={c.id} c={c} onChange={(next) => updateChar(c.id, next)} onRemove={() => setRoster((r) => ({ ...r, characters: r.characters.filter((x) => x.id !== c.id) }))} />
          ))}
        </div>
      )}
    </>
  );
}
