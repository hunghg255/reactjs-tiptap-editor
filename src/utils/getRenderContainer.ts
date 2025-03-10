import type { Editor } from '@tiptap/react';

export function getRenderContainer(editor: Editor, nodeType: string) {
  const {
    view,
    state: {
      selection: { from },
    },
  } = editor;

  const elements = document.querySelectorAll('.has-focus');
  const elementCount = elements.length;
  const innermostNode = elements[elementCount - 1];
  const element = innermostNode as any;

  if (
    (element && element.dataset.type && element.dataset.type === nodeType)
    || (element && element.classList && element.classList.contains(nodeType))
  ) {
    return element;
  }

  const node = view.domAtPos(from).node as HTMLElement;
  let container: any = node;

  if (!container.tagName) {
    container = node.parentElement;
  }

  while (
    container
    && !(container.dataset.type && container.dataset.type === nodeType)
    && !container.classList.contains(nodeType)
  ) {
    container = container.parentElement;
  }

  return container;
}

export default getRenderContainer;
