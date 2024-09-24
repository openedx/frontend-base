import classNames from 'classnames';
import { LinkMenuItem } from '../../types';

interface UserMenuProps {
  userMenuItems: Array<{
    heading: string,
    items: Array<LinkMenuItem>,
  }>
}

export default function UserMenu({ userMenuItems }: UserMenuProps) {
  return (
    <>
      {userMenuItems.map((group) => (
        group.items.map(({
          content, href, disabled, isActive, onClick,
        }) => (
          <li className="nav-item" key={href}>
            <a
              className={classNames(
                'nav-link',
                { active: isActive },
                { disabled },
              )}
              href={href}
              onClick={onClick}
            >
              {content}
            </a>
          </li>
        ))
      ))}
    </>
  );
}
