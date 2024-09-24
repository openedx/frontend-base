import { Menu } from '@openedx/paragon';
import classNames from 'classnames';
import { LinkMenuItem } from '../../types';
import { MenuContent, MenuTrigger } from '../menu';

interface LinkMenuProps {
  menu: Array<LinkMenuItem>,
}

export default function LinkMenu({ menu }: LinkMenuProps) {
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
              className={classNames(
                'nav-link',
                { disabled },
                { active: isActive },
              )}
              href={href}
              onClick={onClick}
            >
              {content}
            </a>
          );
        }

        return (
          <Menu key={`${type}-${content}`} tag="div" className="nav-item">
            <MenuTrigger onClick={onClick || null} tag="a" role="button" tabIndex="0" className="nav-link">
              {content}
            </MenuTrigger>
            <MenuContent className="position-static pin-left pin-right py-2">
              {submenuContent}
            </MenuContent>
          </Menu>
        );
      })};
    </>
  );
}
