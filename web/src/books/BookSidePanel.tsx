import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { byZ, elements } from '@chemverse/shared';
import { ElementDetail } from '../periodic/ElementDetail';
import { MoleculeCanvas } from '../scene/MoleculeCanvas';
import type { MolGeo } from '../scene/Molecule';
import { fetchMolecule } from '../lab/api';
import type { AtomMode } from '../scene/Atom';
import { Formula } from '../lab/Formula';
import { useI18n } from '../i18n';
import { MATERIALS } from './hotspots';

/** Тело знаний: элемент → полная карточка; молекула → 3D-молекула; материал → инфо. Без контейнера/закрытия. */
export function KnowledgeBody({ matKey }: { matKey: string }) {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AtomMode>('bohr');
  const [mol, setMol] = useState<MolGeo | null>(null);
  const mat = MATERIALS[matKey];
  // ключ может быть символом элемента (Fe, Au…) или ключом материала
  const el = elements.find((e) => e.symbol === matKey) ?? (mat?.kind === 'element' && mat.z != null ? byZ.get(mat.z) ?? null : null);

  useEffect(() => {
    setMol(null);
    if (mat?.kind === 'molecule' && mat.formula) fetchMolecule(mat.formula).then((m) => setMol(m?.geometry ?? null)).catch(() => {});
  }, [matKey, mat]);

  if (el) return <ElementDetail element={el} mode={mode} onToggleMode={setMode} onExpand={() => navigate(`/app/element/${el.symbol}`)} />;
  if (!mat) return null;
  return (
    <div className="p-3">
      <h2 className="text-2xl font-semibold">{mat.name[locale]}</h2>
      <div className="text-sm text-muted-foreground">
        {mat.name.en}{mat.formula ? <> · <Formula f={mat.formula} /></> : null}
      </div>
      {mat.kind === 'molecule' ? (
        <div className="my-4 h-64 overflow-hidden rounded-xl border bg-background/40">
          {mol ? <MoleculeCanvas molecule={mol} /> : <div className="grid h-full place-items-center text-muted-foreground">…</div>}
        </div>
      ) : (
        <div className="my-4 grid h-40 place-items-center rounded-xl border bg-background/40 text-6xl">{mat.emoji}</div>
      )}
      <p className="text-[15px] leading-relaxed text-foreground/90">{mat.desc[locale]}</p>
    </div>
  );
}

/** Правая панель книги (старый ридер): тело знаний в контейнере с кнопкой закрытия. */
export function BookSidePanel({ matKey, onClose }: { matKey: string; onClose: () => void }) {
  return (
    <div className="relative h-full overflow-auto rounded-lg border bg-card/10 p-2">
      <button onClick={onClose} aria-label="Закрыть"
        className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-md bg-secondary/70 text-muted-foreground backdrop-blur hover:text-foreground">
        <X className="size-4" />
      </button>
      <KnowledgeBody matKey={matKey} />
    </div>
  );
}
