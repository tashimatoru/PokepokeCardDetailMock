import classNames from 'classnames';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Img } from '../img';

import {
  containerStyle,
  imageStyle,
  reflectionLayerStyle,
} from './content.css';

type Props = {
  src: string;
  alt?: string;
  className?: string;
  reflectionLayerClassName?: string;
  style?: React.CSSProperties;
  /**
   * 最大傾き角度（X軸方向）
   */
  maxX?: number;
  /**
   * 最大傾き角度（Y軸方向）
   */
  maxY?: number;
  /**
   * 反射レイヤーを有効にする
   */
  enableReflectionLayer?: boolean;
  /**
   * ドロップ時に傾きをリセットしない
   */
  noResetOnDrop?: boolean;
};

export const Viewer = ({
  src,
  alt,
  className,
  reflectionLayerClassName,
  style,
  maxX = 30,
  maxY = 40,
  enableReflectionLayer = false,
  noResetOnDrop = false,
}: Props) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });

  // タッチイベントの安定化: タッチ開始時にmove座標をリセットし、タッチ終了時に傾きを必ずリセット
  const [touchActive, setTouchActive] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    setTouchActive(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const y = Math.max(-maxY, Math.min(maxY, dx / 2));
    const x = Math.max(-maxX, Math.min(maxX, -dy / 2));
    setTilt({ x, y });
  };
  const handleTouchEnd = () => {
    if (!noResetOnDrop) {
      setTilt({ x: 0, y: 0 });
    }
    setTouchActive(false);
  };

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - touchStart.current.x;
      const dy = e.clientY - touchStart.current.y;
      const y = Math.max(-maxY, Math.min(maxY, dx / 5));
      const x = Math.max(-maxX, Math.min(maxX, -dy / 5));
      setTilt({ x, y });
    },
    [isDragging, maxX, maxY]
  );

  const handleWindowMouseUp = useCallback(() => {
    setIsDragging(false);
    if (!noResetOnDrop) {
      setTilt({ x: 0, y: 0 });
    }
    window.removeEventListener('mousemove', handleWindowMouseMove);
    window.removeEventListener('mouseup', handleWindowMouseUp);
  }, [handleWindowMouseMove, noResetOnDrop]);

  useEffect(() => {
    if (!isDragging) {
      return;
    }
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, handleWindowMouseMove, handleWindowMouseUp]);

  if (!src) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    touchStart.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      className={containerStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Img
        src={src}
        alt={alt}
        className={classNames(imageStyle, className)}
        style={{
          transition: isDragging ? 'transform 0s' : 'transform 0.2s',
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          ...style,
        }}
        onMouseDown={handleMouseDown}
        draggable={false}
      />
      {/* 反射レイヤー */}
      {enableReflectionLayer && (
        <div
          className={classNames(reflectionLayerStyle, reflectionLayerClassName)}
          style={{
            background: `linear-gradient(${90 + tilt.y * 2}deg, rgba(255,255,255,${(Math.abs(tilt.x) + Math.abs(tilt.y)) / 80}) 40%, rgba(255,255,255,0) 80%)`,
            opacity: Math.abs(tilt.x) + Math.abs(tilt.y) > 5 ? 0.85 : 0,
            transition: isDragging
              ? 'none'
              : 'opacity 0.2s, background 0.2s, transform 0.2s',
            transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        />
      )}
    </div>
  );
};
