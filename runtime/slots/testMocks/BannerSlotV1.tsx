// The "changing a prop's type" example from docs/how_tos/add-a-slot-version.md, before the change.
import Slot from '../Slot';

// Stands in for the app's banner component, which the how-to does not show.
const Banner = ({ message }: { message: string }) => <div role="status">{message}</div>;

export interface BannerSlotProps {
  message: string;
}

const BannerSlot = ({ message }: BannerSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.banner.v1" message={message}>
    <Banner message={message} />
  </Slot>
);

export default BannerSlot;
