import React, { useRef, useState } from 'react';
import useDraggable from '@hooks/useDraggable';
import './DraggleLayout.less';

interface DraggleProps {
  /**两列布局 */
  children: React.ReactNode;
  /**左侧最小宽度 */
  min: number;
  /**左侧最大宽度 */
  max: number;
  /**容器宽度 */
  containerWidth?: number | string;
  /**容器高度*/
  containerHeight?: number | string;
  /**初始左侧容器宽度 */
  initLeftWidth?: number;
  /**拖拽器 */
  handler?: any;
  /** 左侧宽度变化是触发*/
  onWidthChange?: (width: number) => void;
  /**侧边栏的显隐 */
  hide?: boolean;
}

const DraggleLayout = (prop: DraggleProps) => {
  const {
    children,
    min = 0,
    max = Infinity,
    containerWidth = '100%',
    containerHeight = '100vh',
    initLeftWidth = min,
    handler = true,
    onWidthChange = (width) => width,
    hide = false
  } = prop;
  const ref = useRef<any>(null);

  const [position, setPosition] = useState({ x: initLeftWidth, y: 0 });

  const [props] = useDraggable(
    ref,
    {
      onMouseMove: ({ x, y }) => {
        let _x = x;
        if (_x < min) _x = min;
        if (_x > max) _x = max;
        if (onWidthChange) onWidthChange(_x);
        setPosition({ x: _x, y });
      }
    },
    { overBound: false }
  );
  const _handler = () => {
    if (typeof handler === 'boolean') {
      if (!handler) return;

      return (
        <div
          style={{
            width: 2,
            height: '100%',
            // background: '#e8e8e8',
            pointerEvents: 'none'
          }}
        />
      );
    }

    if (handler) {
      return React.cloneElement(handler, {
        ...handler.props,
        style: {
          ...handler.props.style,
          pointerEvents: 'none'
        }
      });
    }
  };

  const _handlerDom = _handler();

  return (
    <div
      ref={ref}
      className="draggle-layout-root"
      style={{ width: containerWidth, height: containerHeight }}
    >
      <div className="draggle-layout-left" style={{ width: position.x }}>
        {children![0]}

        {_handlerDom ? (
          <div className="draggle-layout-handler" {...props}>
            {_handlerDom}
          </div>
        ) : (
          <div
            className="draggle-layout-handler"
            style={{
              height: '100%',
              width: 1,
              background: '#e8e8e8',
              cursor: 'default'
            }}
          ></div>
        )}
      </div>
      <div
        className="draggle-layout-right"
        style={{ width: ref?.current?.clientWidth - position.x || '' }}
      >
        {children![1]}
      </div>
    </div>
  );
};

export default DraggleLayout;
