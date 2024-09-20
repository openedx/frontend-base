import { createElement, ReactNode } from 'react';

interface MenuTriggerProps {
  tag?: string,
  className?: string,
  children: ReactNode,
  [key: string]: any,
}

const MenuTrigger = ({
  tag = 'div', className, children, ...props
}: MenuTriggerProps) => createElement(tag, {
  className: `menu-trigger ${className}`,
  ...props,
}, children);

export default MenuTrigger;
