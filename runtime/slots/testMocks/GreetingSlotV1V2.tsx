// The "renaming a prop" example from docs/how_tos/add-a-slot-version.md, after step 3: v2 wrapping v1.
import Slot from '../Slot';

/** @deprecated Replaced by `GreetingSlotV2Props`, the props of `org.openedx.frontend.slot.example.greeting.v2`. */
export interface GreetingSlotV1Props {
  /** @deprecated Renamed to `displayName` in `GreetingSlotV2Props`. */
  userName: string;
}

/** @deprecated Renamed to `GreetingSlotV1Props`. */
export type GreetingSlotProps = GreetingSlotV1Props;

export interface GreetingSlotV2Props {
  displayName: string;
}

const GreetingSlot = ({ displayName }: GreetingSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.greeting.v2" displayName={displayName}>
    <Slot id="org.openedx.frontend.slot.example.greeting.v1" userName={displayName}>
      <h1>Hello, {displayName}</h1>
    </Slot>
  </Slot>
);

export default GreetingSlot;
