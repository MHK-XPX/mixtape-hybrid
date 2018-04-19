import { PlaylistSong } from './playlistsong';

export interface Song {
    songId: number;
    albumId: number;
    artistId: number;
    featuredArtistId: number;
    name: string;
    url: string;
    playlistSong: PlaylistSong[];
    // songRating: SongRating[];
    album: string;
    artist: string;
    featuredArtist: string;
}
  