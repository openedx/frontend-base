import { createElement, ReactNode } from 'react';

interface MenuContentProps {
  tag?: string,
  className?: string,
  children: ReactNode,
  [key: string]: any,
}

const MenuContent = ({
  tag = 'div', className, children, ...props
}: MenuContentProps) => createElement(tag, {
  className: ['menu-content', className].join(' '),
  ...props,
}, children);

export default MenuContent;
