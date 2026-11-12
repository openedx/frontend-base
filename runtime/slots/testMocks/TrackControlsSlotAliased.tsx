// The "renaming a slot" example from docs/how_tos/add-a-slot-version.md, after step 2: the old id kept as an alias.
import Slot from '../Slot';

export interface TrackControlsSlotProps {
  onPlay: () => void;
  onPause: () => void;
}

/** @deprecated Renamed to `TrackControlsSlotProps`. */
export type SongControlsSlotProps = TrackControlsSlotProps;

const TrackControlsSlot = ({ onPlay, onPause }: TrackControlsSlotProps) => (
  <Slot
    id="org.openedx.frontend.slot.example.trackControls.v1"
    idAliases={['org.openedx.frontend.slot.example.songControls.v1']}
    onPlay={onPlay}
    onPause={onPause}
  >
    <button type="button" onClick={onPlay}>Play</button>
    <button type="button" onClick={onPause}>Pause</button>
  </Slot>
);

export default TrackControlsSlot;
