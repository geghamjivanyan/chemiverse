/**
 * Block Registry — the single source of truth mapping a `block.type` to its
 * view component. Rendering is decided ONLY by this map (no scattered switches).
 * The mapped type forces every Block variant to have exactly one component whose
 * props match that variant, so a new block type will not compile until it is
 * registered here.
 */
import type { FC } from 'react';
import type { Block, BlockOf } from '../schema';
import {
  HeadingBlockView, TextBlockView, ImageBlockView, DiagramBlockView, KeywordBlockView,
  DefinitionBlockView, FormulaBlockView, NoteBlockView, FactBlockView, QuestionBlockView,
  QuizBlockView, DividerBlockView,
} from './components';
import { ScientistStoryBlockView } from './ScientistStoryBlockView';
import { ExperimentBlockView } from './ExperimentBlockView';

type BlockRegistry = { [K in Block['type']]: FC<{ block: BlockOf<K> }> };

export const BLOCK_REGISTRY: BlockRegistry = {
  heading: HeadingBlockView,
  text: TextBlockView,
  image: ImageBlockView,
  diagram: DiagramBlockView,
  keyword: KeywordBlockView,
  definition: DefinitionBlockView,
  formula: FormulaBlockView,
  note: NoteBlockView,
  fact: FactBlockView,
  question: QuestionBlockView,
  quiz: QuizBlockView,
  divider: DividerBlockView,
  scientistStory: ScientistStoryBlockView,
  experiment: ExperimentBlockView,
};
