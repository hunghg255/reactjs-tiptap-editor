export type KatexRenderer = typeof import('katex').default;
export type KatexLoader = () => Promise<KatexRenderer>;

const defaultLoader: KatexLoader = () => import('katex').then((module) => module.default);
const pending = new WeakMap<KatexLoader, Promise<KatexRenderer>>();

/** Share a renderer across node views/dialogs, without caching failed loads. */
export function loadKatex(loader: KatexLoader = defaultLoader): Promise<KatexRenderer> {
  let result = pending.get(loader);
  if (!result) {
    result = Promise.resolve()
      .then(loader)
      .catch((error: unknown) => {
        pending.delete(loader);
        throw error;
      });
    pending.set(loader, result);
  }
  return result;
}
