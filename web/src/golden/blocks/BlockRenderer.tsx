/**
 * BlockRenderer — the Block Renderer Engine.
 * Rendering is decided ONLY by `block.type`: the component is looked up in the
 * Block Registry, and an unknown type falls back to a safe placeholder instead
 * of crashing the lesson. It contains no switch/if-else on block type and no
 * lesson-specific logic. A block may opt out of rendering via `metadata.visible`.
 * The single cast bridges the union-lookup correlation TypeScript can't express;
 * it stays contained here so the rest of the codebase never branches on type.
 */
import { memo, type FC } from 'react';
import type { Block } from '../schema';
import { BLOCK_REGISTRY } from './registry';
import { UnknownBlockView } from './components';

function BlockRendererImpl({ block }: { block: Block }) {
  // Generic, opt-in visibility (from data only) — never lesson-specific.
  if ((block.metadata as { visible?: boolean } | undefined)?.visible === false) return null;

  const View = (BLOCK_REGISTRY[block.type] ?? UnknownBlockView) as FC<{ block: Block }>;
  return <View block={block} />;
}

/** Memoized: blocks are stable data, so screen state changes don't re-render them. */
export const BlockRenderer = memo(BlockRendererImpl);
