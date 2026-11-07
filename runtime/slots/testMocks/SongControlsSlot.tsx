// The "renaming a slot" example from docs/how_tos/add-a-slot-version.md, before the change.
import Slot from '../Slot';

export interface SongControlsSlotProps {
  onPlay: () => void;
  onPause: () => void;
}

const SongControlsSlot = ({ onPlay, onPause }: SongControlsSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.songControls.v1" onPlay={onPlay} onPause={onPause}>
    <button type="button" onClick={onPlay}>Play</button>
    <button type="button" onClick={onPause}>Pause</button>
  </Slot>
);

export default SongControlsSlot;
