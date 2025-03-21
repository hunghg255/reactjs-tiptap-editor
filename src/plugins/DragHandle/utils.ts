/* eslint-disable @typescript-eslint/prefer-for-of */
import { type Editor } from '@tiptap/core';

export function cloneElement(node: HTMLElement) {
  const clonedNode: any = node.cloneNode(true);
  const originalElements = [node, ...Array.from(node.getElementsByTagName('*'))];
  const clonedElements = [clonedNode, ...Array.from(clonedNode.getElementsByTagName('*'))];
  originalElements.forEach((element, index) => {
    clonedElements[index].style.cssText = (function (element) {
      let styles = '';
      const computedStyles = getComputedStyle(element);
      for (let i = 0; i < computedStyles.length; i += 1) {
        styles += `${computedStyles[i]}:${computedStyles.getPropertyValue(computedStyles[i])};`;
      }
      return styles;
    })(element);
  });
  return clonedNode;
}
export function getComputedStyles(element: Element, styleProperty: any) {
  return window.getComputedStyle(element)[styleProperty];
}

export function minMax(value = 0, minimum = 0, maximum = 0) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function removeNode(node: HTMLElement) {
  if (node.parentNode !== null && node.parentNode !== undefined) {
    node.parentNode.removeChild(node);
  }
}
export type FindElementNextToCoords = {
  x: number
  y: number
  direction?: 'left' | 'right'
  editor: Editor
};
export function findElementNextToCoords (options: FindElementNextToCoords) {
  const { x, y, direction, editor } = options;
  let targetElement: any = null;
  let targetNode: any = null;
  let documentPosition: any = null;
  let currentX = x;

  for (; null === targetNode && currentX < window.innerWidth && currentX > 0;) {
    const elementsAtPoint = document.elementsFromPoint(currentX, y);
    const proseMirrorIndex = elementsAtPoint.findIndex(el => el.classList.contains('ProseMirror'));
    const relevantElements = elementsAtPoint.slice(0, proseMirrorIndex);

    if (relevantElements.length > 0) {
      const currentElement = relevantElements[0];
      targetElement = currentElement;
      documentPosition = editor.view.posAtDOM(currentElement, 0);

      if (documentPosition >= 0) {
        targetNode = editor.state.doc.nodeAt(Math.max(documentPosition - 1, 0));
        if (targetNode === null || targetNode.isText) {
          targetNode = editor.state.doc.nodeAt(Math.max(documentPosition - 1, 0));
        }
        if (!targetNode) {
          targetNode = editor.state.doc.nodeAt(Math.max(documentPosition, 0));
        }
        break;
      }
    }

    if (direction === 'left') {
      currentX -= 1;
    } else {
      currentX += 1;
    }
  }

  return {
    resultElement: targetElement,
    resultNode: targetNode,
    pos: documentPosition !== null ? documentPosition : null
  };
}
