import assert from 'node:assert/strict';
import { test } from 'node:test';

import { generateAIText } from '../src/extensions/AI/client';

import type { AIOptions, AIRequest } from '../src/extensions/AI/types';

const options: AIOptions = {
  protocol: 'openai',
  apiKey: 'test-key',
  baseURL: '',
  model: 'test-model',
  maxTokens: 128,
  headers: {},
  systemPrompt: 'Write text',
  generate: null,
};
const request = (): AIRequest => ({
  systemPrompt: 'Write text',
  messages: [{ role: 'user', content: 'Hello' }],
  signal: new AbortController().signal,
});

test('OpenAI and Anthropic serialize their own headers, bodies, and responses', async () => {
  const original = globalThis.fetch;
  try {
    for (const protocol of ['openai', 'anthropic'] as const) {
      globalThis.fetch = async (url, init) => {
        const headers = init!.headers as Record<string, string>;
        const body = JSON.parse(init!.body as string);
        assert.equal(body.model, 'test-model');
        assert.ok(init!.signal);
        if (protocol === 'openai') {
          assert.equal(url, 'https://api.openai.com/v1/chat/completions');
          assert.equal(headers.Authorization, 'Bearer test-key');
          assert.equal(body.max_completion_tokens, 128);
          assert.equal(body.messages[0].role, 'system');
          return Response.json({ choices: [{ message: { content: 'OpenAI text' } }] });
        }
        assert.equal(url, 'https://api.anthropic.com/v1/messages');
        assert.equal(headers['x-api-key'], 'test-key');
        assert.equal(headers['anthropic-version'], '2023-06-01');
        assert.equal(body.system, 'Write text');
        assert.equal(body.max_tokens, 128);
        assert.equal(body.messages[0].role, 'user');
        return Response.json({
          content: [
            { type: 'thinking', thinking: 'hidden' },
            { type: 'text', text: 'Anthropic text' },
          ],
        });
      };
      assert.equal(
        await generateAIText({ ...options, protocol }, request()),
        protocol === 'openai' ? 'OpenAI text' : 'Anthropic text'
      );
    }
  } finally {
    globalThis.fetch = original;
  }
});

test('proxy, async keys, failures, empty responses, and cancellation', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (url, init) => {
      assert.equal(url, '/api/ai/chat/completions');
      assert.equal((init!.headers as Record<string, string>).Authorization, undefined);
      return Response.json({ choices: [{ message: { content: 'proxy' } }] });
    };
    assert.equal(
      await generateAIText({ ...options, baseURL: '/api/ai/', apiKey: async () => '' }, request()),
      'proxy'
    );
    globalThis.fetch = async () => new Response('secret-key', { status: 401 });
    await assert.rejects(generateAIText(options, request()), /AI request failed \(401\)/);
    globalThis.fetch = async () => Response.json({ choices: [] });
    await assert.rejects(generateAIText(options, request()), /no text/);
    await assert.rejects(
      generateAIText({ ...options, model: '' }, request()),
      /Configure an AI model/
    );
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(generateAIText(options, { ...request(), signal: controller.signal }), {
      name: 'AbortError',
    });
    assert.equal(
      await generateAIText({ ...options, generate: async () => 'custom' }, request()),
      'custom'
    );
  } finally {
    globalThis.fetch = original;
  }
});
