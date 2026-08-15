/**
 * BlockRenderContext — ambient lesson + screen context and generic callbacks
 * available to any block component that needs them, without threading props
 * through the registry. The BlockRenderer stays generic: it decides rendering
 * only from `block.type`; blocks may optionally read this for context, to open
 * the Context Panel for an entity, to declare themselves completable, or to
 * report completion to the Progress Engine.
 */
import { createContext, useContext } from 'react';
import type { Lesson } from '../schema';

export interface BlockRenderContextValue {
  lesson?: Lesson;
  screen?: { id: string; type: string };
  /** Open the Context Panel (Knowledge Card) for an entity. */
  onSelectEntity?: (entityId: string) => void;
  /** A content block declares that completing it gates the screen. */
  registerCompletable?: (blockId: string) => void;
  /** A content block reports it has been completed. */
  onBlockComplete?: (blockId: string) => void;
}

export const BlockRenderContext = createContext<BlockRenderContextValue>({});
export const useBlockContext = () => useContext(BlockRenderContext);
