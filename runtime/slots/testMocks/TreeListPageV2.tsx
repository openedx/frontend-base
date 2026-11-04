// The "a slot whose default widget takes options" example from docs/how_tos/add-a-slot-version.md: where the app renders the slot, after step 2.
import TreeListSlot from './TreeListSlotV1V2';

const TreeListPage = () => (
  <TreeListSlot
    trees={[
      { id: 'teak', name: 'Teak', foliage: 'deciduous' },
      { id: 'sumac', name: 'Sumac', foliage: 'deciduous' },
      { id: 'redwood', name: 'Redwood', foliage: 'evergreen' },
    ]}
  />
);

export default TreeListPage;
