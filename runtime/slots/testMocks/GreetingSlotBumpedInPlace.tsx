// The "renaming a prop" example from docs/how_tos/add-a-slot-version.md, the second thing it says not to do: the version bumped in place.
import Slot from '../Slot';

export interface GreetingSlotProps {
  displayName: string;
}

const GreetingSlot = ({ displayName }: GreetingSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.greeting.v2" displayName={displayName}>
    <h1>Hello, {displayName}</h1>
  </Slot>
);

export default GreetingSlot;
