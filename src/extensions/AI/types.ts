export type AIProtocol = 'openai' | 'anthropic';
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}
export interface AIRequest {
  messages: AIMessage[];
  systemPrompt: string;
  signal: AbortSignal;
}
export interface AIOptions {
  protocol: AIProtocol;
  apiKey: string | (() => string | Promise<string>);
  /** API root including /v1. A same-origin proxy can omit apiKey. */
  baseURL: string;
  /** Required when using the built-in transport. */
  model: string;
  maxTokens: number;
  headers: Record<string, string>;
  systemPrompt: string;
  /** Override transport, for example to call your authenticated backend. */
  generate: ((request: AIRequest) => Promise<string>) | null;
}
