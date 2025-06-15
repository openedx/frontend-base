import { CSSProperties } from 'react';

interface ImageProps {
  src: string,
  alt?: string,
  style?: CSSProperties,
}

const Image = ({ alt, ...rest }: ImageProps) => <img alt={alt} {...rest} />;

export default Image;
