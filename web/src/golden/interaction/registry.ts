/**
 * Interaction Registry — maps an `interaction.type` to its component. Rendering is
 * decided ONLY by this map: no switch statements, no if/else chains. Adding a new
 * interaction requires exactly two things — write the component, add one line
 * here. The engine and every other system stay untouched.
 */
import type { FC } from 'react';
import type { Interaction, InteractionType } from './types';
import {
  PredictionInteraction, MultipleChoiceInteraction, TrueFalseInteraction, SortingInteraction,
  MatchingInteraction, ConnectInteraction, SequenceInteraction, ClassificationInteraction,
  CompareInteraction, BuildInteraction, HotspotInteractionView, ImageExplorationInteraction,
  DiagramLabelingInteraction, TimelineInteraction, SimulationInteractionView, ReflectionInteraction,
  ExplainInteraction, DiscoveryInteraction, ObservationInteraction, FillDiagramInteraction, RevealInteractionView,
} from './components';

export const INTERACTION_REGISTRY: Record<InteractionType, FC<{ i: Interaction }>> = {
  prediction: PredictionInteraction,
  multiple_choice: MultipleChoiceInteraction,
  true_false: TrueFalseInteraction,
  sorting: SortingInteraction,
  matching: MatchingInteraction,
  connect: ConnectInteraction,
  sequence: SequenceInteraction,
  classification: ClassificationInteraction,
  compare: CompareInteraction,
  build: BuildInteraction,
  hotspot: HotspotInteractionView,
  image_exploration: ImageExplorationInteraction,
  diagram_labeling: DiagramLabelingInteraction,
  timeline: TimelineInteraction,
  simulation: SimulationInteractionView,
  reflection: ReflectionInteraction,
  explain: ExplainInteraction,
  discovery: DiscoveryInteraction,
  observation: ObservationInteraction,
  fill_diagram: FillDiagramInteraction,
  reveal: RevealInteractionView,
};
