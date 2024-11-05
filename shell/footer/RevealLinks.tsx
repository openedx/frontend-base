import { Button, Collapsible } from '@openedx/paragon';
import { ExpandLess, ExpandMore } from '@openedx/paragon/icons';
import { useContext } from 'react';

import MenuItem from '../menus/MenuItem';
import FooterContext from './FooterContext';

export default function RevealLinks() {
  const { revealMenu } = useContext(FooterContext);

  if (revealMenu === undefined) {
    return (
      <div className="border-top" />
    );
  }

  const { label, links } = revealMenu;

  return (
    <Collapsible.Advanced>
      <div className="d-flex align-items-center">
        <div className="border-top mr-2 flex-grow-1" />
        <Collapsible.Trigger>
          <Button
            data-testid="helpToggleButton"
            variant="outline-primary"
            size="sm"
          >
            <span className="pr-1">{label}</span>
            <Collapsible.Visible whenClosed><ExpandMore /></Collapsible.Visible>
            <Collapsible.Visible whenOpen><ExpandLess /></Collapsible.Visible>
          </Button>
        </Collapsible.Trigger>
        <div className="border-top ml-2 flex-grow-1" />
      </div>
      <Collapsible.Body>
        <div className="d-flex justify-content-center gap-3 align-items-center my-3">
          {links.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </Collapsible.Body>
    </Collapsible.Advanced>
  );
}
