import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';

const DISCOVERED_KEY = 'chemverse.discovered';

function loadDiscovered(): Set<string> {
  try {
    const raw = localStorage.getItem(DISCOVERED_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    /* ignore */
  }
  return new Set();
}

function saveDiscovered(set: Set<string>) {
  try {
    localStorage.setItem(DISCOVERED_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

interface BenchValue {
  counts: Record<string, number>;
  addAtom: (sym: string) => void;
  removeAtom: (sym: string) => void;
  reset: () => void;
  total: number;
  discovered: Set<string>;
  addDiscovered: (formula: string) => void;
}

const BenchContext = createContext<BenchValue | null>(null);

export function BenchProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [discovered, setDiscovered] = useState<Set<string>>(loadDiscovered);
  const discoveredRef = useRef(discovered);
  discoveredRef.current = discovered;

  // синхронизация с сервером: при входе/смене пользователя шлём локальные открытия
  // и получаем объединённый набор (так гостевой прогресс сливается в аккаунт).
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formulas: [...discoveredRef.current] }),
    })
      .then((r) => r.json())
      .then((data: { discoveries?: string[] }) => {
        if (cancelled || !data.discoveries) return;
        const set = new Set([...discoveredRef.current, ...data.discoveries]);
        setDiscovered(set);
        saveDiscovered(set);
      })
      .catch(() => {
        /* офлайн — остаёмся на локальном */
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const addAtom = (sym: string) => setCounts((b) => ({ ...b, [sym]: (b[sym] ?? 0) + 1 }));
  const removeAtom = (sym: string) =>
    setCounts((b) => {
      const n = (b[sym] ?? 0) - 1;
      const next = { ...b };
      if (n <= 0) delete next[sym];
      else next[sym] = n;
      return next;
    });
  const reset = () => setCounts({});

  const addDiscovered = (formula: string) =>
    setDiscovered((prev) => {
      if (prev.has(formula)) return prev;
      const next = new Set(prev).add(formula);
      saveDiscovered(next);
      // на сервер (fire-and-forget)
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formulas: [formula] }),
      }).catch(() => {
        /* офлайн — уже в localStorage */
      });
      return next;
    });

  const total = Object.values(counts).reduce((a, n) => a + n, 0);

  return (
    <BenchContext.Provider value={{ counts, addAtom, removeAtom, reset, total, discovered, addDiscovered }}>
      {children}
    </BenchContext.Provider>
  );
}

export function useBench(): BenchValue {
  const ctx = useContext(BenchContext);
  if (!ctx) throw new Error('useBench должен быть внутри <BenchProvider>');
  return ctx;
}
