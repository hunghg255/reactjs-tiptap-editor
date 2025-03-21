/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { NodeViewWrapper, isNumber } from '@tiptap/react';
import { throttle } from 'lodash-es';

import { IMAGE_MAX_SIZE, IMAGE_MIN_SIZE, IMAGE_THROTTLE_WAIT_TIME } from '@/constants';
import { clamp } from '@/utils/utils';

interface Size {
  width: number
  height: number
}

const ResizeDirection = {
  TOP_LEFT: 'tl',
  TOP_RIGHT: 'tr',
  BOTTOM_LEFT: 'bl',
  BOTTOM_RIGHT: 'br',
};

export function NodeViewDrawer({ editor, node, updateAttributes, getPos, selected }: any) {
  const [maxSize, setMaxSize] = useState<Size>({
    width: IMAGE_MAX_SIZE,
    height: IMAGE_MAX_SIZE,
  });

  const [originalSize, setOriginalSize] = useState({
    width: 0,
    height: 0,
  });

  const [resizeDirections] = useState<string[]>([
    ResizeDirection.TOP_LEFT,
    ResizeDirection.TOP_RIGHT,
    ResizeDirection.BOTTOM_LEFT,
    ResizeDirection.BOTTOM_RIGHT,
  ]);

  const [resizing, setResizing] = useState<boolean>(false);

  const [resizerState, setResizerState] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    dir: '',
  });

  const { align } = node?.attrs;

  const imgAttrs = useMemo(() => {
    const { src, alt, width: w, height: h } = node?.attrs;

    const width = isNumber(w) ? `${w}px` : w;
    const height = isNumber(h) ? `${h}px` : h;
    return {
      src: src || undefined,
      alt: alt || undefined,
      style: {
        width: width || undefined,
        height: height || undefined,
      },
    };
  }, [node?.attrs]);

  const imageMaxStyle = useMemo(() => {
    const {
      style: { width },
    } = imgAttrs;

    return { width: width === '100%' ? width : undefined };
  }, [imgAttrs]);

  function onImageLoad(e: Record<string, any>) {
    setOriginalSize({
      width: e.target.width,
      height: e.target.height,
    });
  }

  // https://github.com/scrumpy/tiptap/issues/361#issuecomment-540299541
  function selectImage() {
    editor.commands.setNodeSelection(getPos());
  }

  const getMaxSize = useCallback(
    throttle(() => {
      const { width } = getComputedStyle(editor.view.dom);
      setMaxSize((prev) => {
        return {
          ...prev,
          width: Number.parseInt(width, 10),
        };
      });
    }, IMAGE_THROTTLE_WAIT_TIME),
    [editor],
  );

  function onMouseDown(e: MouseEvent, dir: string) {
    e.preventDefault();
    e.stopPropagation();

    const originalWidth = originalSize.width;
    const originalHeight = originalSize.height;
    const aspectRatio = originalWidth / originalHeight;

    let width = Number(node.attrs.width);
    let height = Number(node.attrs.height);
    const maxWidth = maxSize.width;

    if (width && !height) {
      width = width > maxWidth ? maxWidth : width;
      height = Math.round(width / aspectRatio);
    } else if (height && !width) {
      width = Math.round(height * aspectRatio);
      width = width > maxWidth ? maxWidth : width;
    } else if (!width && !height) {
      width = originalWidth > maxWidth ? maxWidth : originalWidth;
      height = Math.round(width / aspectRatio);
    } else {
      width = width > maxWidth ? maxWidth : width;
    }

    setResizing(true);

    setResizerState({
      x: e.clientX,
      y: e.clientY,
      w: width,
      h: height,
      dir,
    });
  }

  const onMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!resizing) {
        return;
      }

      const { x, w, dir } = resizerState;

      const dx = (e.clientX - x) * (/l/.test(dir) ? -1 : 1);

      const { width: wI, height: hI } = node?.attrs;
      const ratio = wI / hI;

      const width = clamp(w + dx, IMAGE_MIN_SIZE, maxSize.width);
      const height = Math.round(width / ratio);

      updateAttributes({
        width,
        height,
      });
    }, IMAGE_THROTTLE_WAIT_TIME),
    [resizing, resizerState, maxSize, updateAttributes, node?.attrs],
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!resizing) {
        return;
      }

      setResizerState({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        dir: '',
      });
      setResizing(false);

      selectImage();
    },
    [resizing, selectImage],
  );

  const onEvents = useCallback(() => {
    document?.addEventListener('mousemove', onMouseMove, true);
    document?.addEventListener('mouseup', onMouseUp, true);
  }, [onMouseMove, onMouseUp]);

  const offEvents = useCallback(() => {
    document?.removeEventListener('mousemove', onMouseMove, true);
    document?.removeEventListener('mouseup', onMouseUp, true);
  }, [onMouseMove, onMouseUp]);

  useEffect(() => {
    if (resizing) {
      onEvents();
    } else {
      offEvents();
    }

    return () => {
      offEvents();
    };
  }, [resizing, onEvents, offEvents]);

  const resizeOb: ResizeObserver = useMemo(() => {
    return new ResizeObserver(() => getMaxSize());
  }, [getMaxSize]);

  useEffect(() => {
    resizeOb.observe(editor.view.dom);

    return () => {
      resizeOb.disconnect();
    };
  }, [editor.view.dom, resizeOb]);

  return (
    <NodeViewWrapper className="image-view"
      style={{ ...imageMaxStyle, width: '100%', textAlign: align }}
    >
      <div
        data-drag-handle
        draggable="true"
        style={{ ...imageMaxStyle, background: '#fff' }}
        className={`image-view__body ${selected ? 'image-view__body--focused' : ''} ${
          resizing ? 'image-view__body--resizing' : ''
        }`}
      >
        <img
          alt={imgAttrs.alt}
          className="image-view__body__image block"
          height="auto"
          onClick={selectImage}
          onLoad={onImageLoad}
          src={imgAttrs.src}
          style={imgAttrs.style}
        />

        {editor.view.editable && (selected || resizing) && (
          <div className="image-resizer">
            {resizeDirections?.map((direction) => {
              return (
                <span
                  className={`image-resizer__handler image-resizer__handler--${direction}`}
                  key={`image-dir-${direction}`}
                  onMouseDown={(e: any) => onMouseDown(e, direction)}
                >
                </span>
              );
            })}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
