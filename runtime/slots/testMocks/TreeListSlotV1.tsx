// The "a slot whose default widget takes options" example from docs/how_tos/add-a-slot-version.md, before the change.
import Slot from '../Slot';
import { useWidgetOptions } from '../widget/hooks';

export interface Tree {
  id: string;
  name: string;
}

export interface TreeListSlotProps {
  trees: Tree[];
}

interface TreeListOptions {
  trees?: Tree[] | ((current: Tree[]) => Tree[]);
}

const DefaultTreeListWidget = ({ trees }: { trees: Tree[] }) => {
  const options = useWidgetOptions() as TreeListOptions;
  const shown = typeof options.trees === 'function'
    ? options.trees(trees)
    : options.trees ?? trees;
  return (
    <ul>
      {shown.map(tree => <li key={tree.id}>{tree.name}</li>)}
    </ul>
  );
};

const TreeListSlot = ({ trees }: TreeListSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.treeList.v1" trees={trees}>
    <DefaultTreeListWidget trees={trees} />
  </Slot>
);

export default TreeListSlot;
