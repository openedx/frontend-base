// The "changing a prop's type" example from docs/how_tos/add-a-slot-version.md, after step 6: v1 removed.
import Slot from '../Slot';

export interface Notice {
  message: string;
  severity: 'info' | 'warning' | 'error';
  onDismiss: () => void;
}

export interface BannerSlotV2Props {
  notice: Notice;
}

// Stands in for the app's banner component, which the how-to does not show.
const Banner = ({ notice }: { notice: Notice }) => <div role="status" data-severity={notice.severity}>{notice.message}</div>;

const BannerSlot = ({ notice }: BannerSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.banner.v2" notice={notice}>
    <Banner notice={notice} />
  </Slot>
);

export default BannerSlot;
