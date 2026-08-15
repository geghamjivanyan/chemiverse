/**
 * Knowledge Entity — a reusable, subject-agnostic model for any important
 * learning entity (a chemical element, atomic particle, scientific concept,
 * compound, scientist, lab equipment, …). Knowledge Cards are rendered entirely
 * from this data. Nothing here is chemistry-specific.
 */
import type { Metadata } from '../schema';

export interface KnowledgeEntity {
  id: string;
  /** Free-form category, e.g. "Atomic Particle", "Chemical Element", "Scientist". */
  type: string;
  name: string;
  /** Optional one-line qualifier shown under the title. */
  subtitle?: string;
  definition: string;
  image?: { src: string; alt: string };
  /** Standalone facts shown as a scannable bullet list. */
  facts?: string[];
  /** Labelled properties shown as a two-column list. */
  keyProperties?: { label: string; value: string }[];
  /** Free-form tags shown as chips. */
  tags?: string[];
  /** ids of related entities (for navigation between cards). */
  relatedEntities?: string[];
  /** Concepts (by id) where this entity is taught — resolved against the lesson. */
  lessonReferences?: { conceptId: string; label?: string }[];
  metadata?: Metadata;
}
