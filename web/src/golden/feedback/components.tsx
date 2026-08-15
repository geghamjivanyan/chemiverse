/**
 * Feedback components — one small, presentation-only component per feedback type.
 * Each declares only its tone, icon and default title, then delegates the entire
 * structure, lifecycle, actions and analytics to the shared FeedbackFrame. Adding
 * a new feedback type means writing one of these and registering it — nothing else.
 */
import { CheckCircle2, XCircle, CircleDot, Lightbulb, RotateCcw, Eye, BookOpen, Sparkles, MessageCircleQuestion, RefreshCw, PartyPopper } from 'lucide-react';
import { FeedbackFrame } from './FeedbackFrame';
import type { FeedbackModel } from './types';

type P = { id: string; model: FeedbackModel };

export const CorrectFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="success" Icon={CheckCircle2} title="Ճիշտ է։ Ապրե՛ս։" model={model} />;
export const IncorrectFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="error" Icon={XCircle} title="Այնքան էլ ճիշտ չէ — փորձի՛ր նորից։" model={model} />;
export const PartiallyCorrectFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="warning" Icon={CircleDot} title="Մասամբ ճիշտ է։" model={model} />;
export const HintFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="info" Icon={Lightbulb} title="Ակնարկ" model={model} />;
export const RetryFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="info" Icon={RotateCcw} title="Փորձի՛ր նորից" model={model} />;
export const RevealAnswerFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="info" Icon={Eye} title="Պատասխան" model={model} />;
export const ExplainFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="info" Icon={BookOpen} title="Բացատրություն" model={model} />;
export const EncouragementFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="info" Icon={Sparkles} title="Ապրե՛ս, շարունակի՛ր" model={model} />;
export const ReflectionFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="info" Icon={MessageCircleQuestion} title="Ինքնավերլուծություն" model={model} />;
export const CompletionFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="success" Icon={CheckCircle2} title="Ավարտված է" model={model} />;
export const ReviewReminderFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="info" Icon={RefreshCw} title="Կրկնի՛ր" model={model} />;
export const CelebrationFeedback = ({ id, model }: P) => <FeedbackFrame id={id} tone="success" Icon={PartyPopper} title="Շնորհավո՛ր" model={model} />;
