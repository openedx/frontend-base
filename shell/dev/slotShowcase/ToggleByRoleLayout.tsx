import { useState } from 'react';
import { Button } from '@openedx/paragon';
import { useWidgets } from '../../../runtime';

const highlitedRole = 'org.openedx.frontend.role.slotShowcase.highlighted';

export default function ToggleByRoleLayout() {
  const widgets = useWidgets();
  const [showHighlighted, setShowHighlighted] = useState(false);

  return (
    <div>
      <Button size="sm" variant="outline-primary" className="mb-2" onClick={() => setShowHighlighted(!showHighlighted)}>
        {showHighlighted ? 'Show all widgets' : 'Show only highlighted widgets'}
      </Button>
      <div>
        {showHighlighted ? widgets.byRole(highlitedRole) : widgets}
      </div>
    </div>
  );
}
