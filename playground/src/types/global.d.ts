declare global {
  interface Window {
    ENV: typeof process.env;
    editor?: import('@tiptap/core').Editor | null;
  }
}
export {};
