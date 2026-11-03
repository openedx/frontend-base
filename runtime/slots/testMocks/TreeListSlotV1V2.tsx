// The "a slot whose default widget takes options" example from docs/how_tos/add-a-slot-version.md, after step 3: v2 wrapping v1.
import Slot from '../Slot';
import { useWidgetOptions, useWidgetOptionsForId } from '../widget/hooks';

/** @deprecated Replaced by `TreeV2`, which adds `foliage`. */
export interface TreeV1 {
  id: string;
  name: string;
}

/** @deprecated Renamed to `TreeV1`. */
export type Tree = TreeV1;

/** @deprecated Replaced by `TreeListSlotV2Props`, the props of `org.openedx.frontend.slot.example.treeList.v2`. */
export interface TreeListSlotV1Props {
  /** @deprecated `trees` in `TreeListSlotV2Props` is `TreeV2[]`. A `v1` option cannot set a tree's foliage. */
  trees: TreeV1[];
}

/** @deprecated Renamed to `TreeListSlotV1Props`. */
export type TreeListSlotProps = TreeListSlotV1Props;

export type Foliage = 'evergreen' | 'deciduous';

export interface TreeV2 {
  id: string;
  name: string;
  foliage: Foliage;
}

export interface TreeListSlotV2Props {
  trees: TreeV2[];
}

type TreeListV1Option = TreeV1[] | ((current: TreeV1[]) => TreeV1[]);

interface TreeListV1Options {
  trees?: TreeListV1Option;
}

interface TreeListV2Options {
  trees?: TreeV2[] | ((current: TreeV2[]) => TreeV2[]);
}

const toTreeV1 = ({ foliage, ...tree }: TreeV2): TreeV1 => tree;

type ShownTree = TreeV1 & { foliage?: Foliage };

// A v1 option sees and returns v1 trees. A tree it kept gets its foliage back by id; a tree it added has none.
function applyV1Option(option: TreeListV1Option | undefined, trees: TreeV2[]): ShownTree[] {
  const v1Trees = trees.map(toTreeV1);
  const result = typeof option === 'function' ? option(v1Trees) : option ?? v1Trees;
  const foliageOf = (id: string) => trees.find(tree => tree.id === id)?.foliage;
  return result.map(tree => ({ ...tree, foliage: foliageOf(tree.id) }));
}

const FOLIAGE_ICON: Record<Foliage, string> = { evergreen: '🌲', deciduous: '🌳' };

const DefaultTreeListWidget = ({ trees }: { trees: TreeV2[] }) => {
  // While v1 is wrapped, this widget is v1's defaultContent, so useWidgetOptions() reads v1's options.
  const v1Options = useWidgetOptions() as TreeListV1Options;
  const v2Options = useWidgetOptionsForId('org.openedx.frontend.slot.example.treeList.v2', 'defaultContent') as TreeListV2Options;
  const v2Trees = typeof v2Options.trees === 'function'
    ? v2Options.trees(trees)
    : v2Options.trees ?? trees;
  const shown = applyV1Option(v1Options.trees, v2Trees);
  return (
    <ul>
      {shown.map(tree => <li key={tree.id}>{tree.foliage ? FOLIAGE_ICON[tree.foliage] : '🪾'} {tree.name}</li>)}
    </ul>
  );
};

const TreeListSlot = ({ trees }: TreeListSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.treeList.v2" trees={trees}>
    <Slot id="org.openedx.frontend.slot.example.treeList.v1" trees={trees.map(toTreeV1)}>
      <DefaultTreeListWidget trees={trees} />
    </Slot>
  </Slot>
);

export default TreeListSlot;
