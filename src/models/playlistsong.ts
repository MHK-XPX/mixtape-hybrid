import { Playlist } from './playlist';
import { Song } from './song';

export interface PlaylistSong {
    playlistSongId: number;
    playlistId: number;
    songId: number;
    playlist: Playlist;
    song: Song;
}
  