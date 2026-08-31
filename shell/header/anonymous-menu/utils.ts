import { ElementType } from 'react';
import { Link } from 'react-router-dom';

interface LinkProps {
  as?: ElementType;
  to?: string;
  href?: string;
}

/**
 * Builds the props needed to link to a URL, keeping navigation inside the
 * client when the URL is a route in this site rather than an external one.
 */
export function getLinkProps(url: string): LinkProps {
  if (url.startsWith('/')) {
    return { as: Link, to: url };
  }
  return { href: url };
}
