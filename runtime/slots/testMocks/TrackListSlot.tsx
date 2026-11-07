// The "renaming a slot when its props change" example from docs/how_tos/add-a-slot-version.md, after step 6: the old slot removed.
import Slot from '../Slot';

export type TrackKind = 'song' | 'episode';

export interface Track {
  id: string;
  title: string;
  kind: TrackKind;
}

export interface TrackListSlotProps {
  tracks: Track[];
}

const TrackListSlot = ({ tracks }: TrackListSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.trackList.v1" tracks={tracks}>
    <ul>
      {tracks.map(track => <li key={track.id}>{track.title}</li>)}
    </ul>
  </Slot>
);

export default TrackListSlot;
