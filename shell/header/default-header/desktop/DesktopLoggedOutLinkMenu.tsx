import { LinkMenuItem } from '../../types';

interface DesktopLoggedOutLinkMenuProps {
  loggedOutItems: Array<LinkMenuItem>,
}

export default function DesktopLoggedOutLinkMenu({ loggedOutItems }: DesktopLoggedOutLinkMenuProps) {
  return (
    <>
      {loggedOutItems.map((item, i, arr) => (
        <a
          key={`${item.type}-${item.content}`}
          className={i < arr.length - 1 ? 'btn mr-2 btn-link' : 'btn mr-2 btn-outline-primary'}
          href={item.href}
        >
          {item.content}
        </a>
      ))}
    </>
  );
}
