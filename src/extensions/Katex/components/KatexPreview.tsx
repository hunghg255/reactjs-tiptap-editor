import { useEffect, useMemo, useState } from 'react';

import { safeJSONParse } from '@/utils/json';

import { loadKatex } from '../katex-loader';

import type { KatexLoader, KatexRenderer } from '../katex-loader';

export function KatexPreview({
  text,
  macros = '',
  loader,
}: {
  text: string;
  macros?: string;
  loader?: KatexLoader;
}) {
  const [renderer, setRenderer] = useState<KatexRenderer | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setRenderer(null);
    setFailed(false);
    void loadKatex(loader)
      .then((instance) => {
        if (!cancelled) setRenderer(instance);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [loader, attempt]);

  const html = useMemo(() => {
    if (!renderer || !text.trim()) return null;
    try {
      return renderer.renderToString(text, {
        macros: safeJSONParse<NonNullable<import('katex').KatexOptions['macros']>>(macros),
      });
    } catch {
      return null;
    }
  }, [renderer, text, macros]);

  if (failed) {
    return (
      <span contentEditable={false} role='alert'>
        {text}{' '}
        <button type='button' onClick={() => setAttempt((value) => value + 1)}>
          Retry formula
        </button>
      </span>
    );
  }

  // Invalid formulas and loading placeholders are text, never untrusted HTML.
  return html === null ? (
    <span contentEditable={false} aria-busy={!renderer}>
      {text}
    </span>
  ) : (
    <span contentEditable={false} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
