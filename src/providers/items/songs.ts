//NOT UESD KEEPING FOR REF
import { Injectable } from '@angular/core';

import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { Song } from '../../models/song';
import { Api } from '../api/api';

@Injectable()
export class Songs {

    constructor(public api: Api) { }

    query(params?: any) {
       // return this.api.get<Song>('songs', params);
    }

    add(item: Song) {
        console.log("ADDED");
    }

    delete(item: Song) {
        console.log("DELETED");
    }

    getAllSongInfo(song: Song){
        // let artistPull = this.api.get<Artist>
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
