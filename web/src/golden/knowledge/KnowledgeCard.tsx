/**
 * KnowledgeCard — a pure, presentation-only view of one educational entity.
 * It renders any KnowledgeEntity from data (adaptive sections, illustration with
 * expand, facts/properties/tags, related concepts, lesson references, continue).
 * Navigation history lives in the Context Panel: related entities are opened via
 * `onOpenEntity`, and the panel provides back/forward/close. Fully subject-agnostic.
 */
import { useEffect, useRef, useState } from 'react';
import { Brain, BookOpen, Lightbulb, ListChecks, Tag, Network, MapPin, ArrowRight, Image as ImageIcon, Share2, Maximize2 } from 'lucide-react';
import type { Concept } from '../schema';
import { KNOWLEDGE_ENTITIES } from './entities';
import { ImageExplorer } from '../image/ImageExplorer';
import { V } from '../visual/tokens';

function emitCard(type: string, entityId: string) {
  try { window.dispatchEvent(new CustomEvent('chemverse:card', { detail: { type, entityId } })); } catch { /* ignore */ }
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className={`mb-1 flex items-center gap-1.5 ${V.sectionLabel}`}>
        <span className="text-primary">{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}

export function KnowledgeCard({ entityId, concepts, onOpenEntity, onNavigateConcept }: {
  entityId: string;
  concepts: Concept[];
  onOpenEntity: (entityId: string) => void;
  onNavigateConcept: (conceptId: string) => void;
}) {
  const [imgOpen, setImgOpen] = useState(false);
  const shownRef = useRef<string | undefined>(undefined);
  useEffect(() => { if (entityId && entityId !== shownRef.current) { shownRef.current = entityId; emitCard('knowledge_card_opened', entityId); } }, [entityId]);

  const entity = KNOWLEDGE_ENTITIES[entityId];
  const share = () => { try { void navigator.clipboard?.writeText(`${location.origin}${location.pathname}#card=${entityId}`).catch(() => {}); } catch { /* ignore */ } emitCard('knowledge_card_shared', entityId); };
  const expandImage = () => { setImgOpen(true); emitCard('image_expanded', entityId); };

  if (!entity) {
    return <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground" data-card-state="empty">Անհայտ միավոր՝ «{entityId}»։</div>;
  }

  const related = (entity.relatedEntities ?? []).map((id) => KNOWLEDGE_ENTITIES[id]).filter((e): e is NonNullable<typeof e> => !!e);
  const appearsIn = (entity.lessonReferences ?? [])
    .map((r) => ({ ...r, concept: concepts.find((c) => c.id === r.conceptId) }))
    .filter((r): r is typeof r & { concept: Concept } => !!r.concept);
  const nextEntity = related[0];
  const nextRef = appearsIn[0];

  return (
    <div key={entity.id} className="min-h-0 flex-1 space-y-4 overflow-auto p-3 animate-in fade-in-0 slide-in-from-right-2 duration-200 motion-reduce:animate-none" data-card-state="ready">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">{entity.type}</span>
          <h3 className="line-clamp-1 flex-1 text-base font-semibold text-foreground">{entity.name}</h3>
          <button type="button" onClick={share} aria-label="Կիսվել" className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><Share2 className="size-4" /></button>
        </div>
        {entity.subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{entity.subtitle}</p>}
      </div>

      <Section title="Սահմանում" icon={<BookOpen className="size-3.5" />}>
        <p className="text-sm leading-relaxed text-foreground/90">{entity.definition}</p>
      </Section>

      {entity.image && (
        <Section title="Պատկեր" icon={<ImageIcon className="size-3.5" />}>
          <button type="button" onClick={expandImage} className="group relative block w-full overflow-hidden rounded-md border bg-background/40" aria-label="Խոշորացնել պատկերը">
            <img src={entity.image.src} alt={entity.image.alt} className="w-full object-contain" />
            <span className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"><Maximize2 className="size-3" /> Խոշорацнel</span>
          </button>
        </Section>
      )}

      {entity.facts && entity.facts.length > 0 && (
        <Section title="Հիմնական փաստեր" icon={<Lightbulb className="size-3.5" />}>
          <ul className="space-y-1 text-sm text-foreground/90">
            {entity.facts.map((f, i) => (<li key={i} className="flex items-start gap-1.5"><span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />{f}</li>))}
          </ul>
        </Section>
      )}

      {entity.keyProperties && entity.keyProperties.length > 0 && (
        <Section title="Հիմնական հատկություններ" icon={<ListChecks className="size-3.5" />}>
          <dl className="space-y-1 text-sm">
            {entity.keyProperties.map((p) => (<div key={p.label} className="flex justify-between gap-2"><dt className="text-muted-foreground">{p.label}</dt><dd className="text-right font-medium text-foreground/90">{p.value}</dd></div>))}
          </dl>
        </Section>
      )}

      {entity.tags && entity.tags.length > 0 && (
        <Section title="Պիտակներ" icon={<Tag className="size-3.5" />}>
          <div className="flex flex-wrap gap-1.5">{entity.tags.map((t) => (<span key={t} className="rounded-full bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>))}</div>
        </Section>
      )}

      {related.length > 0 && (
        <Section title="Կապակցված հասկացություններ" icon={<Network className="size-3.5" />}>
          <div className="flex flex-wrap gap-1.5">
            {related.map((re) => (<button key={re.id} type="button" onClick={() => onOpenEntity(re.id)} className="rounded-full border bg-secondary/40 px-2.5 py-1 text-xs hover:bg-secondary">{re.name}</button>))}
          </div>
        </Section>
      )}

      {appearsIn.length > 0 && (
        <Section title="Հանդիպում է այս դասում" icon={<MapPin className="size-3.5" />}>
          <div className="space-y-0.5">
            {appearsIn.map((r) => (
              <button key={r.conceptId} type="button" onClick={() => onNavigateConcept(r.conceptId)} className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent">
                <Brain className="size-3.5 shrink-0 text-muted-foreground" /><span className="line-clamp-1 flex-1">{r.label ?? r.concept.metadata.title}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {(nextEntity || nextRef) && (
        <div className="border-t pt-3">
          {nextEntity ? (
            <button type="button" onClick={() => onOpenEntity(nextEntity.id)} className="flex w-full items-center justify-between gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/15">
              <span className="line-clamp-1">Շարունակել՝ {nextEntity.name}</span><ArrowRight className="size-4 shrink-0" />
            </button>
          ) : nextRef ? (
            <button type="button" onClick={() => onNavigateConcept(nextRef.conceptId)} className="flex w-full items-center justify-between gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/15">
              <span className="line-clamp-1">Անցնել դասում՝ {nextRef.label ?? nextRef.concept.metadata.title}</span><ArrowRight className="size-4 shrink-0" />
            </button>
          ) : null}
        </div>
      )}

      {imgOpen && entity.image && <ImageExplorer content={{ src: entity.image.src, altText: entity.image.alt, title: entity.name }} onClose={() => setImgOpen(false)} />}
    </div>
  );
}
