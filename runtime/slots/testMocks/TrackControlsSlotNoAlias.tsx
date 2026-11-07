// The "renaming a slot" example from docs/how_tos/add-a-slot-version.md, what it says not to do: the id renamed in place.
import Slot from '../Slot';

export interface TrackControlsSlotProps {
  onPlay: () => void;
  onPause: () => void;
}

const TrackControlsSlot = ({ onPlay, onPause }: TrackControlsSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.trackControls.v1" onPlay={onPlay} onPause={onPause}>
    <button type="button" onClick={onPlay}>Play</button>
    <button type="button" onClick={onPause}>Pause</button>
  </Slot>
);

export default TrackControlsSlot;
