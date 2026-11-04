// The "changing a prop's type" example from docs/how_tos/add-a-slot-version.md, after step 3: v2 wrapping v1.
import Slot from '../Slot';

/** @deprecated Replaced by `BannerSlotV2Props`, the props of `org.openedx.frontend.slot.example.banner.v2`. */
export interface BannerSlotV1Props {
  /** @deprecated Replaced by `notice` in `BannerSlotV2Props`; this is `notice.message`. */
  message: string;
}

/** @deprecated Renamed to `BannerSlotV1Props`. */
export type BannerSlotProps = BannerSlotV1Props;

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
    <Slot id="org.openedx.frontend.slot.example.banner.v1" message={notice.message}>
      <Banner notice={notice} />
    </Slot>
  </Slot>
);

export default BannerSlot;
