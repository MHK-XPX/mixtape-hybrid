import { Song } from './song';

export interface Album {
    albumId: number;
    artistId: number;
    artwork: null;
    name: string;
    year: number;
    albumRathing;
    song: Song[];
    artist: null;
}
  