import clsx from 'clsx';
import { Gold, PctBar, Section, TierBadge } from '@/components/ui';
import { modeSlug, type Raid } from '@/data/sheet';
import { fmt } from '@/lib/format';
import { usePrices } from '@/lib/PricesContext';
import { gateChoices, gateCount, gateGold, normalizeRun, summarizeRun, type RunModes } from '@/lib/runs';

/** Difficulty picker for one gate; only offers the same or a lower difficulty than the gate before. */
export function GateSelect({
  raid,
  modes,
  index,
  itemLevel,
  onChange,
  className,
}: {
  raid: Raid;
  modes: RunModes;
  index: number;
  itemLevel?: number;
  onChange: (next: RunModes) => void;
  className?: string;
}) {
  const choices = gateChoices(raid, index, modes[index - 1], itemLevel);
  const value = modes[index] ?? '';
  const disabled = !choices.length && index > 0;
  return (
    <select
      className={clsx('input py-1 text-xs', className)}
      aria-label={`Gate ${index + 1} difficulty`}
      value={value}
      disabled={disabled}
      onChange={(e) => {
        const next = [...modes];
        next[index] = e.target.value || null;
        // Later gates keep their pick if still allowed, otherwise drop to the nearest one allowed.
        onChange(normalizeRun(raid, next, itemLevel));
      }}
    >
      {index > 0 && <option value="">{disabled ? 'Not available' : 'Skip'}</option>}
      {choices.map((m) => (
        <option key={m.difficulty} value={modeSlug(m.difficulty)}>
          {m.difficulty}
          {m.gates[index]?.itemLevel ? ` (${m.gates[index].itemLevel})` : ''}
        </option>
      ))}
    </select>
  );
}

/** Build a run gate by gate (e.g. Hard G1 → Normal G2) and see what it pays. */
export function RunPlanner({ raid, modes, onChange }: { raid: Raid; modes: RunModes; onChange: (m: RunModes) => void }) {
  const { gateValue } = usePrices();
  const summary = summarizeRun(raid, modes);
  const n = gateCount(raid);

  return (
    <Section
      title={
        <span className="flex items-center gap-2">
          Plan your run
          {summary.mixed && <span className="chip border-amber-500/40 bg-amber-500/10 text-amber-300">Mixed difficulty</span>}
        </span>
      }
      subtitle="Pick a difficulty per gate. After a gate you can stay or drop to a lower difficulty, never go back up."
    >
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Gate</th>
              <th>Difficulty</th>
              <th className="text-right">Gold</th>
              <th className="text-right">Bound</th>
              <th className="text-right">Chest cost</th>
              <th className="text-right">Chest value</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: n }, (_, i) => {
              const g = summary.gates.find((x) => x.index === i);
              const value = g ? gateValue(g.gate, g.mode.tier).atItemLevel : null;
              return (
                <tr key={i} className={clsx(!g && 'opacity-50')}>
                  <td className="text-ink-200">Gate {i + 1}</td>
                  <td>
                    <span className="flex items-center gap-2">
                      <GateSelect raid={raid} modes={modes} index={i} onChange={onChange} />
                      {g && <TierBadge tier={g.mode.tier} />}
                    </span>
                  </td>
                  <td className="text-right">{g ? <Gold value={gateGold(g.gate)} /> : <span className="text-ink-700">—</span>}</td>
                  <td className="text-right">
                    {g ? <Gold value={(g.gate.clear.rosterBoundGold ?? 0) + (g.gate.clear.characterBoundGold ?? 0) || null} tone="muted" /> : null}
                  </td>
                  <td className="text-right">{g ? <Gold value={g.gate.chest.cost} tone="bad" /> : null}</td>
                  <td>
                    <div className="flex justify-end">{g ? <PctBar value={value} max={600} /> : null}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="[&>td]:border-t [&>td]:border-ink-700 [&>td]:bg-ink-850/60 [&>td]:px-3 [&>td]:py-2">
              <td className="text-xs font-semibold uppercase tracking-wide text-ink-400">Total</td>
              <td className="text-sm text-ink-300">{summary.label}</td>
              <td className="text-right">
                <Gold value={summary.total} />
              </td>
              <td className="text-right">
                <Gold value={summary.bound || null} tone="muted" />
              </td>
              <td className="text-right">
                <Gold value={summary.chestCost || null} tone="bad" />
              </td>
              <td className="text-right text-xs text-ink-500">{summary.tradable ? `${fmt(summary.tradable)} tradable` : null}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Section>
  );
}
