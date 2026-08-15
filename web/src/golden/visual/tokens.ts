/**
 * Visual Language tokens — the single source of truth for the lesson's look.
 * Semantic meaning drives appearance: a block/screen never invents its own
 * colours, spacing or icons; it picks a semantic role here. Values reuse the
 * existing light-theme design tokens (no new palette, no redesign) so output is
 * unchanged — this only removes duplication.
 */
import { Info, Lightbulb, HelpCircle, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';

/** Shared class fragments — reused everywhere instead of retyping utilities. */
export const V = {
  sectionLabel: 'text-[11px] font-medium uppercase tracking-wide text-muted-foreground',
  card: 'rounded-xl border bg-card shadow-sm',
  surface: 'rounded-md border bg-card/40',
  heading: 'font-semibold tracking-tight text-foreground',
  body: 'text-[15px] leading-relaxed text-foreground/90',
  caption: 'text-xs text-muted-foreground',
  stack: 'space-y-3',
} as const;

/** One icon per semantic meaning — never mixed. */
export const SEMANTIC_ICON = {
  information: Info,
  fact: Lightbulb,
  warning: AlertTriangle,
  success: CheckCircle2,
  question: HelpCircle,
  definition: BookOpen,
  tip: Lightbulb,
} as const;

/** Semantic callout variants: colour role → tint + icon colour (colours unchanged). */
export const CALLOUT = {
  information: { container: 'border-primary/30 bg-primary/10', iconClass: 'text-primary' },
  fact: { container: 'border-amber-500/30 bg-amber-500/10', iconClass: 'text-amber-500' },
  warning: { container: 'border-amber-500/40 bg-amber-500/[0.06]', iconClass: 'text-amber-500' },
  success: { container: 'border-emerald-500/40 bg-emerald-500/10', iconClass: 'text-emerald-600' },
  tip: { container: 'border-amber-500/30 bg-amber-500/[0.06]', iconClass: 'text-amber-500' },
} as const;

export type CalloutVariant = keyof typeof CALLOUT;
