/**
 * Context views — one component per family of context types, each pure
 * presentation. They reuse existing building blocks (KnowledgeCard, the block
 * companion, hotspot detail, AI context) rather than reimplementing them, and
 * navigate to related contexts through `openRelated`. Nothing here is
 * subject-specific — every view renders only the context data it receives.
 */
import { useState, type ReactNode } from 'react';
import { BookOpen, Sparkles, FlaskConical, Target, Network, ChevronDown, Compass, Crosshair, CornerUpRight } from 'lucide-react';
import type { Block, Concept } from '../schema';
import { KnowledgeCard } from '../knowledge/KnowledgeCard';
import { KNOWLEDGE_ENTITIES } from '../knowledge/entities';
import { V } from '../visual/tokens';
import type { ContextViewProps, Context } from './types';

function itemTitle(block: Block): string {
  switch (block.type) {
    case 'definition':
    case 'keyword': return block.content.term;
    case 'heading': return block.content.text;
    case 'formula': return block.content.formula;
    case 'diagram': return block.content.diagram;
    default: return block.type;
  }
}

function CollapsibleCard({ id, title, icon, open, onToggle, children }: {
  id: string; title: string; icon: ReactNode; open: boolean; onToggle: (id: string) => void; children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card/40">
      <button type="button" onClick={() => onToggle(id)} className="flex w-full items-center gap-1.5 px-3 py-2 text-left">
        <span className="text-primary">{icon}</span>
        <span className={`flex-1 ${V.sectionLabel}`}>{title}</span>
        <ChevronDown className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="border-t px-3 py-2 text-sm text-foreground/90">{children}</div>}
    </div>
  );
}

const Scroll = ({ id, children }: { id: string; children: ReactNode }) => (
  <div key={id} className="min-h-0 flex-1 space-y-2 overflow-auto p-3 animate-in fade-in-0 slide-in-from-right-2 duration-200 motion-reduce:animate-none">{children}</div>
);

const Label = ({ children }: { children: ReactNode }) => <div className={`mb-1 ${V.sectionLabel}`}>{children}</div>;

/** context.type = knowledge_card */
export function KnowledgeCardView({ ctx, data, openRelated, navigateToConcept }: ContextViewProps) {
  return (
    <KnowledgeCard entityId={ctx.ref ?? ''} concepts={data.concepts}
      onOpenEntity={(id) => openRelated({ type: 'knowledge_card', ref: id })}
      onNavigateConcept={navigateToConcept} />
  );
}

/** context.type = keyword | definition | formula | fact (block companion) */
export function CompanionView({ ctx, data, navigateToConcept }: ContextViewProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  const isOpen = (id: string) => !collapsed[id];
  const block = data.blocks.find((b) => b.id === ctx.ref);
  if (!block) return <Scroll id="none"><p className="text-xs text-muted-foreground">Բլոկը չի գտնվել։</p></Scroll>;
  const c = block.companion ?? {};
  const related = (c.relatedConceptIds ?? []).map((id) => data.concepts.find((x) => x.id === id)).filter((x): x is Concept => !!x);
  const hasAny = !!(c.summary || c.simpleExplanation || c.example || c.importance || related.length);
  return (
    <Scroll id={block.id}>
      <div className="flex items-center gap-2"><span className="rounded bg-secondary/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">{block.type}</span><span className="line-clamp-1 text-sm font-semibold text-foreground">{itemTitle(block)}</span></div>
      {c.summary && <CollapsibleCard id="summary" title="Ամփոփում" icon={<BookOpen className="size-3.5" />} open={isOpen('summary')} onToggle={toggle}>{c.summary}</CollapsibleCard>}
      {c.simpleExplanation && <CollapsibleCard id="simple" title="Պարզ բացատրություն" icon={<Sparkles className="size-3.5" />} open={isOpen('simple')} onToggle={toggle}>{c.simpleExplanation}</CollapsibleCard>}
      {c.example && <CollapsibleCard id="example" title="Օրինակ կյանքից" icon={<FlaskConical className="size-3.5" />} open={isOpen('example')} onToggle={toggle}>{c.example}</CollapsibleCard>}
      {c.importance && <CollapsibleCard id="importance" title="Ինչու՞ է կարևոր" icon={<Target className="size-3.5" />} open={isOpen('importance')} onToggle={toggle}>{c.importance}</CollapsibleCard>}
      {related.length > 0 && (
        <CollapsibleCard id="related" title="Կապակցված հասկացություններ" icon={<Network className="size-3.5" />} open={isOpen('related')} onToggle={toggle}>
          <div className="flex flex-wrap gap-1.5">{related.map((rc) => (<button key={rc.id} type="button" onClick={() => navigateToConcept(rc.id)} className="rounded-full border bg-secondary/40 px-2.5 py-1 text-xs hover:bg-secondary">{rc.metadata.title}</button>))}</div>
        </CollapsibleCard>
      )}
      {!hasAny && <p className="px-1.5 py-2 text-xs text-muted-foreground">Այս տարրի համար նշումներ դեռ չկան։</p>}
    </Scroll>
  );
}

interface HotspotData { id: string; title: string; description: string; relatedBlockId?: string; entityId?: string }

