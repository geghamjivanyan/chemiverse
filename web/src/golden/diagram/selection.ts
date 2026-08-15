/**
 * Diagram selection context — lets any interactive diagram report the clicked
 * hotspot up to the renderer (which feeds the Study Companion) and read which
 * hotspot is currently selected, without threading props through the registries.
 * Only one hotspot is selected across the whole lesson at a time.
 */
import { createContext, useContext } from 'react';
import type { DiagramHotspot } from '../schema';

export interface DiagramSelectionApi {
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspot: DiagramHotspot) => void;
}

export const DiagramSelectionContext = createContext<DiagramSelectionApi | null>(null);
export const useDiagramSelection = () => useContext(DiagramSelectionContext);
