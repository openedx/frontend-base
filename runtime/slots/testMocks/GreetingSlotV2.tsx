// The "renaming a prop" example from docs/how_tos/add-a-slot-version.md, after step 6: v1 removed.
import Slot from '../Slot';

export interface GreetingSlotV2Props {
  displayName: string;
}

const GreetingSlot = ({ displayName }: GreetingSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.greeting.v2" displayName={displayName}>
    <h1>Hello, {displayName}</h1>
  </Slot>
);

export default GreetingSlot;
