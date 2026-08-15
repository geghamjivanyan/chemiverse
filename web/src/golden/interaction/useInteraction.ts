/**
 * useInteraction — the shared interaction lifecycle. Every interaction type uses
 * this one hook, so lifecycle, navigation (submit / retry / reset / reveal /
 * continue), analytics and Progress-Engine notification are identical everywhere.
 * The component supplies only its own behavior: whether it is graded, the current
 * answer's correctness, whether it can be submitted/completed, and how to clear
 * itself. Progress is reported through the existing ConceptProgress channel — the
 * hook never computes lesson progress.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useConceptProgress } from '../concept/progress';
import { emitInteraction } from './analytics';
import type { InteractionLifecycle } from './types';

export interface InteractionController {
  phase: 'input' | 'submitted' | 'done';
  lifecycle: InteractionLifecycle;
  correct: boolean | null;   // null = non-graded
  attempts: number;
  revealed: boolean;
  submit: () => void;
  retry: () => void;
  reset: () => void;
  reveal: () => void;
  finish: () => void;        // commit completion (graded "continue" or non-graded "done")
}

export function useInteraction(opts: {
  id: string;
  graded: boolean;
  isCorrect: boolean;
  answerText: () => string;
  clear: () => void;
}): InteractionController {
  const { id, graded, isCorrect, answerText, clear } = opts;
  const progress = useConceptProgress();

  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const wrong = useRef<string | undefined>(undefined);

  const started = useRef(false);
  useEffect(() => { if (!started.current) { started.current = true; emitInteraction('interaction_started', id); } }, [id]);

  const finish = () => {
    if (done) return;
    setDone(true);
    emitInteraction('interaction_completed', id, { attempts });
    progress?.markActivityDone(id, {
      correct: graded ? isCorrect : true,
      attempts: Math.max(1, attempts),
      firstTry: attempts <= 1,
      wrongAnswer: wrong.current,
    });
  };

  const submit = () => {
    const n = attempts + 1;
    setAttempts(n);
    setSubmitted(true);
    emitInteraction('interaction_answered', id, { attempts: n });
    if (graded && n === 1 && !isCorrect) wrong.current = answerText();
  };
  const retry = () => { setSubmitted(false); emitInteraction('interaction_retry', id); };
  const reset = () => { setSubmitted(false); setDone(false); setAttempts(0); setRevealed(false); wrong.current = undefined; clear(); emitInteraction('interaction_reset', id); };
  const reveal = () => { setRevealed(true); emitInteraction('interaction_revealed', id); };

  const phase: InteractionController['phase'] = done ? 'done' : submitted ? 'submitted' : 'input';
  const correct = graded ? (submitted ? isCorrect : false) : null;
  const lifecycle: InteractionLifecycle = useMemo(() => {
    if (done) return 'completed';
    if (submitted) return graded ? (isCorrect ? 'feedback' : 'answered') : 'feedback';
    return 'ready';
  }, [done, submitted, graded, isCorrect]);

  return { phase, lifecycle, correct, attempts, revealed, submit, retry, reset, reveal, finish };
}
