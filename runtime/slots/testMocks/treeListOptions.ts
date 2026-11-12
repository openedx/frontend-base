// The "a slot whose default widget takes options" example from docs/how_tos/add-a-slot-version.md: the operator's options operation.
import { WidgetOperation, WidgetOperationTypes } from '../widget/types';
import { Tree } from './TreeListSlotV1V2';

export const addQuinceV1: WidgetOperation = {
  slotId: 'org.openedx.frontend.slot.example.treeList.v1',
  op: WidgetOperationTypes.OPTIONS,
  relatedId: 'defaultContent',
  options: {
    trees: (current: Tree[]) => [...current, { id: 'quince', name: 'Quince' }],
  },
};
