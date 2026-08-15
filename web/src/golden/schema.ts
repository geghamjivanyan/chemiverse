/**
 * CHEMVERSE — Content Authoring Format (the official lesson contract).
 * =====================================================================
 * ONE canonical structure for every lesson in every subject, consumed directly
 * by the renderer (no transforms). Used by AI generation, the admin editor,
 * import/export and versioning. See ./FORMAT.md for the authoring guide.
 *
 *   Lesson
 *     ├─ metadata            (LessonMetadata — extensible)
 *     └─ concepts: Concept[]
 *          ├─ metadata       (ConceptMetadata — extensible)
 *          ├─ goal           (the concept's single learning goal)
 *          ├─ blocks: Block[]        (content to read)
 *          └─ activities: Activity[] (interactive practice)
 *
 *   Block    = { id, type, content, metadata? }
 *   Activity = { id, type, config, correctAnswers, metadata? }
 *
 * Every entity has a stable id. Metadata is an open bag: known fields are typed,
 * unknown fields are allowed — so metadata can grow without breaking lessons.
 * It is concept-based: no pages, no PDF structures.
 */

/** Semantic version of the content format. */
export type SchemaVersion = `${number}.${number}.${number}`;
export const CONTENT_FORMAT_VERSION: SchemaVersion = '2.1.0';

/** Extensible metadata bag — typed known fields plus arbitrary future keys. */
export interface Metadata { [key: string]: unknown }

// ────────────────────────────────────────────────────────────
// Blocks — content units. `content` carries the type-specific payload.
// ────────────────────────────────────────────────────────────

export type BlockType =
  | 'heading' | 'text' | 'image' | 'diagram' | 'keyword' | 'definition'
  | 'formula' | 'note' | 'fact' | 'question' | 'quiz' | 'divider' | 'scientistStory' | 'experiment';

export interface QuizQuestion { id: string; prompt: string; options: { id: string; text: string }[] }

/**
 * Optional Study Companion content for a block. Authored in the Lesson JSON and
 * read verbatim by the Study Companion panel (no generation). Missing fields are
 * gracefully hidden.
 */
export interface BlockCompanion {
  summary?: string;
  simpleExplanation?: string;
  example?: string;
  importance?: string;
  /** ids of other concepts in this lesson that are connected. */
  relatedConceptIds?: string[];
}

interface BlockBase { id: string; metadata?: Metadata; companion?: BlockCompanion }
export interface HeadingBlock extends BlockBase { type: 'heading'; content: { text: string; level?: 1 | 2 | 3 } }
export interface TextBlock extends BlockBase { type: 'text'; content: { text: string } }
export interface ImageBlock extends BlockBase {
  type: 'image';
  content: {
    src: string; title?: string; altText: string; caption?: string; source?: string;
    hotspots?: DiagramHotspot[];        // optional interactive points
    labels?: DiagramLabel[];            // optional static labels
    explorationOrder?: string[];        // optional hotspot ids for guided mode
  };
}
/** A clickable point on a diagram. Positions are percentages (0–100) so they
 *  scale with the image/container. */
export interface DiagramHotspot {
  id: string;
  title: string;
  description: string;
  x: number; // 0–100 (% of width)
  y: number; // 0–100 (% of height)
  icon?: string;            // optional short glyph shown in the marker
  entityId?: string;        // optional Knowledge Card to open on select
  relatedBlockId?: string;  // optional block the Study Companion links to
  /** Optional region highlighted while the hotspot is active (percentages). */
  highlight?: { x: number; y: number; w: number; h: number; shape?: 'rect' | 'ellipse' };
}

/** A static text label placed on a diagram (percentage position). */
export interface DiagramLabel { id: string; text: string; x: number; y: number }

export interface DiagramBlock extends BlockBase {
  type: 'diagram';
  content: {
    diagram: string;                    // renderer kind
    image?: string;                     // optional background image
    hotspots?: DiagramHotspot[];        // interactive points
    labels?: DiagramLabel[];            // static labels
    explorationOrder?: string[];        // optional hotspot ids for guided mode
    data?: Record<string, unknown>;     // opaque data (non-interactive diagrams)
    caption?: string;
    metadata?: Metadata;
  };
}
export interface KeywordBlock extends BlockBase { type: 'keyword'; content: { term: string; gloss?: string; entityId?: string } }
export interface DefinitionBlock extends BlockBase { type: 'definition'; content: { term: string; definition: string; entityId?: string } }
export interface FormulaBlock extends BlockBase { type: 'formula'; content: { formula: string; caption?: string } }
export interface NoteBlock extends BlockBase { type: 'note'; content: { text: string } }
export interface FactBlock extends BlockBase { type: 'fact'; content: { text: string } }
export interface QuestionBlock extends BlockBase { type: 'question'; content: { prompt: string } }
export interface QuizBlock extends BlockBase { type: 'quiz'; content: { title?: string; questions: QuizQuestion[] } }
export interface DividerBlock extends BlockBase { type: 'divider'; content?: Record<string, never> } // divider is a pure separator — no content

/** A scientist told as one connected investigation (problem → discovery → next). */
export interface ScientistStoryBlock extends BlockBase {
  type: 'scientistStory';
  content: {
    scientist: { name: string; entityId?: string; portrait?: string; period?: string };
    problem: string;
    previousModel?: string;
    experiment: string;
    observation: string;
    discovery: string;
    discoveryEntityId?: string;
    limitation?: string;
    transition?: string;
    takeaway: string;
  };
}

