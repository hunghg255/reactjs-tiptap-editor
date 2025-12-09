import * as React from 'react';

import { type Editor } from '@tiptap/core';
import { useCurrentEditor, useEditorState as useEditorStateTiptap } from '@tiptap/react';

/**
 * Hook that provides access to a Tiptap editor instance.
 *
 * Accepts an optional editor instance directly, or falls back to retrieving
 * the editor from the Tiptap context if available. This allows components
 * to work both when given an editor directly and when used within a Tiptap
 * editor context.
 *
 * @param providedEditor - Optional editor instance to use instead of the context editor
 * @returns The provided editor or the editor from context, whichever is available
 */
export function useTiptapEditor(providedEditor?: Editor | null): {
  editor: Editor | null
  editorState?: Editor['state']
  canCommand?: Editor['can']
} {
  const { editor: coreEditor } = useCurrentEditor();
  const mainEditor = React.useMemo(
    () => providedEditor || coreEditor,
    [providedEditor, coreEditor]
  );

  const editorState = useEditorStateTiptap({
    editor: mainEditor,
    selector(context) {
      if (!context.editor) {
        return {
          editor: null,
          editorState: undefined,
          canCommand: undefined,
        };
      }

      return {
        editor: context.editor,
        editorState: context.editor.state,
        canCommand: context.editor.can,
      };
    },
  });

  return editorState || { editor: null };
}

function useEditorInstance () {
  const editor = useTiptapEditor().editor;
  return editor as Editor;
}

function useEditorState () {
  const editorState = useTiptapEditor().editorState;
  return editorState;
}

function useCanCommand () {
  const canCommand = useTiptapEditor().canCommand;
  return canCommand;
}

export {
  useEditorInstance,
  useEditorState,
  useCanCommand,
};
