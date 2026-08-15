import { useMemo, useState } from 'react';
import { byZ } from '@chemverse/shared';
import type { ElementCategory } from '@chemverse/shared';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PeriodicTable } from '../periodic/PeriodicTable';
import { ElementDetail } from '../periodic/ElementDetail';
import { Legend } from '../periodic/Legend';
import { InspectStage } from '../scene/InspectStage';
import { useI18n } from '../i18n';

export function TablePage() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<number | null>(8);
  const [query, setQuery] = useState('');
  const [filterCats, setFilterCats] = useState<ReadonlySet<ElementCategory>>(new Set());
  const [inspect, setInspect] = useState(false);
  const [atomMode, setAtomMode] = useState<'bohr' | 'orbitals'>('bohr');

  const toggleCat = (cat: ElementCategory) =>
    setFilterCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });

  const detail = useMemo(() => byZ.get(selected ?? -1) ?? null, [selected]);

  return (
    <div className="relative flex h-full flex-col gap-2 px-4 pb-4 pt-2 md:px-6 md:pb-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-56 pl-8"
          />
        </div>
        <Legend selected={filterCats} onToggle={toggleCat} onReset={() => setFilterCats(new Set())} />
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-h-0 items-start justify-center overflow-auto">
          <PeriodicTable selected={selected} query={query} filterCats={filterCats} onSelect={setSelected} />
        </div>
        <aside className="min-h-0 overflow-auto">
          <ElementDetail element={detail} onExpand={() => setInspect(true)} mode={atomMode} onToggleMode={setAtomMode} />
        </aside>
      </div>

      {inspect && detail && <InspectStage element={detail} mode={atomMode} onClose={() => setInspect(false)} />}
    </div>
  );
}
