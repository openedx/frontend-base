// The "a prop that becomes a list" example from docs/how_tos/add-a-slot-version.md, after step 6: v1 removed.
import Slot from '../Slot';

export interface TaggableItemSlotV2Props {
  selectedTags: string[];
}

const TaggableItemSlot = ({ selectedTags }: TaggableItemSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.taggableItem.v2" selectedTags={selectedTags}>
    <p>Tagged {selectedTags.join(', ')}</p>
  </Slot>
);

export default TaggableItemSlot;
