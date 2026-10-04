import clsx from 'clsx';
import type { ReactNode } from 'react';
import { fmt, shortTier, tierClass } from '@/lib/format';

export function ItemIcon({ src, label, size = 20, className }: { src: string; label: string; size?: number; className?: string }) {
  return (
    <img
      src={src}
      alt={label}
      title={label}
      width={size}
      height={size}
      loading="lazy"
      className={clsx('inline-block shrink-0 rounded-[4px] object-contain', className)}
    />
  );
}

export function GoldIcon({ size = 16, className }: { size?: number; className?: string }) {
  return <ItemIcon src="/icons/gold.png" label="Gold" size={size} className={className} />;
}

const GOLD_TONES = { gold: 'text-gold-300', light: 'text-ink-200', muted: 'text-ink-300', bad: 'text-bad' } as const;

export function Gold({
  value,
  className,
  size = 16,
  tone = 'gold',
}: {
  value: number | null | undefined;
  className?: string;
  size?: number;
  tone?: keyof typeof GOLD_TONES;
}) {
  if (value === null || value === undefined) return <span className="text-ink-600">—</span>;
  return (
    <span className={clsx('num inline-flex items-center gap-1 font-semibold', GOLD_TONES[tone], className)}>
      {fmt(value)}
      <GoldIcon size={size} />
    </span>
  );
}

export function TierBadge({ tier, className }: { tier: string | null | undefined; className?: string }) {
  if (!tier) return null;
  return <span className={clsx('chip', tierClass(tier), className)}>{shortTier(tier)}</span>;
}

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow?: string; title: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">{title}</h1>
        {children && <div className="mt-2 max-w-3xl text-sm text-ink-400">{children}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Section({ title, subtitle, children, className, actions }: { title: ReactNode; subtitle?: ReactNode; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={clsx('card overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-800 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink-100">{title}</h2>
          {subtitle && <p className="text-xs text-ink-400">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Stat({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="card px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <div className="mt-1 text-xl font-semibold text-ink-100">{children}</div>
      {hint && <p className="mt-0.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

export function Tabs<T extends string>({ value, options, onChange, className }: { value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void; className?: string }) {
  return (
    <div role="tablist" className={clsx('flex flex-wrap gap-1 rounded-xl border border-ink-800 bg-ink-900 p-1', className)}>
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={o.value === value} onClick={() => onChange(o.value)} className={clsx('tab', o.value === value && 'tab-active')}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Horizontal bar used for efficiency / value percentages. 100% sits at the marker. */
export function PctBar({ value, max = 200 }: { value: number | null; max?: number }) {
  if (value === null) return <span className="text-ink-600">—</span>;
  const width = Math.min(100, (value / max) * 100);
  const good = value >= 100;
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-ink-800">
        <div className={clsx('h-full rounded-full', good ? 'bg-good/80' : 'bg-bad/70')} style={{ width: `${width}%` }} />
        <div className="absolute inset-y-0 w-px bg-ink-400" style={{ left: `${(100 / max) * 100}%` }} />
      </div>
      <span className={clsx('num text-xs font-semibold', good ? 'text-good' : 'text-bad')}>{fmt(value)}%</span>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="px-4 py-10 text-center text-sm text-ink-500">{children}</div>;
}
