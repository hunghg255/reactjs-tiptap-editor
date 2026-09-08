import { Component, lazy, Suspense, useMemo, useState } from 'react';

import type { ComponentType, ReactNode } from 'react';

class LoadBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div role='alert'>
          Unable to load this feature.{' '}
          <button type='button' onClick={this.props.onRetry}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Render only after the feature is opened. A failed chunk can be retried. */
export function LazyContent<P extends object>({
  load,
  componentProps,
}: {
  load: () => Promise<{ default: ComponentType<P> }>;
  componentProps: P;
}) {
  const [attempt, setAttempt] = useState(0);
  // A rejected React.lazy promise is cached; retry must create a new lazy instance.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Content = useMemo(() => lazy(load), [load, attempt]);

  return (
    <LoadBoundary key={attempt} onRetry={() => setAttempt((value) => value + 1)}>
      <Suspense fallback={<p role='status'>Loading…</p>}>
        <Content {...componentProps} />
      </Suspense>
    </LoadBoundary>
  );
}
