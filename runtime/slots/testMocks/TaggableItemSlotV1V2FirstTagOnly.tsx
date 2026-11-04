// The "a prop that becomes a list" example from docs/how_tos/add-a-slot-version.md, after step 1's first two blocks: v2 wrapping v1, before selectedTags is added to v1.
import Slot from '../Slot';

export interface TaggableItemSlotV1Props {
  selectedTag: string;
}

export type TaggableItemSlotProps = TaggableItemSlotV1Props;

export interface TaggableItemSlotV2Props {
  selectedTags: string[];
}

const TaggableItemSlot = ({ selectedTags }: TaggableItemSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.taggableItem.v2" selectedTags={selectedTags}>
    <Slot id="org.openedx.frontend.slot.example.taggableItem.v1" selectedTag={selectedTags[0] ?? ''}>
      <p>Tagged {selectedTags.join(', ')}</p>
    </Slot>
  </Slot>
);

export default TaggableItemSlot;
