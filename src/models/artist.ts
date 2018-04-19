import { Album } from './album';

export interface Artist {
    artistId: number;
    name: string;
    album: Album[];
    songArtist;
    songFeaturedArtist;
}
  