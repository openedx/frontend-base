import classNames from 'classnames';
import { AvatarIcon } from './Icons';

interface AvatarProps {
  size?: string
  src?: string,
  alt?: string,
  className?: string,
}

export default function Avatar({
  size = '2rem',
  src,
  alt,
  className,
}: AvatarProps) {
  const avatar = src ? (
    <img className="d-block w-100 h-100" src={src} alt={alt} />
  ) : (
    <AvatarIcon style={{ width: size, height: size }} role="img" aria-hidden focusable="false" />
  );

  return (
    <span
      style={{ height: size, width: size }}
      className={classNames(
        'avatar overflow-hidden d-inline-flex rounded-circle',
        className
      )}
    >
      {avatar}
    </span>
  );
}
