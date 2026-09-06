import { ArrowUp, Check, RotateCcw, Sparkles, Square, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { generateAIText } from './client';

import type { AIMessage, AIOptions } from './types';

export interface AIPanelProps {
  options: AIOptions;
  selectedText: string;
  initialPrompt?: string;
  apply: (text: string) => void;
  close: () => void;
}

export function AIPanel({ options, selectedText, initialPrompt, apply, close }: AIPanelProps) {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [tone, setTone] = useState('');
  const [result, setResult] = useState('');
  const [preview, setPreview] = useState('');
  const animation = useRef(0);
  const revealing = result !== preview;
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const working = busy || revealing;
  const input = useRef<HTMLTextAreaElement>(null);
  const stopButton = useRef<HTMLButtonElement>(null);
  const controller = useRef<AbortController | null>(null);
  const history = useRef<AIMessage[]>([]);
  const lastRequest = useRef<AIMessage[]>([]);

  const startPreset = useRef(() => {
    if (initialPrompt) void submit(false, initialPrompt);
  });

  useEffect(() => {
    // Slash command restores editor focus after its action completes.
    const frame = requestAnimationFrame(() => {
      input.current?.focus();
      startPreset.current();
    });
    return () => {
      cancelAnimationFrame(frame);
      controller.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!result) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPreview(result);
      return;
    }
    const characters = Array.from(
      new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(result),
      (part) => part.segment
    );
    const duration = Math.min(characters.length * 16, 5000);
    const start = performance.now();
    function tick(now: number) {
      const count = Math.min(
        characters.length,
        Math.max(1, Math.floor(((now - start) / duration) * characters.length))
      );
      setPreview(characters.slice(0, count).join(''));
      if (count < characters.length) animation.current = requestAnimationFrame(tick);
    }
    animation.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation.current);
  }, [result]);

  useEffect(() => {
    if (busy) stopButton.current?.focus();
    else if (!revealing) input.current?.focus();
  }, [busy, revealing]);

  async function submit(retry = false, instruction = prompt) {
    if (working || controller.current || (!retry && !instruction.trim())) return;
    const messages: AIMessage[] = retry
      ? lastRequest.current
      : [
          ...history.current,
          {
            role: 'user',
            content: [
              history.current.length === 0 && selectedText ? `Selected text:\n${selectedText}` : '',
              instruction.trim(),
              tone ? `Tone: ${tone}` : '',
            ]
              .filter(Boolean)
              .join('\n\n'),
          },
        ];
    if (!messages.length) return;
    lastRequest.current = messages;
    const active = new AbortController();
    controller.current = active;
    setBusy(true);
    setError('');
    try {
      const text = await generateAIText(options, {
        messages,
        systemPrompt: options.systemPrompt,
        signal: active.signal,
      });
      if (active.signal.aborted) return;
      if (!text.trim()) throw new Error('AI returned no text. Try another prompt.');
      history.current = [...messages, { role: 'assistant', content: text }];
      if (text !== result) setPreview('');
      setResult(text);
      setPrompt('');
    } catch (cause) {
      if (!active.signal.aborted)
        setError(
          cause instanceof Error ? cause.message : 'Unable to generate text. Please try again.'
        );
    } finally {
      if (controller.current === active) {
        controller.current = null;
        setBusy(false);
        input.current?.focus();
      }
    }
  }

  function stop() {
    cancelAnimationFrame(animation.current);
    setPreview(result);
    controller.current?.abort();
    controller.current = null;
    setBusy(false);
    input.current?.focus();
  }

  return (
    <div
      className='richtext-ai'
      data-richtext-portal
      role='dialog'
      aria-label='Ask AI'
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          close();
        }
        event.stopPropagation();
      }}
    >
      {result ? (
        <div className='richtext-ai-preview' aria-label='AI preview' aria-busy={revealing}>
          {preview.split(/\n\s*\n/).map((paragraph, index, paragraphs) => (
            <p key={index}>
              <span className='richtext-ai-insertion'>{paragraph}</span>
              {revealing && index === paragraphs.length - 1 ? (
                <span className='richtext-ai-caret' aria-hidden='true' />
              ) : null}
            </p>
          ))}
        </div>
      ) : null}
      {busy ? (
        <div className='richtext-ai-loading'>
          <span className='richtext-ai-loading-label' role='status'>
            AI is writing
          </span>
          <span className='richtext-ai-loading-dots' aria-hidden='true'>
            <i />
            <i />
            <i />
          </span>
          <button
            ref={stopButton}
            type='button'
            className='richtext-ai-loading-stop'
            aria-label='Stop generating'
            title='Stop generating'
            onClick={stop}
          >
            <Square size={10} fill='currentColor' />
          </button>
        </div>
      ) : (
        <form
          className={`richtext-ai-panel ${result ? 'richtext-ai-review' : ''}`}
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          {!result ? (
            <div className='richtext-ai-heading'>
              <span>
                <Sparkles size={16} /> Ask AI
              </span>
              <button type='button' aria-label='Close AI' onClick={close}>
                <X size={16} />
              </button>
            </div>
          ) : null}
          <div className='richtext-ai-prompt-row'>
            {result ? <Sparkles className='richtext-ai-prompt-icon' size={17} /> : null}
            <textarea
              ref={input}
              aria-label={result ? 'Refine AI result' : 'AI prompt'}
              placeholder={
                result ? 'Tell AI what else needs to be changed...' : 'Ask AI what you want...'
              }
              value={prompt}
              disabled={working}
              rows={result ? 1 : 3}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  void submit();
                }
              }}
            />
            {result ? (
              <button
                type={revealing ? 'button' : 'submit'}
                className='richtext-ai-send'
                aria-label={revealing ? 'Stop generating' : 'Send prompt'}
                disabled={!revealing && !prompt.trim()}
                onClick={revealing ? stop : undefined}
              >
                {revealing ? <Square size={16} /> : <ArrowUp size={20} />}
              </button>
            ) : null}
          </div>
          {error ? (
            <p className='richtext-ai-error' role='alert'>
              {error}
            </p>
          ) : null}
          {!result ? (
            <div className='richtext-ai-compose-actions'>
              <label className='richtext-ai-tone'>
                Tone{' '}
                <select
                  aria-label='Tone'
                  value={tone}
                  disabled={working}
                  onChange={(event) => setTone(event.target.value)}
                >
                  <option value=''>Default</option>
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Casual</option>
                  <option>Confident</option>
                </select>
              </label>
              <span role='status' className='richtext-ai-status'>
                {working ? 'Writing…' : ''}
              </span>
              {working ? (
                <button type='button' aria-label='Stop generating' onClick={stop}>
                  <Square size={16} />
                </button>
              ) : (
                <button
                  type='submit'
                  className='richtext-ai-send'
                  aria-label='Send prompt'
                  disabled={!prompt.trim()}
                >
                  <ArrowUp size={20} />
                </button>
              )}
            </div>
          ) : null}
          {result || error ? (
            <div className='richtext-ai-actions'>
              <button type='button' disabled={working} onClick={() => void submit(true)}>
                <RotateCcw size={16} /> Try again
              </button>
              <div>
                <button type='button' onClick={close}>
                  <X size={16} /> Discard
                </button>
                <button
                  type='button'
                  className='richtext-ai-apply'
                  disabled={working || !result}
                  onClick={() => apply(result)}
                >
                  <Check size={17} /> Apply
                </button>
              </div>
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}
