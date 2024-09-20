import { createElement, ReactNode } from 'react';

interface MenuContentProps {
  tag?: string,
  className?: string,
  children: ReactNode,
}

const MenuContent = ({
  tag = 'div', className, children, ...attributes
}: MenuContentProps) => createElement(tag, {
  className: ['menu-content', className].join(' '),
  ...attributes,
}, children);

export default MenuContent;
