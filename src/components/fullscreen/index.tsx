import classNames from 'classnames';
import { useState, useEffect, useCallback } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Viewer } from '../type001';

import {
  containerStyle,
  backdropStyle,
  closeContainerStyle,
} from './content.css';

type Props = {
  children?: React.ReactNode;
  open?: boolean;
  src: string;
  className?: string;
  imageClassName?: string;
  backdropClassName?: string;
  reflectionLayerClassName?: string;
  style?: React.CSSProperties;
  onOpen?: () => void;
  onClose?: () => void;
  enableReflectionLayer?: boolean;
  noResetOnDrop?: boolean;
  maxX?: number;
  maxY?: number;
};

export const Fullscreen = ({
  children,
  open = false,
  src,
  className,
  imageClassName,
  reflectionLayerClassName,
  backdropClassName,
  onOpen,
  onClose,
  enableReflectionLayer = false,
  noResetOnDrop = false,
  maxX = 10,
  maxY = 20,
}: Props) => {
  // 開閉フラグ
  const [stateOpen, setStateOpen] = useState(open);

  useEffect(() => {
    setStateOpen(open);
  }, [open]);

  // open時にbodyのスクロールを禁止
  useEffect(() => {
    if (stateOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    // 閉じたときは必ず解除
    document.body.style.overflow = '';
  }, [stateOpen]);

  /**
   * backdrop開く
   */
  const handleOpen = useCallback(() => {
    setStateOpen(true);
    onOpen?.();
  }, [onOpen]);

  /**
   * backdrop閉じる
   */
  const handleClose = useCallback(() => {
    setStateOpen(false);
    onClose?.();
  }, [onClose]);

  return (
    <>
      <div
        className={classNames(containerStyle, className)}
        onClick={handleOpen}
      >
        {children}
      </div>

      <Backdrop
        open={!!stateOpen}
        className={classNames(backdropStyle, backdropClassName)}
      >
        {stateOpen && (
          <Viewer
            src={src}
            maxX={maxX}
            maxY={maxY}
            enableReflectionLayer={enableReflectionLayer}
            noResetOnDrop={noResetOnDrop}
            className={imageClassName}
            reflectionLayerClassName={reflectionLayerClassName}
          />
        )}
        <div className={classNames(closeContainerStyle)} onClick={handleClose}>
          close
        </div>
      </Backdrop>
    </>
  );
};
