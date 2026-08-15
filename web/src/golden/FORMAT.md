# CHEMVERSE — Content Authoring Format

The **single, official content contract** for every lesson in every subject.
The renderer consumes this JSON directly — there are no per-lesson transforms and
no per-lesson code. To ship a new lesson you only:

1. Author a Lesson object in this format (validate with `satisfies Lesson`).
2. Register it in `golden/lessons.ts` (`GOLDEN_LESSONS[id] = lesson`) and add a
   `books/catalog.ts` entry with the same `id`.
3. Open it — no React, renderer, or engine changes required.

Types live in [`schema.ts`](./schema.ts); the reference lesson is
[`atom-structure.lesson.ts`](./atom-structure.lesson.ts).

---

## Shape

```
Lesson
  schemaVersion            // "2.0.0" — format version (for migrations)
  id                       // stable, unique across the platform
  metadata: LessonMetadata
  concepts: Concept[]

Concept
  id                       // stable, unique
  goal?                    // one-line learning goal, shown at the top
  metadata: ConceptMetadata
  steps: LearningStep[]    // a guided sequence of micro steps

LearningStep               // a small chunk of the concept
  id                       // stable, unique
  title?                   // optional short step title
  blocks: Block[]          // a little content to READ
  activity?                // optional single mini activity that ends the step
  metadata?

Block
  id                       // stable, unique
  type                     // decides the renderer (Block Registry)
  content                  // type-specific payload (see below)
  metadata?                // optional, extensible

Activity
  id                       // stable, unique
  type                     // decides the renderer (Activity Registry)
  config                   // setup: prompt, options/items, explanation?
  correctAnswers           // the answer key
  metadata?                // optional, extensible
```

A lesson is **concept-based** — there are no pages, page numbers or PDF
structures anywhere.

### Metadata is extensible

`Metadata` is an open bag (`{ [key: string]: unknown }`). Known fields are typed;
any extra field may be added without breaking existing lessons or the renderer.

- `LessonMetadata`: `title`, `subject`, `grade?`, `estimatedMinutes?`, `objectives?`, `prerequisites?`, `tags?`, …
- `ConceptMetadata`: `title`, `summary?`, `estimatedMinutes?`, `objectives?`, `tags?`, …

---

## Block types & their `content`

| type         | content |
|--------------|---------|
| `heading`    | `{ text, level?: 1|2|3 }` |
| `text`       | `{ text }` |
| `image`      | `{ src, alt, caption? }` |
| `diagram`    | `{ diagram, data, caption? }` — `diagram` selects a renderer; `data` is opaque |
| `keyword`    | `{ term, gloss?, entityId? }` |
| `definition` | `{ term, definition, entityId? }` |
| `formula`    | `{ formula, caption? }` |
| `note`       | `{ text }` |
| `fact`       | `{ text }` |
| `question`   | `{ prompt }` — inline, ungraded |
| `quiz`       | `{ title?, questions: { id, prompt, options: { id, text }[] }[] }` |
| `divider`    | *(none)* |

Add a new block type by: extending `BlockType` + its interface in `schema.ts`,
writing a view component, and registering it in `blocks/registry.ts`. Lessons
that don't use it are unaffected.

---

## Activity types — `config` + `correctAnswers`

| type              | config | correctAnswers |
|-------------------|--------|----------------|
| `multiple_choice` | `{ prompt, options: { id, text }[], explanation? }` | `string[]` (correct option ids; one or many) |
| `true_false`      | `{ prompt, explanation? }` | `boolean` |
| `match`           | `{ prompt, left: { id, text }[], right: { id, text }[], explanation? }` | `{ [rightId]: leftId }` |
| `label_diagram`   | `{ prompt, labels: { id, text }[], slots: { id, hint }[], explanation? }` | `{ [slotId]: labelId }` |

Add a new activity type by: extending `ActivityType` + its interface, writing an
interactive component, and registering it in `activities/registry.ts`.

Every activity may carry teaching **`feedback`** (all optional, from the JSON):
`{ explanation, learningTip, commonMistake }`. The Smart Activity Engine shows
instant feedback, highlights the correct answer, displays this feedback, offers
**Retry** on a wrong answer and **Continue** on a correct one, and tracks attempts.
A step completes only once its activity is answered **correctly**.

---

## How it renders (engines the renderer composes)

```
Lesson JSON
  → GoldenLessonReader        composes everything; no lesson logic
  → useLessonFlow             progression: unlock, complete, scroll (generic)
  → LearningSidebar           concept navigation + progress
  → ConceptView               Goal → Step 1 → Step 2 → … → completion
      → StepView              one active micro step at a time (read + mini activity)
      → Block Registry        block.type → component
      → Activity Registry     activity.type → interactive component
  → Context Panel             reacts to the selected block
  → AI Context                Lesson + current concept + selected block + history
```

Completion rules:
- **Step** — done when its mini activity is completed, or (if it has none) once its
  content is read to the end. Finishing a step unlocks & scrolls to the next.
- **Concept** — done when every step is done → the next concept unlocks.

---

## Suitability

- **AI generation / import** — emit JSON in this shape; it renders as-is.
- **Manual editing** — every field is plain data with stable ids.
- **Export** — a lesson is a single serialisable object.
- **Versioning** — `schemaVersion` gates migrations; `metadata` grows additively.
