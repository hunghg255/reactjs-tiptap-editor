import { ReactRenderer } from '@tiptap/react';

import { updatePosition } from '@/utils/updatePosition';

export function renderNodeViewClosure(node: any) {
  return () => {
    let reactRenderer: any;

    return {
      onStart: (props: any) => {
        if (!props.clientRect) {
          return;
        }

        reactRenderer = new ReactRenderer(node, {
          props,
          editor: props.editor,
        });

        reactRenderer.element.style.position = 'absolute';

        document.body.appendChild(reactRenderer.element);

        updatePosition(props.editor, reactRenderer.element);
      },

      onUpdate(props: any) {
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }
        updatePosition(props.editor, reactRenderer.element);
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          reactRenderer.destroy();
          reactRenderer.element.remove();

          return true;
        }

        return reactRenderer.ref?.onKeyDown(props);
      },

      onExit() {
        reactRenderer.destroy();
        reactRenderer.element.remove();
      },
    };
  };
}
