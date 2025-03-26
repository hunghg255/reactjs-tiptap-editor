import type { EditorState } from '@tiptap/pm/state';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const uploadKey = new PluginKey('upload-image');

interface UploadAction {
  add?: Array<{ id: string, pos: number, src: string }>
  remove?: string[]
}

export function UploadImagesPlugin() {
  return new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr: any, set: any) {
        set = set.map(tr.mapping, tr.doc);
        const action = tr.getMeta(uploadKey) as UploadAction;

        if (action?.add) {
          for (const { id, pos, src } of action.add) {
            const placeholder = createPlaceholder(src);
            const deco = Decoration.widget(pos, placeholder, { id });
            set = set.add(tr.doc, [deco]);
          }
        } else if (action?.remove) {
          for (const id of action.remove) {
            set = set.remove(set.find(undefined, undefined, (spec: any) => spec.id === id));
          }
        }

        return set;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });
}

function createPlaceholder(src: string): HTMLElement {
  const placeholder = document.createElement('div');
  const image = document.createElement('img');
  image.setAttribute('class', 'opacity-50');
  image.src = src;
  image.addEventListener('load', () => {
    placeholder.setAttribute('class', 'img-placeholder');
  });
  placeholder.append(image);
  return placeholder;
}

function findPlaceholder(state: EditorState, id: string): number | null {
  const decos = uploadKey.getState(state) as DecorationSet;
  const found = decos.find(undefined, undefined, spec => spec.id === id);
  return found.length > 0 ? found[0]?.from : null;
}

export interface ImageUploadOptions {
  validateFn?: (file: File) => boolean
  onUpload: (file: File) => Promise<string | object>
  postUpload?: (src: string) => Promise<string>
  defaultInline?: boolean
}

export type UploadFn = (files: File[], view: EditorView, pos: number) => void;

export function createImageUpload({ validateFn, onUpload, postUpload, defaultInline = false }: ImageUploadOptions): UploadFn {
  return (files, view, pos) => {
    for (const file of files) {
      if (validateFn && !validateFn(file)) {
        continue;
      }

      const id = Date.now().toString();
      const tr = view.state.tr;
      if (!tr.selection.empty) {
        tr.deleteSelection();
      }

      const result = URL.createObjectURL(file);
      tr.setMeta(uploadKey, {
        add: [{ id, pos, src: result }],
      });
      view.dispatch(tr);

      onUpload(file).then(
        async (src) => {
          if (postUpload && typeof src === 'string') {
            src = await postUpload(src);
          }

          const { schema } = view.state;
          let placeholderPos = findPlaceholder(view.state, id);
          if (placeholderPos === null) {
            return;
          }

          const imageSrc = typeof src === 'object' ? result : src;
          const node = schema.nodes.image?.create({
            src: imageSrc,
            inline: defaultInline
          });
          if (!node) {
            return;
          }

          // check position larger than doc.content.size
          const { doc } = view.state;
          if (placeholderPos > doc.content.size) {
            placeholderPos = doc.content.size - 1;
          }

          const transaction = view.state.tr
            .replaceWith(placeholderPos, placeholderPos, node)
            .setMeta(uploadKey, { remove: [id] });

          view.dispatch(transaction);
        },
        () => {
          const transaction = view.state.tr.delete(pos, pos).setMeta(uploadKey, { remove: [id] });
          view.dispatch(transaction);
        },
      );
    }
  };
}

export function handleImagePaste(view: EditorView, event: ClipboardEvent, uploadFn: UploadFn): boolean {
  const files = [...(event.clipboardData?.files || [])];
  if (files.length > 0) {
    event.preventDefault();
    const pos = view.state.selection.from;
    uploadFn(files, view, pos + 1);
    return true;
  }
  return false;
}

export function handleImageDrop(view: EditorView, event: DragEvent, moved: boolean, uploadFn: UploadFn): boolean {
  const files = [...(event.dataTransfer?.files || [])];
  if (!moved && files.length > 0) {
    event.preventDefault();
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    if (coordinates) {
      uploadFn(files, view, coordinates.pos + 1);
      return true;
    }
  }
  return false;
}
