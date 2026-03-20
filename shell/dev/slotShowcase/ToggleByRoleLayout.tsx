import { useState } from 'react';
import { useWidgets } from '../../../runtime';

const highlitedRole = 'org.openedx.frontend.role.slotShowcase.highlighted';

export default function ToggleByRoleLayout() {
  const widgets = useWidgets();
  const [showHighlighted, setShowHighlighted] = useState(false);

  return (
    <div>
      <button type="button" className="btn btn-sm btn-outline-primary mb-2" onClick={() => setShowHighlighted(!showHighlighted)}>
        {showHighlighted ? 'Show all widgets' : 'Show only highlighted widgets'}
      </button>
      <div>
        {showHighlighted ? widgets.byRole(highlitedRole) : widgets}
      </div>
    </div>
  );
}
