// The "a prop that becomes a list" example from docs/how_tos/add-a-slot-version.md, before the change.
import Slot from '../Slot';

export interface TaggableItemSlotProps {
  selectedTag: string;
}

const TaggableItemSlot = ({ selectedTag }: TaggableItemSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.taggableItem.v1" selectedTag={selectedTag}>
    <p>Tagged {selectedTag}</p>
  </Slot>
);

export default TaggableItemSlot;
