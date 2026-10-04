import { useMemo } from 'react';
import Seo from '@/components/Seo';
import { Gold, ItemIcon, PageHeader, Section, TierBadge } from '@/components/ui';
import { DAILY_ICONS } from '@/data/rewards';
import { sheet } from '@/data/sheet';
import { fmt } from '@/lib/format';

const Head = ({ k }: { k: keyof typeof DAILY_ICONS }) => (
  <th className="text-right">
    <span className="inline-flex items-center justify-end gap-1.5">
      <ItemIcon src={DAILY_ICONS[k].icon} label={DAILY_ICONS[k].label} size={20} />
      <span className="hidden 2xl:inline">{DAILY_ICONS[k].label}</span>
    </span>
  </th>
);

const Val = ({ v }: { v: number | string | null }) => <td className="num text-right text-ink-100">{v === null ? <span className="text-ink-700">—</span> : typeof v === 'number' ? fmt(v) : v}</td>;

export default function DailyPage() {
  const chaosGroups = useMemo(() => {
    const groups: { type: string; rows: typeof sheet.chaos }[] = [];
    for (const row of sheet.chaos) {
      const g = groups.find((x) => x.type === row.type);
      if (g) g.rows.push(row);
      else groups.push({ type: row.type, rows: [row] });
    }
    return groups;
  }, []);

  return (
    <>
      <Seo title="Daily content" description="Lost Ark Chaos Rift, Kurzan Front, Chaos Dungeon and Guardian Raid rewards with market value." />
      <PageHeader eyebrow="Dailies" title="Chaos & Guardian raids">
        Clear rewards per run and their market value. Rested runs (using rest bonus) are worth double.
      </PageHeader>

      <div className="space-y-6">
        {chaosGroups.map((g) => {
          const hasMats = g.rows.some((r) => r.destructionStones !== null);
          return (
            <Section key={g.type} title={g.type} subtitle={hasMats ? 'Per run · market value uses current market prices' : 'Silver per run'}>
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Continent</th>
                      <th className="text-right">iLvl</th>
                      {hasMats && (
                        <>
                          <Head k="destructionStones" />
                          <Head k="guardianStones" />
                          <Head k="leapstones" />
                          <Head k="shards" />
                        </>
                      )}
                      <Head k="silver" />
                      {hasMats && (
                        <>
                          <th className="text-right">Value</th>
                          <th className="text-right">Rested value</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((r) => (
                      <tr key={`${r.continent}-${r.itemLevel}`}>
                        <td>
                          <TierBadge tier={r.tier} />
                        </td>
                        <td className="text-ink-200">{r.continent}</td>
                        <td className="num text-right text-ink-300">{r.itemLevel}</td>
                        {hasMats && (
                          <>
                            <Val v={r.destructionStones} />
                            <Val v={r.guardianStones} />
                            <Val v={r.leapstones} />
                            <Val v={r.shards} />
                          </>
                        )}
                        <Val v={r.silver} />
                        {hasMats && (
                          <>
                            <td className="text-right">
                              <Gold value={r.valueNormal} />
                            </td>
                            <td className="text-right">
                              <Gold value={r.valueRested} />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          );
        })}

        <Section title="Guardian raids" subtitle="Ranges are per clear. Gem columns show Lv. 1 gems (fractions are averages).">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Guardian</th>
                  <th className="text-right">iLvl</th>
                  <Head k="silver" />
                  <Head k="gemsT4" />
                  <Head k="gemsT3" />
                  <Head k="abilityStones" />
                  <Head k="bracelets" />
                  <Head k="fragments" />
                  <Head k="accessories" />
                  <th>Accessory grade</th>
                </tr>
              </thead>
              <tbody>
                {sheet.guardians.map((r) => (
                  <tr key={`${r.name}-${r.itemLevel}`}>
                    <td>
                      <TierBadge tier={r.tier} />
                    </td>
                    <td className="font-medium text-ink-100">{r.name}</td>
                    <td className="num text-right text-ink-300">{r.itemLevel}</td>
                    <Val v={r.silver} />
                    <Val v={r.gemsT4} />
                    <Val v={r.gemsT3} />
                    <Val v={r.abilityStones} />
                    <Val v={r.bracelets} />
                    <Val v={r.fragments} />
                    <Val v={r.accessories} />
                    <td className="text-ink-300">{r.accessoryGrade ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </>
  );
}
