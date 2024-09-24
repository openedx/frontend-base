import { LinkMenuItem } from '../../types';
import { CaretIcon } from '../Icons';
import { Menu, MenuContent, MenuTrigger } from '../menu';

interface DesktopLinkMenuProps {
  menu: Array<LinkMenuItem>,
}

export default function DesktopLinkMenu({ menu }: DesktopLinkMenuProps) {
  return (
    <>
      {menu.map((menuItem) => {
        const {
          type,
          href,
          content,
          submenuContent,
          disabled,
          isActive,
          onClick,
        } = menuItem;

        if (type === 'item') {
          return (
            <a
              key={`${type}-${content}`}
              className={`nav-link${disabled ? ' disabled' : ''}${isActive ? ' active' : ''}`}
              href={href}
              onClick={onClick}
            >
              {content}
            </a>
          );
        }

        return (
          <Menu key={`${type}-${content}`} tag="div" className="nav-item" respondToPointerEvents>
            <MenuTrigger onClick={onClick || null} tag="a" className="nav-link d-inline-flex align-items-center" href={href}>
              {content} <CaretIcon role="img" aria-hidden focusable="false" />
            </MenuTrigger>
            <MenuContent className="pin-left pin-right shadow py-2">
              {submenuContent}
            </MenuContent>
          </Menu>
        );
      })}
    </>
  );
}
