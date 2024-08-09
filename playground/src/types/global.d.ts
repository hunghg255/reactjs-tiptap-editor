declare global {
  interface Window {
    ENV: typeof process.env;
  }
}
export {};