/** A hands-on investigation told as one guided flow (question → reflection). */
export interface ExperimentBlock extends BlockBase {
  type: 'experiment';
  content: {
    title: string;
    objective?: string;
    question: string;
    prediction?: { prompt: string; kind?: 'text' | 'choice'; options?: string[] };
    setup?: string;
    steps?: string[];
    observations?: string[];
    analysis?: string;
    explanation?: string;
    feedback?: ActivityFeedback;      // reuses the shared Smart Feedback presenter
    conclusion?: string;
    reflection?: string[];
    relatedEntities?: string[];
  };
}

export type Block =
  | HeadingBlock | TextBlock | ImageBlock | DiagramBlock | KeywordBlock | DefinitionBlock
  | FormulaBlock | NoteBlock | FactBlock | QuestionBlock | QuizBlock | DividerBlock
  | ScientistStoryBlock | ExperimentBlock;
export type BlockOf<K extends BlockType> = Extract<Block, { type: K }>;

// ────────────────────────────────────────────────────────────
// Activities — interactive tasks. `config` = setup, `correctAnswers` = key.
// ────────────────────────────────────────────────────────────

export type ActivityType = 'multiple_choice' | 'true_false' | 'match' | 'label_diagram';

/** Teaching feedback shown after an answer — straight from the Lesson JSON. */
export interface ActivityFeedback {
  explanation?: string;   // why the answer is what it is
  learningTip?: string;   // what to remember
  commonMistake?: string; // a mistake to watch out for
}

interface ActivityBase { id: string; feedback?: ActivityFeedback; metadata?: Metadata }
export interface MultipleChoiceActivity extends ActivityBase {
  type: 'multiple_choice';
  config: { prompt: string; options: { id: string; text: string }[] };
  correctAnswers: string[]; // ids of the correct option(s)
}
export interface TrueFalseActivity extends ActivityBase {
  type: 'true_false';
  config: { prompt: string };
  correctAnswers: boolean;
}
export interface MatchActivity extends ActivityBase {
  type: 'match';
  config: { prompt: string; left: { id: string; text: string }[]; right: { id: string; text: string }[] };
  correctAnswers: Record<string, string | undefined>; // right item id → correct left item id
}
export interface LabelDiagramActivity extends ActivityBase {
  type: 'label_diagram';
  config: { prompt: string; labels: { id: string; text: string }[]; slots: { id: string; hint: string }[] };
  correctAnswers: Record<string, string | undefined>; // slot id → correct label id
}

export type Activity = MultipleChoiceActivity | TrueFalseActivity | MatchActivity | LabelDiagramActivity;
export type ActivityOf<K extends ActivityType> = Extract<Activity, { type: K }>;

/**
 * Interaction — the generic, data-driven learner task rendered by the Interaction
 * Engine. `config`/`correctAnswers` are type-specific and interpreted by the
 * registered interaction component; the engine itself never inspects them.
 */
export type InteractionType =
  | 'prediction' | 'multiple_choice' | 'true_false' | 'sorting' | 'matching' | 'connect' | 'sequence'
  | 'classification' | 'compare' | 'build' | 'hotspot' | 'image_exploration' | 'diagram_labeling'
  | 'timeline' | 'simulation' | 'reflection' | 'explain' | 'discovery' | 'observation' | 'fill_diagram' | 'reveal';

export interface Interaction {
  id: string;
  type: InteractionType;
  prompt?: string;
  config?: Record<string, unknown>;
  correctAnswers?: unknown;
  feedback?: ActivityFeedback;
  metadata?: Metadata;
}

// ────────────────────────────────────────────────────────────
// Concept — a learning unit (NOT a page).
// ────────────────────────────────────────────────────────────

export interface ConceptMetadata extends Metadata {
  title: string;
  summary?: string;
  estimatedMinutes?: number;
  objectives?: string[];
  tags?: string[];
}

/**
 * A Learning Step — a small, self-contained micro-unit of a concept: a little
 * content to read, optionally ending with ONE mini activity. Concepts are a
 * sequence of these, so learning feels like steady progress, not one long read.
 */
export interface LearningStep {
  id: string;
  /** Optional short step title (e.g. "What is matter?"). */
  title?: string;
  /** A small amount of content. */
  blocks: Block[];
  /** Optional single mini activity that ends the step (legacy graded task). */
  activity?: Activity;
  /** Optional additional interactions rendered through the Interaction Engine. */
  interactions?: Interaction[];
  metadata?: Metadata;
}

export interface Concept {
  id: string;
  /** The concept's single learning goal, shown at its start. */
  goal?: string;
  metadata: ConceptMetadata;
  /** The concept as a guided sequence of micro learning steps. */
  steps: LearningStep[];
}

// ────────────────────────────────────────────────────────────
// Lesson — composed only of concepts.
// ────────────────────────────────────────────────────────────

export interface LessonMetadata extends Metadata {
  title: string;
  subject: string;
  grade?: string;
  estimatedMinutes?: number;
  objectives?: string[];
  prerequisites?: string[];
  tags?: string[];
  /** Optional preview of what comes next, shown on the completion screen. */
  nextLesson?: { title: string; description?: string };
}

export interface Lesson {
  /** Version of the Content Authoring Format this lesson targets. */
  schemaVersion: SchemaVersion;
  id: string;
  metadata: LessonMetadata;
  concepts: Concept[];
}
