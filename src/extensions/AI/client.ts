import type { AIOptions, AIRequest } from './types';

export async function generateAIText(options: AIOptions, request: AIRequest): Promise<string> {
  if (options.generate) return options.generate(request);
  if (!options.model.trim()) throw new Error('Configure an AI model before sending a request.');
  if (options.protocol !== 'openai' && options.protocol !== 'anthropic') {
    throw new Error('Unsupported AI protocol. Use openai or anthropic.');
  }
  const apiKey = typeof options.apiKey === 'function' ? await options.apiKey() : options.apiKey;
  request.signal.throwIfAborted();
  const anthropic = options.protocol === 'anthropic';
  const base = (
    options.baseURL || (anthropic ? 'https://api.anthropic.com/v1' : 'https://api.openai.com/v1')
  ).replace(/\/+$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (anthropic) {
    headers['anthropic-version'] = '2023-06-01';
    if (apiKey) {
      headers['x-api-key'] = apiKey;
      headers['anthropic-dangerous-direct-browser-access'] = 'true';
    }
  } else if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  const response = await fetch(`${base}/${anthropic ? 'messages' : 'chat/completions'}`, {
    method: 'POST',
    headers: { ...headers, ...options.headers },
    signal: request.signal,
    body: JSON.stringify(
      anthropic
        ? {
            model: options.model,
            max_tokens: options.maxTokens,
            system: request.systemPrompt,
            messages: request.messages,
          }
        : {
            model: options.model,
            max_completion_tokens: options.maxTokens,
            messages: [{ role: 'system', content: request.systemPrompt }, ...request.messages],
          }
    ),
  });
  // Do not display raw provider errors: a proxy may include credentials in them.
  if (!response.ok)
    throw new Error(
      `AI request failed (${response.status}). Check your model, credentials, and API endpoint.`
    );
  const data = await response.json();
  const text: unknown = anthropic
    ? Array.isArray(data.content)
      ? data.content
          .filter((block: { type: string }) => block.type === 'text')
          .map((block: { text: string }) => block.text)
          .join('\n')
      : undefined
    : data.choices?.[0]?.message?.content;
  if (typeof text !== 'string' || !text.trim())
    throw new Error('AI returned no text. Try another prompt.');
  return text;
}
