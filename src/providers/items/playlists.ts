//NOT USED KEEPING FOR REF
import { Injectable } from '@angular/core';

import { Playlist } from '../../models/playlist';
import { Api } from '../api/api';

import { User } from '../user/user';

@Injectable()
export class Playlists {

    constructor(public api: Api, public user: User) { }

    query(id: number) {
        // return this.api.get<Playlist>('songs', params);
        return this.api.getSingleEntity<Playlist>("Playlists", id);
    }

    queryUserPlaylists(){
        return this.api.getAllEntities<Playlist>('Playlists/User/' + this.user._user.userId);
    }

    add(item: Playlist) {
        console.log("ADDED");
    }

    delete(item: Playlist) {
        console.log("DELETED");
    }

    getThumbnail(url: string): string {
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
