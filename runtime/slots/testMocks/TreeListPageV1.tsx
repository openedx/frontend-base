// The "a slot whose default widget takes options" example from docs/how_tos/add-a-slot-version.md: where the app renders the slot, before the change.
import TreeListSlot from './TreeListSlotV1';

const TreeListPage = () => (
  <TreeListSlot
    trees={[
      { id: 'teak', name: 'Teak' },
      { id: 'sumac', name: 'Sumac' },
      { id: 'redwood', name: 'Redwood' },
    ]}
  />
);

export default TreeListPage;
