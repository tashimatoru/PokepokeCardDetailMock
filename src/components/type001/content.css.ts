import { style } from '@vanilla-extract/css';

export const containerStyle = style({
  position: 'relative',
  display: 'inline-block',
  userSelect: 'none',
});

export const imageStyle = style({
  display: 'flex',
});

export const reflectionLayerStyle = style({
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: '8px',
});
