// The "renaming a slot when its props change" example from docs/how_tos/add-a-slot-version.md, before the change.
import Slot from '../Slot';

export interface Song {
  id: string;
  title: string;
}

export interface SongListSlotProps {
  songs: Song[];
}

const SongListSlot = ({ songs }: SongListSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.songList.v1" songs={songs}>
    <ul>
      {songs.map(song => <li key={song.id}>{song.title}</li>)}
    </ul>
  </Slot>
);

export default SongListSlot;
