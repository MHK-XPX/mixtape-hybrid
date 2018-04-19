import { Playlist } from './playlist';

export interface IUser {
    userId: number;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
    // albumRating: AlbumRathing[];
    playlist: Playlist[];
    // songRating: SongRating[];
}
  