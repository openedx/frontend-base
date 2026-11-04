// The "a prop that becomes a list" example from docs/how_tos/add-a-slot-version.md, after step 3: v2 wrapping v1.
import Slot from '../Slot';

/** @deprecated Replaced by `TaggableItemSlotV2Props`, the props of `org.openedx.frontend.slot.example.taggableItem.v2`. */
export interface TaggableItemSlotV1Props {
  /** @deprecated This is the first of `selectedTags`, or an empty string when there are none. Read `selectedTags` instead. */
  selectedTag: string;
  selectedTags: string[];
}

/** @deprecated Renamed to `TaggableItemSlotV1Props`. */
export type TaggableItemSlotProps = TaggableItemSlotV1Props;

export interface TaggableItemSlotV2Props {
  selectedTags: string[];
}

const TaggableItemSlot = ({ selectedTags }: TaggableItemSlotV2Props) => {
  // v1 takes a single tag. This example gives it the first of the list, or an empty string when the list is empty.
  const selectedTag = selectedTags[0] ?? '';
  return (
    <Slot id="org.openedx.frontend.slot.example.taggableItem.v2" selectedTags={selectedTags}>
      <Slot id="org.openedx.frontend.slot.example.taggableItem.v1" selectedTag={selectedTag} selectedTags={selectedTags}>
        <p>Tagged {selectedTags.join(', ')}</p>
      </Slot>
    </Slot>
  );
};

export default TaggableItemSlot;
