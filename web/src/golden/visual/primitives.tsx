/**
 * Visual Language primitives — shared wrappers that turn a semantic role into a
 * consistent appearance. Blocks and screens compose these instead of repeating
 * Tailwind class strings, so the same meaning always looks the same everywhere.
 */
import type { ReactNode } from 'react';
import { CALLOUT, SEMANTIC_ICON, V, type CalloutVariant } from './tokens';

/** Uppercase muted section label used by cards, callouts and panels. */
export function SectionLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${V.sectionLabel}${className ? ` ${className}` : ''}`}>{children}</div>;
}

/** Semantic tinted callout (information / fact / warning / success / tip). */
export function Callout({ variant, children }: { variant: CalloutVariant; children: ReactNode }) {
  const s = CALLOUT[variant];
  const Icon = SEMANTIC_ICON[variant] ?? SEMANTIC_ICON.information;
  return (
    <div className={`flex gap-2 rounded-md border px-3 py-2 text-sm text-foreground/90 ${s.container}`}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${s.iconClass}`} />
      <span>{children}</span>
    </div>
  );
}

/** Standard surface card (rounded-xl border + subtle shadow). */
export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`${V.card}${className ? ` ${className}` : ''}`}>{children}</div>;
}
