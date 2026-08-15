/**
 * ContextPanel — the constant panel shell. Its chrome never changes: a header
 * with shared back / forward / close navigation and a content area whose view is
 * resolved ENTIRELY from `context.type` via the registry. The panel owns no
 * content logic — it composes the engine (history/lifecycle) with the registered
 * views. Fully generic and subject-agnostic.
 */
import { memo } from 'react';
import { ChevronLeft, ChevronRight, X, Compass } from 'lucide-react';
import { CONTEXT_REGISTRY } from './registry';
import { V } from '../visual/tokens';
import type { ContextPanelController } from './useContextPanel';
import type { ContextData } from './types';

function ContextPanelImpl({ controller, data, navigateToConcept }: {
  controller: ContextPanelController;
  data: ContextData;
  navigateToConcept: (conceptId: string) => void;
}) {
  const { current, canBack, canForward, lifecycle, back, forward, close, openRelated } = controller;
  const View = current ? CONTEXT_REGISTRY[current.type] : null;
  const ctrl = 'flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30';

  return (
    <div className="flex h-full flex-col" data-panel-lifecycle={lifecycle} role="complementary" aria-label="Ուսումնական օգնական">
      <div className="flex shrink-0 items-center gap-1 border-b px-3 py-2">
        <button type="button" className={ctrl} onClick={back} disabled={!canBack} aria-label="Հետ"><ChevronLeft className="size-4" /></button>
        <button type="button" className={ctrl} onClick={forward} disabled={!canForward} aria-label="Առաջ"><ChevronRight className="size-4" /></button>
        <span className={`ml-1 flex-1 ${V.sectionLabel}`}>Ուսումնական օգնական</span>
        {current && <button type="button" className={ctrl} onClick={close} aria-label="Փակել"><X className="size-4" /></button>}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {current && View ? (
          <View ctx={current} data={data} openRelated={openRelated} navigateToConcept={navigateToConcept} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Compass className="size-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Ընտրի՛ր տարր դասից՝ այն այստեղ ուսումնասիրելու համար։</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const ContextPanel = memo(ContextPanelImpl);
