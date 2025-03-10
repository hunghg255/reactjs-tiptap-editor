import React, { useCallback, useEffect, useRef, useState } from 'react';

import { NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import deepEqual from 'deep-equal';
import { Resizable } from 're-resizable';
import VisibilitySensor from 'react-visibility-sensor';

// import { clamp, getEditorContainerDOMSize } from '@/utils'
import { ActionButton } from '@/components/ActionButton';
import { Excalidraw } from '@/extensions/Excalidraw/Excalidraw';
import { clamp } from '@/utils/utils';

import styles from './index.module.scss';

const MIN_ZOOM = 10;
const MAX_ZOOM = 200;
const ZOOM_STEP = 15;

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%' };

function NodeViewExcalidraw({ editor, node, updateAttributes }: any) {
  const exportToSvgRef: any = useRef(null);
  // const isEditable = editor.isEditable
  const isActive = editor.isActive(Excalidraw.name);
  // const { width: maxWidth } = getEditorContainerDOMSize(editor)
  const { data, width, height } = node.attrs;
  const [Svg, setSvg] = useState<SVGElement | null>(null);
  const [loading, toggleLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [visible, toggleVisible] = useState(false);
  const [zoom, setZoomState] = useState(100);

  const onViewportChange = useCallback(
    (visible: any) => {
      if (visible) {
        toggleVisible(true);
      }
    },
    [toggleVisible],
  );

  const setZoom = useCallback((type: 'minus' | 'plus') => {
    return () => {
      setZoomState(currentZoom =>
        clamp(type === 'minus' ? currentZoom - ZOOM_STEP : currentZoom + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM),
      );
    };
  }, []);

  useEffect(() => {
    let isUnmount = false;

    import('@excalidraw/excalidraw')
      .then((res) => {
        if (!isUnmount) {
          exportToSvgRef.current = res.exportToSvg;
        }
      })
      .catch(err => !isUnmount && setError(err))
      .finally(() => !isUnmount && toggleLoading(false));

    return () => {
      isUnmount = true;
    };
  }, [toggleLoading, data]);

  useEffect(() => {
    let isUnmount = false;

    const setContent = async () => {
      if (isUnmount || loading || error || !visible || !data)
        return;

      const svg: SVGElement = await exportToSvgRef.current(data);

      if (isUnmount)
        return;

      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('display', 'block');

      setSvg(svg);
    };

    setContent();

    return () => {
      isUnmount = true;
    };
  }, [data, loading, error, visible]);

  const onResize = (size: any) => {
    updateAttributes({ width: size.width, height: size.height });
  };

  return (
    <NodeViewWrapper className={clsx(styles.wrap, isActive && styles.isActive)}>
      <VisibilitySensor onChange={onViewportChange}>
        <Resizable
          size={{ width: Number.parseInt(width), height: Number.parseInt(height) }}
          onResizeStop={(e, direction, ref, d) => {
            onResize({
              width: Number.parseInt(width) + d.width,
              height: Number.parseInt(height) + d.height,
            });
          }}
        >
          <div
            className={clsx(styles.renderWrap, 'render-wrapper')}
            style={{ ...INHERIT_SIZE_STYLE, overflow: 'hidden' }}
          >
            {error && (
              <div style={INHERIT_SIZE_STYLE}>
                <p>
                  {error.message || error}
                </p>
              </div>
            )}

            {loading && <p>
              Loading...
            </p>}

            {!loading && !error && visible && (
              <div
                dangerouslySetInnerHTML={{ __html: Svg?.outerHTML ?? '' }}
                style={{
                  height: '100%',
                  maxHeight: '100%',
                  padding: 24,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: `scale(${zoom / 100})`,
                  transition: 'all ease-in-out .3s',
                }}
              />
            )}

            <div className={styles.title}>
              {/* <Space>
                <span className={styles.icon}>
                  <IconMind />
                </span>
                绘图
              </Space> */}
            </div>

            <div className={styles.handlerWrap}>
              <ActionButton
                action={setZoom('minus')}
                icon="ZoomOut"
                tooltip="Zoom Out"
              />

              <ActionButton
                action={setZoom('plus')}
                icon="ZoomIn"
                tooltip="Zoom In"
              />
            </div>
          </div>
        </Resizable>
      </VisibilitySensor>
    </NodeViewWrapper>
  );
}

export default React.memo(NodeViewExcalidraw, (prevProps, nextProps) => {
  if (deepEqual(prevProps.node.attrs, nextProps.node.attrs)) {
    return true;
  }

  return false;
});
