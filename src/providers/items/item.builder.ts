/*
    Written by: Ryan Kruse
    item.builder.ts is a provider that will make api calls and alert anyone subscribed to it.
        It will update user information, playlist information, and the list of all user playlists
*/
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { User } from '../user/user'

import { Playlist } from '../../models/playlist';
import { Api } from '../api/api';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ItemBuilder {
    //Fields that will alert all subscribers on change
    public currentPlaylist: Subject<Playlist> = new BehaviorSubject<Playlist>(null);
    public userPlaylists: Subject<Playlist[]> = new BehaviorSubject<Playlist[]>([]);

    constructor(public api: Api, public user: User, public toastCtrl: ToastController) { }

    /*
        This method is called whenever the user logs in, it will return all of their playlists
        @return Observable<Playlist[]> - An observable containing an array of playlists
    */
    public queryUserPlaylists(): Observable<Playlist[]> {
        return this.api.getAllEntities<Playlist>('Playlists/User/' + this.user._user.userId);
    }

    /*
        This method is called when we want to pull one entity from the api
        @param path: string - The path to the endpoint we want to call
        @param id: number - The ID of the entity we want to pull
        @return Observable<T> - An observable of type T pulled from the database
    */
    public singleQuery<T>(path: string, id: number): Observable<T> {
        return this.api.getSingleEntity<T>(path, id);
    }

    public searchQuery<T>(path: string, search: string): Observable<T> {
        return this.api.getSingleEntityWithNoID(path + "/" + search);
    }

    /*
        This method is called when we want to pull all entities from a given endpoint from the api
        @param path: string - The path to the endpoint we want to call
        @return Observable<T[]> - An observable holding an array of elements of type T
    */
    public wholeQuery<T>(path: string): Observable<T[]> {
        return this.api.getAllEntities<T>(path);
    }

    public createNewPlaylist(playlist: object): Observable<Playlist> {
        return this.api.postEntity("Playlists", playlist);
    }

    public addEntity<T>(path: string, entity: any): Observable<T> {
        return this.api.postEntity(path, entity);
    }

    /*
        This method is called whenever we want to remove an entity from the DB
        @param path: string - The path to the endpoint
        @param id: number - The ID of the entity we want to remove at endpoint <path>
        @return Observable<T> - An observable of type T, containing the entity removed from the DB.
    */
    public removeEntity<T>(path: string, id: number): Observable<T> {
        return this.api.deleteEntity<T>(path, id);
    }

    /*
        This method is called whenever we update a playlist owned by the current user.
        It will alert all subscribers of the changes and allow them to update dynamically.
        @param playlist: Playlist - The updated playlist to send to all subs
    */
    public updateCurrentPlaylist(playlist: Playlist) {
        this.currentPlaylist.next(playlist);
    }

    /*
        This method is called whenever we remove or append a playlist to the list of user playlists
        @param playlists: Playlist[] - The new array of playlists to send to all subs
    */
    public updateUserPlaylists(playlists: Playlist[]) {
        this.userPlaylists.next(playlists);
    }

    //MOVED TO PLAYLIST PROVIDER
    public repullOnCurrentPlaylistUpdate(playlistID: number) {
        let p: Playlist;
        let s: Subscription = this.singleQuery<Playlist>("Playlists", playlistID).subscribe(
            d => p = d,
            err => console.log(err),
            () => {
                s.unsubscribe();
                this.updateCurrentPlaylist(p);
            }
        )
    }

    public doToastMessage(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            showCloseButton: true,
            closeButtonText: "Ok",
            //cssClass: 'toast.scss'
        });

        toast.present();
    }

    /*
        This method is calle don logout, it will remove the user values, the playlist values, and the list of playlists
        so that if the user were to login as another user they will not see their data
    */
    public clearAll() {
        this.user.logout();
        this.updateCurrentPlaylist(null);
        this.updateUserPlaylists([]);
    }

    /*
        Returns if the user is logged in or not (IE the user will have a value if they are)
        @return boolean - if the user is logged in or not
    */
    public hasUser(): boolean {
        return this.user._user !== null && this.user._user !== undefined;
    }

    /*
        This method is called when we need to get an ID for a youtube link
        @param url: string - The url of the youtube video to parse
        @return string - The ID of the video
    */
    public parseId(url: string): string {
        let pID;
        if (url !== '') {
            var fixedUrl = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if (fixedUrl !== undefined) {
                pID = fixedUrl[2].split(/[^0-9a-z_\-]/i);
                pID = pID[0];
            } else {
                pID = url;
            }
        }

        return pID;
    }

    /*
        This method is called whenever we want to get the thumbnail image of a youtube video
        @param url: string - The url of the youtube video
        @return string - the url of the thumbnail to display
    */
    public getThumbnail(url: string): string {
        var prefixImgUrl: string = "https://img.youtube.com/vi/";
        var suffixImgUrl: string = "/default.jpg";
        var ID;
        var imgURL: string = '';
        //Pull the video ID from the link so we can embed the video
        if (url !== '') {
            var fixedUrl = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if (fixedUrl !== undefined) {
                ID = fixedUrl[2].split(/[^0-9a-z_\-]/i);
                ID = ID[0];
            } else {
                ID = url;
            }
            imgURL = prefixImgUrl + ID + suffixImgUrl;
        }
        return imgURL;
    }
}