/** context.type = interactive_diagram | image_explorer (hotspot detail) */
export function HotspotView({ ctx, data, openRelated }: ContextViewProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  const isOpen = (id: string) => !collapsed[id];
  const h = ctx.data as HotspotData | undefined;
  if (!h) return <Scroll id="none"><p className="text-xs text-muted-foreground">—</p></Scroll>;
  const relatedBlock = h.relatedBlockId ? data.blocks.find((b) => b.id === h.relatedBlockId) : undefined;
  return (
    <Scroll id={h.id}>
      <div className="flex items-center gap-2"><span className="rounded bg-secondary/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">hotspot</span><span className="line-clamp-1 text-sm font-semibold text-foreground">{h.title}</span></div>
      <CollapsibleCard id="hs-desc" title="Նկարագրություն" icon={<Crosshair className="size-3.5" />} open={isOpen('hs-desc')} onToggle={toggle}>{h.description}</CollapsibleCard>
      {relatedBlock && (
        <CollapsibleCard id="hs-related" title="Կապակցված" icon={<CornerUpRight className="size-3.5" />} open={isOpen('hs-related')} onToggle={toggle}>
          <button type="button" onClick={() => openRelated(blockContext(relatedBlock))} className="rounded-full border bg-secondary/40 px-2.5 py-1 text-xs hover:bg-secondary">{itemTitle(relatedBlock)}</button>
        </CollapsibleCard>
      )}
    </Scroll>
  );
}

/** context.type = ai_context */
export function AiContextView({ data }: ContextViewProps) {
  const ai = data.aiContext;
  return (
    <Scroll id="ai">
      <div className="flex items-center gap-2"><Sparkles className="size-4 text-primary" /><span className="text-sm font-semibold text-foreground">Ի՞նչ է տեսնում օգնականը</span></div>
      <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-foreground/90">{ai.scope}</div>
      <div><Label>Դաս</Label><div className="text-sm font-medium text-foreground">{ai.lesson.title}</div><div className="text-xs text-muted-foreground">{ai.lesson.subject}{ai.lesson.grade ? ` · ${ai.lesson.grade}` : ''}</div></div>
      {ai.currentConcept && <div><Label>Ընթացիկ հասկացություն</Label><div className="text-sm text-foreground/90">{ai.currentConcept.title}</div>{ai.currentConcept.goal && <div className="text-xs text-muted-foreground">{ai.currentConcept.goal}</div>}</div>}
      {ai.selectedBlock && <div><Label>Ընտրված բլոկ</Label><div className="text-xs text-foreground/80">{ai.selectedBlock.summary}</div></div>}
      <div><Label>Աշակերտի պատմություն</Label><div className="text-xs text-muted-foreground">Առաջադրանքներ՝ {ai.studentHistory.activities.length}</div></div>
    </Scroll>
  );
}

/** context.type = related_concepts */
export function RelatedConceptsView({ ctx, data, openRelated, navigateToConcept }: ContextViewProps) {
  const ids = (ctx.data as { entityIds?: string[]; conceptIds?: string[] } | undefined) ?? {};
  const entities = (ids.entityIds ?? []).map((id) => KNOWLEDGE_ENTITIES[id]).filter(Boolean);
  const concepts = (ids.conceptIds ?? []).map((id) => data.concepts.find((c) => c.id === id)).filter((c): c is Concept => !!c);
  return (
    <Scroll id="related">
      <Label>Կապակցված հասկացություններ</Label>
      <div className="flex flex-wrap gap-1.5">
        {entities.map((e) => (<button key={e!.id} type="button" onClick={() => openRelated({ type: 'knowledge_card', ref: e!.id })} className="rounded-full border bg-secondary/40 px-2.5 py-1 text-xs hover:bg-secondary">{e!.name}</button>))}
        {concepts.map((c) => (<button key={c.id} type="button" onClick={() => navigateToConcept(c.id)} className="rounded-full border bg-secondary/40 px-2.5 py-1 text-xs hover:bg-secondary">{c.metadata.title}</button>))}
      </div>
    </Scroll>
  );
}

interface InfoData { title?: string; body?: string; relatedEntityIds?: string[] }

/** context.type = scientist_story | experiment | timeline | reflection (generic info) */
export function InfoView({ ctx, openRelated }: ContextViewProps) {
  const d = (ctx.data as InfoData | undefined) ?? {};
  const related = (d.relatedEntityIds ?? []).map((id) => KNOWLEDGE_ENTITIES[id]).filter(Boolean);
  return (
    <Scroll id={ctx.ref ?? ctx.type}>
      <div className="flex items-center gap-2"><Compass className="size-4 text-primary" /><span className="line-clamp-1 text-sm font-semibold text-foreground">{d.title ?? ctx.type}</span></div>
      {d.body && <p className="text-sm text-foreground/90">{d.body}</p>}
      {related.length > 0 && (
        <div><Label>Կապակցված</Label><div className="flex flex-wrap gap-1.5">{related.map((e) => (<button key={e!.id} type="button" onClick={() => openRelated({ type: 'knowledge_card', ref: e!.id })} className="rounded-full border bg-secondary/40 px-2.5 py-1 text-xs hover:bg-secondary">{e!.name}</button>))}</div></div>
      )}
    </Scroll>
  );
}

/** Build the right context for a block (keyword→card when it links an entity). */
export function blockContext(block: Block): Context {
  if (block.type === 'keyword' && block.content.entityId && KNOWLEDGE_ENTITIES[block.content.entityId]) {
    return { type: 'knowledge_card', ref: block.content.entityId };
  }
  const t = block.type === 'definition' ? 'definition' : block.type === 'formula' ? 'formula' : block.type === 'fact' ? 'fact' : 'keyword';
  return { type: t, ref: block.id };
}
