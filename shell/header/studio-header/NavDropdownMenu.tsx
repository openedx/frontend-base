import {
  Dropdown,
  DropdownButton,
} from '@openedx/paragon';
import { ReactNode } from 'react';

interface NavDropdownMenuProps {
  id: string,
  buttonTitle: string | ReactNode,
  items: Array<{
    href: string,
    title: string,
  }>,
}

export default function NavDropdownMenu({
  id,
  buttonTitle,
  items,
}: NavDropdownMenuProps) {
  return (
    <DropdownButton
      id={id}
      title={buttonTitle}
      variant="outline-primary"
      className="mr-2"
    >
      {items.map(item => (
        <Dropdown.Item
          key={`${item.title}-dropdown-item`}
          href={item.href}
          className="small"
        >
          {item.title}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
