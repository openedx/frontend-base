// The "renaming a prop" example from docs/how_tos/add-a-slot-version.md, before the change.
import Slot from '../Slot';

export interface GreetingSlotProps {
  userName: string;
}

const GreetingSlot = ({ userName }: GreetingSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.greeting.v1" userName={userName}>
    <h1>Hello, {userName}</h1>
  </Slot>
);

export default GreetingSlot;
