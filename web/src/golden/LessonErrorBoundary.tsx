/**
 * LessonErrorBoundary — a small production safety net so the lesson never crashes.
 * If any part of the reader throws while rendering, it shows a graceful, in-theme
 * recovery message instead of a blank screen. Individual components already handle
 * missing/invalid data and broken assets; this catches the unexpected.
 */
import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class LessonErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) { return { error }; }

  override render() {
    if (this.state.error) {
      return (
        <div className="golden-light flex h-full items-center justify-center bg-background p-6 text-center text-foreground">
          <div className="max-w-sm space-y-2">
            <AlertTriangle className="mx-auto size-8 text-amber-500" />
            <p className="text-sm font-medium">Դասը չհաջողվեց ցուցադրել։</p>
            <p className="text-xs text-muted-foreground">Փորձի՛ր նորից կամ թարմացրու էջը։</p>
            <button type="button" onClick={() => this.setState({ error: null })}
              className="mx-auto mt-1 flex items-center gap-1.5 rounded-md border bg-card/40 px-3 py-1.5 text-sm font-medium hover:bg-accent">
              <RotateCcw className="size-3.5" /> Կրկնել
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
