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
  style?: React.CSSProperties;
};

export const Type001 = ({ src, alt, className, style }: Props) => {
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
    const maxY = 40;
    const maxX = 30;
    const y = Math.max(-maxY, Math.min(maxY, dx / 2));
    const x = Math.max(-maxX, Math.min(maxX, -dy / 2));
    setTilt({ x, y });
  };
  const handleTouchEnd = () => {
    setTilt({ x: 0, y: 0 });
    setTouchActive(false);
  };

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - touchStart.current.x;
      const dy = e.clientY - touchStart.current.y;
      const maxY = 30;
      const maxX = 20;
      const y = Math.max(-maxY, Math.min(maxY, dx / 5));
      const x = Math.max(-maxX, Math.min(maxX, -dy / 5));
      setTilt({ x, y });
    },
    [isDragging]
  );

  const handleWindowMouseUp = useCallback(() => {
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
    window.removeEventListener('mousemove', handleWindowMouseMove);
    window.removeEventListener('mouseup', handleWindowMouseUp);
  }, [handleWindowMouseMove]);

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
    <div className={containerStyle}
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
      <div
        className={reflectionLayerStyle}
        style={{
          background: `linear-gradient(${90 + tilt.y * 2}deg, rgba(255,255,255,${(Math.abs(tilt.x) + Math.abs(tilt.y)) / 80}) 40%, rgba(255,255,255,0) 80%)`,
          opacity: Math.abs(tilt.x) + Math.abs(tilt.y) > 5 ? 0.85 : 0,
          transition: isDragging
            ? 'none'
            : 'opacity 0.2s, background 0.2s, transform 0.2s',
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      />
    </div>
  );
};
