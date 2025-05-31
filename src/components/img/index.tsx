import classNames from 'classnames';
import { wrapperStyle } from './content.css';

type Props = {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export const Img = ({ src, alt, className, style, ...other }: Props) => {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={classNames(wrapperStyle, className)}
      style={style}
      {...other}
    />
  );
};
