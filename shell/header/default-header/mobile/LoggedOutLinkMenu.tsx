import classNames from 'classnames';

interface LoggedOutMenuProps {
  loggedOutItems: Array<{
    href: string,
    content: string,
  }>
}

export default function LoggedOutMenu({ loggedOutItems }: LoggedOutMenuProps) {
  return (
    <>
      {loggedOutItems.map(({ href, content }, i, arr) => {
        const last = i === arr.length - 1;
        const buttonStyle = last ? 'btn-primary' : 'btn-outline-primary';
        return (
          <li className="nav-item px-3 my-2" key={`${href}`}>
            <a
              className={classNames(
                'btn btn-block',
                buttonStyle
              )}
              href={href}
            >
              {content}
            </a>
          </li>
        );
      })}
    </>
  );
}
