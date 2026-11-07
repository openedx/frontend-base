// The "a slot whose default widget takes options" example from docs/how_tos/add-a-slot-version.md, after step 6: v1 removed.
import Slot from '../Slot';
import { useWidgetOptions } from '../widget/hooks';

export type Foliage = 'evergreen' | 'deciduous';

export interface TreeV2 {
  id: string;
  name: string;
  foliage: Foliage;
}

export interface TreeListSlotV2Props {
  trees: TreeV2[];
}

interface TreeListV2Options {
  trees?: TreeV2[] | ((current: TreeV2[]) => TreeV2[]);
}

const FOLIAGE_ICON: Record<Foliage, string> = { evergreen: '🌲', deciduous: '🌳' };

const DefaultTreeListWidget = ({ trees }: { trees: TreeV2[] }) => {
  const options = useWidgetOptions() as TreeListV2Options;
  const shown = typeof options.trees === 'function'
    ? options.trees(trees)
    : options.trees ?? trees;
  return (
    <ul>
      {shown.map(tree => <li key={tree.id}>{FOLIAGE_ICON[tree.foliage]} {tree.name}</li>)}
    </ul>
  );
};

const TreeListSlot = ({ trees }: TreeListSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.treeList.v2" trees={trees}>
    <DefaultTreeListWidget trees={trees} />
  </Slot>
);

export default TreeListSlot;
