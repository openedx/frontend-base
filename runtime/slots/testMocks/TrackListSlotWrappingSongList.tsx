// The "renaming a slot when its props change" example from docs/how_tos/add-a-slot-version.md, after step 3: the new slot wrapping the old one.
import Slot from '../Slot';

export interface Song {
  id: string;
  title: string;
}

export type TrackKind = 'song' | 'episode';

export interface Track {
  id: string;
  title: string;
  kind: TrackKind;
}

/** @deprecated Replaced by `TrackListSlotProps`, the props of `org.openedx.frontend.slot.example.trackList.v1`. */
export interface SongListSlotProps {
  /** @deprecated These are the songs in `tracks` of `TrackListSlotProps`. */
  songs: Song[];
}

export interface TrackListSlotProps {
  tracks: Track[];
}

const TrackListSlot = ({ tracks }: TrackListSlotProps) => {
  // The old slot takes songs only, so it gets the songs out of the list.
  const songs: Song[] = tracks.filter(track => track.kind === 'song');
  return (
    <Slot id="org.openedx.frontend.slot.example.trackList.v1" tracks={tracks}>
      <Slot id="org.openedx.frontend.slot.example.songList.v1" songs={songs}>
        <ul>
          {tracks.map(track => <li key={track.id}>{track.title}</li>)}
        </ul>
      </Slot>
    </Slot>
  );
};

export default TrackListSlot;
