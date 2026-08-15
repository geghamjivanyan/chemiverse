/**
 * InteractionRenderer — the Interaction Engine's entry point. It resolves an
 * interaction to its component using ONLY `interaction.type` (registry lookup) and
 * renders it. Unknown types fall back to a safe notice instead of crashing. This
 * is the single path through which every learner interaction is rendered.
 */
import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { INTERACTION_REGISTRY } from './registry';
import type { Interaction } from './types';

function UnknownInteraction({ type }: { type: string }) {
  return (
    <div className="rounded-md border border-dashed border-amber-500/40 bg-amber-500/[0.06] px-3 py-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-2"><AlertTriangle className="size-4 shrink-0 text-amber-500" /> Անհայտ ինտերակցիա՝ «{type}»</span>
    </div>
  );
}

function InteractionRendererImpl({ interaction }: { interaction: Interaction }) {
  const View = INTERACTION_REGISTRY[interaction.type];
  if (!View) return <UnknownInteraction type={interaction.type} />;
  return <View i={interaction} />;
}

export const InteractionRenderer = memo(InteractionRendererImpl);
