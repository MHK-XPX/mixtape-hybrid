//NOT USED KEEPING FOR REF
import { Injectable } from '@angular/core';

import { Playlist } from '../../models/playlist';
import { Api } from '../api/api';

import { User } from '../user/user';
import { ItemBuilder } from '../providers';
import { ToastController } from 'ionic-angular';
import { Song } from '../../models/song';
import { PlaylistSong } from '../../models/playlistsong';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class PlaylistBuilder extends ItemBuilder {

    constructor(public api: Api, public user: User, public toastCtrl: ToastController) {
        super(api, user, toastCtrl);
    }

    query(id: number) {
        return this.api.getSingleEntity<Playlist>("Playlists", id);
    }

    queryUserPlaylists() {
        return this.api.getAllEntities<Playlist>('Playlists/User/' + this.user._user.userId);
    }

    create(userPlaylists: Playlist[]) {
        let p = {
            name: "Playlist " + (userPlaylists.length + 1),
            playlistSong: [],
            userId: this.user._user.userId
        }

        let returnedPL: Playlist;

        let s: Subscription = this.api.postEntity<Playlist>("Playlists", p).subscribe(
            d => returnedPL = d,
            err => this.doToastMessage("Unable to create new playlist"),
            () => {
                s.unsubscribe();
                userPlaylists.push(returnedPL);
                this.updateUserPlaylists(userPlaylists);
                this.doToastMessage("Playlist created");
            }
        );
    }

    add(playlist: Playlist, userPlaylists: Playlist[], song: Song, index: number, addingToCurrent: boolean) {
        let pls = {
            playlistId: playlist.playlistId,
            songId: song.songId
        };

        let returnedPLS: PlaylistSong;
        let s: Subscription = this.addEntity<PlaylistSong>("PlaylistSongs", pls).subscribe(
            d => returnedPLS = d,
            err => this.doToastMessage("Unable to add: " + song.name + " to " + playlist.name),
            () => {
                s.unsubscribe();
                playlist.playlistSong.push(returnedPLS);
                userPlaylists[index] = playlist;
                this.updateUserPlaylists(userPlaylists);

                if(addingToCurrent)
                    this.repullOnCurrentPlaylistUpdate(playlist.playlistId);
                
                this.doToastMessage("Added: " + song.name + " to " + playlist.name);

            }
        );
    }

    delete(playlist: Playlist, userPlaylists: Playlist[], index: number) {
        let s: Subscription = this.removeEntity<Playlist>("Playlists", playlist.playlistId).subscribe(
            d => d = d,
            err => this.doToastMessage("Unable to delete playlist: " + playlist.name),
            () => {
                userPlaylists.splice(index, 1);
                this.updateUserPlaylists(userPlaylists);
                this.doToastMessage("Deleted playlist: " + playlist.name);
            }
        );
    }

    /*
        This method is called when we need to remove a song from a given playlist.
        Once the song is removed from the DB, we update the User's playlist subject
        which will alert all subscribers 
        @param id: number - The playlist song id to remove from the DB
        @param playlist: Playlist - The playlist we are going to remove the song from
    */
    removeSong(id: number, playlist: Playlist) {
        let songIndex = playlist.playlistSong.findIndex(pls => pls.playlistSongId === id);

        let s: Subscription = this.api.deleteEntity<PlaylistSong>("PlaylistSongs", id).subscribe(
            d => d = d,
            err => this.doToastMessage("Unable to remove song from: " + playlist.name),
            () => {
                playlist.playlistSong.splice(songIndex, 1);
                this.updateCurrentPlaylist(playlist);
                this.doToastMessage("Song removed from: " + playlist.name);
            }
        );
    }

    private doActionOnCurrentPlaylist(playlist: Playlist) {
        /*if(this.localCurrentPlaylist.playlistId === playlist.playlistId){
            let p: Playlist;
            let s: Subscription = this.query(playlist.playlistId).subscribe(
                d => p = d,
                err => this.doToastMessage("Unable to update, please restart"),
                () => {
                    s.unsubscribe();
                    this.updateCurrentPlaylist(p);
                }
            )
        }*/
    }

    private createPlaylistSong(playlistId: number, songId: number) {
        let pls = {
            playlistId: playlistId,
            songId: songId
        };

        return pls;
    }
}
