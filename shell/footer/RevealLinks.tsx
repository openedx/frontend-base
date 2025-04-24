import { Button, Collapsible } from '@openedx/paragon';
import { ExpandLess, ExpandMore } from '@openedx/paragon/icons';

import { useLayoutOptions, useWidgets } from '../../runtime';
import messages from '../Shell.messages';

export default function RevealLinks() {
  const widgets = useWidgets();
  const options = useLayoutOptions();

  const label: any = options.label ?? messages['footer.revealLinks.more'];

  if (widgets.length === 0) {
    return (
      <div className="border-top" />
    );
  }

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
          {widgets}
        </div>
      </Collapsible.Body>
    </Collapsible.Advanced>
  );
}
