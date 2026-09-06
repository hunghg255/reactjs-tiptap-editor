import { ReactRenderer } from '@tiptap/react';

import { updatePosition } from '@/utils/updatePosition';

import type {
  SuggestionOptions,
  SuggestionProps,
  SuggestionKeyDownProps,
} from '@tiptap/suggestion';
import type { ComponentType } from 'react';

export interface SuggestionHandle {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

export function renderNodeViewClosure<T, TSelected = T>(
  node: ComponentType<SuggestionProps<T, TSelected>>
): NonNullable<SuggestionOptions<T, TSelected>['render']> {
  return () => {
    let renderer: ReactRenderer<SuggestionHandle, SuggestionProps<T, TSelected>> | undefined;
    const destroy = () => {
      renderer?.destroy();
      renderer?.element.remove();
      renderer = undefined;
    };
    return {
      onStart(props) {
        if (!props.clientRect) return;
        renderer = new ReactRenderer(node, { props, editor: props.editor });
        renderer.element.style.position = 'absolute';
        document.body.appendChild(renderer.element);
        updatePosition(props.editor, renderer.element);
      },
      onUpdate(props) {
        if (!renderer) return;
        renderer.updateProps(props);
        if (props.clientRect) updatePosition(props.editor, renderer.element);
      },
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          destroy();
          return true;
        }
        return renderer?.ref?.onKeyDown(props) ?? false;
      },
      onExit: destroy,
    };
  };
}
