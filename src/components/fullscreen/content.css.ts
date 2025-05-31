import { style } from '@vanilla-extract/css';

export const containerStyle = style({
  display: 'inline-block',
  cursor: 'pointer',
  userSelect: 'none',
});

export const backdropStyle = style({
  // NOP
});

export const closeContainerStyle = style({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '5px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  cursor: 'pointer',
});
