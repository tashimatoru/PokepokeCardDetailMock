import classNames from 'classnames';
import { useState, useEffect, useCallback } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Type001 } from '../type001';

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
  style?: React.CSSProperties;
  onOpen?: () => void;
  onClose?: () => void;
};

export const Fullscreen = ({
  children,
  open = false,
  src,
  className,
  imageClassName,
  backdropClassName,
  onOpen,
  onClose,
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
        {stateOpen && <Type001 src={src} className={imageClassName} />}
        <div className={classNames(closeContainerStyle)} onClick={handleClose}>
          close
        </div>
      </Backdrop>
    </>
  );
};
