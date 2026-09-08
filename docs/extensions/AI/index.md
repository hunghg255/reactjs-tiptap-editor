---
description: AI

next:
  text: Attachment
  link: /extensions/Attachment/index.md
---

# AI

A custom writing assistant with an inline prompt, tone selection, plain-text preview,
follow-up instructions, retry, cancellation, discard, and apply. Works in light and dark themes.

```tsx
import { AI } from 'reactjs-tiptap-editor/ai';
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand';
import 'reactjs-tiptap-editor/style.css';

const extensions = [
  // Your existing document, paragraph, text, history, etc.
  AI.configure({
    protocol: 'openai', // 'openai' | 'anthropic'
    apiKey: 'your-api-key', // Also accepts () => string | Promise<string>
    model: 'your-model-id',
    // Optional root including /v1; defaults to the selected provider's API.
    baseURL: 'https://api.openai.com/v1',
  }),
  SlashCommand,
];
// Render <SlashCommandList /> inside your existing RichTextProvider.
```

Type `/` and choose **Ask AI**. The entry is added automatically when `AI` is
registered, including when you supply a custom slash command list. Without `AI`,
the menu is unchanged. Enter sends a prompt; Shift+Enter inserts a newline;
Escape closes the panel. Select text and call `editor.commands.openAI()` to rewrite
that selection, or call it at the cursor to insert new text.

For Anthropic, set `protocol: 'anthropic'`, pass your model ID and API key, and omit
`baseURL` (defaults to `https://api.anthropic.com/v1`). The transport uses
[Anthropic Messages](https://platform.claude.com/docs/en/api/messages/create) or
[OpenAI Chat Completions](https://developers.openai.com/api/reference/resources/chat).
OpenAI-compatible proxies should support `max_completion_tokens`; use `generate`
for a gateway requiring a different payload.

## Production: keep keys on your server

A key passed to a React extension is visible to the browser. Use direct keys only
for local testing or user-supplied keys. The extension does not persist keys.
For production, route requests through an authenticated backend. Either configure
`baseURL: '/api/ai'` with no key (the backend implements the selected protocol), or
provide a custom transport:

```tsx
AI.configure({
  generate: async ({ messages, systemPrompt, signal }) => {
    const response = await fetch('/api/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt }),
      signal,
    });
    if (!response.ok) throw new Error('Unable to generate text.');
    const { text } = await response.json();
    return text;
  },
});
```

`generate` returns `Promise<string>` and replaces the built-in transport. It does
not require a model or API key in the frontend. Custom error messages are shown in
the UI; avoid including secrets in them. Your backend supplies provider credentials,
authenticates users, and enforces request limits.

## Options and behavior

| Option         | Default                        | Purpose                                                  |
| -------------- | ------------------------------ | -------------------------------------------------------- |
| `protocol`     | `'openai'`                     | OpenAI Chat Completions or Anthropic Messages            |
| `apiKey`       | `''`                           | Key or async key getter; omit for an authenticated proxy |
| `model`        | `''`                           | Required model ID for built-in requests                  |
| `baseURL`      | Provider `/v1` root            | API root, not a complete endpoint                        |
| `maxTokens`    | `2048`                         | Maximum generated tokens                                 |
| `headers`      | `{}`                           | Extra or overridden request headers                      |
| `systemPrompt` | Writing assistant instructions | Language matching and plain text output                  |
| `generate`     | `null`                         | Custom async transport                                   |

Only selected text, your prompt, tone, and successful conversation turns are sent.
The full document is not sent automatically. Requests are non-streaming; once a response arrives, the preview reveals it progressively with a typewriter effect (up to five seconds). Reduced-motion preferences show the full result immediately. Stop during the reveal shows the complete response, and Apply becomes available when the reveal finishes. Results
are inserted as plain text paragraphs, so generated HTML is never executed.
Apply replaces the captured selection or inserts at the captured cursor; it is
undoable with Tiptap history enabled. Discard never inserts the preview.

Document edits (including collaboration updates) close the session and cancel its
request to avoid overwriting changed content. Closing, stopping, or destroying the
editor aborts the active request. Changing the cursor alone preserves the target.

The playground enables AI and reads `VITE_AI_PROTOCOL`, `VITE_AI_MODEL`,
`VITE_AI_BASE_URL`, and `VITE_AI_API_KEY`; see `playground/.env.example`.

The preview is rendered as temporary paragraph DOM inside a ProseMirror block widget. It participates in document layout, so long results expand the editor and push following blocks down. It is excluded from saved HTML/JSON until Apply. The follow-up panel sits directly below the preview.

## Improve selected text

The default `RichTextBubbleText` toolbar includes **Improve** when AI is enabled.
Presets fix grammar, improve clarity, shorten text, or translate to Vietnamese/English.
They run immediately on the selected text and show a preview before Apply.
**Ask AI** opens an empty prompt for custom instructions.

For a custom `buttonBubble`, import `RichTextAIImprove` from
`reactjs-tiptap-editor/bubble/ai` and place it inside your toolbar.
You can also run a preset programmatically with
`editor.commands.openAI('Make the selected text more concise.')`.
Calling `openAI()` without a prompt retains the manual input flow.
