/*
    Written by: Ryan Kruse
    youtube.ts is the main controller for the main app page (the youtube view)
    It allows for the user to listen to a playlist or make changes to a playlist
*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemBuilder } from '../../providers/providers';

import { Playlist } from '../../models/playlist';
import { PlaylistSong } from '../../models/playlistsong';
import { Song } from '../../models/song';
import { PlaylistBuilder } from '../../providers/items/playlist.builder';

@IonicPage()
@Component({
    selector: 'page-youtube',
    templateUrl: 'youtube.html'
})
export class YoutubePage {
    currentPlaylist: Playlist;
    private lastViewedPlaylist: Playlist;

    private player: YT.Player;

    paused: boolean = true;
    repeat: boolean;
    onSongIndex: number = -1; //Always start at the first song

    videoId: string;
    songDetail: Song;


    constructor(public navCtrl: NavController, navParams: NavParams, public itemBuilder: ItemBuilder, public playlistBuilder: PlaylistBuilder) {
        //this.playlist = navParams.get('playlist') || [];
        this.itemBuilder.currentPlaylist.subscribe(res => this.loadPlaylist(res));
    }
    
    /*
        This method is called everytime the subscriber pings us on a change to our current playlist
            this could be the user clicking a new playlist OR changing values in the current playlist (IE removing a song)
        @param playlist: Playlist - The new (or new version) of a playlist sent from a provider subject
    */
    loadPlaylist(playlist: Playlist) {
        //Make sure that it isn't null
        if (playlist && this.player) {
            this.currentPlaylist = playlist;
            //We must check to see if the user clicked the same playlist, if so, we don't want to reload it
            if((this.lastViewedPlaylist === null || this.lastViewedPlaylist === undefined) || this.lastViewedPlaylist.playlistId !== playlist.playlistId){
                this.lastViewedPlaylist = playlist;
                this.onSongIndex = -1;
                this.playNextSong(1);
            }
        }
    }

    /*
        This method is called when the player is initialized, it sets our field to the passed value
        so that we can call it directly
    */
    savePlayer(player) {
        this.player = player;
    }

    /*
        This method is called whenever the state of the player is changed 
        IE: play, pause, loading, not started, etc
        Based on each state, we will perform the appropriate action
    */
    onStateChange(event) {
        switch (event.data) {
            case -1: //not started
                break;
            case 0: //ended
                this.playNextSong(1);
                break;
            case 1: //playing
                this.paused = false;
                break;
            case 2: //paused
                this.paused = true;
                break;
            case 3: //loading
                break;
            default:
                console.log("UNHANDLED STATE!");
        }
    }

    /*
        This method is called when the user wants to remove a song from the playlist
        @param pls: PlaylistSong - The song to remove from the playlist
    */
    removeSongFromPlaylist(pls: PlaylistSong){
        // this.itemBuilder.removeSongFromPlaylist(pls.playlistSongId, this.currentPlaylist);
        this.playlistBuilder.removeSong(pls.playlistSongId, this.currentPlaylist);
    }

    /*
        This method is called when the user clicks a song to play on the playlist
        @param index: number - The index of the song to play 
    */
    playSongOnTap(index: number){
        this.onSongIndex = index;
        this.videoId = this.itemBuilder.parseId(this.currentPlaylist.playlistSong[this.onSongIndex].song.url);
        this.player.loadVideoById(this.videoId);
    }

    /*
        This method is called whenever the user clicks the prev. or next buttons. It will move us up or 
        down on the playlist based on dir. It will also check to see if the user has repeat on and 
        will act accordingly.
        @param dir: number - The direction to move in the playlist (-1 = down, 1 = up)
    */
    playNextSong(dir: number){
        if(!this.currentPlaylist) return; //Return if we don't have a playlist selected
        let plLength: number = this.currentPlaylist.playlistSong.length - 1;

        this.onSongIndex += dir;

        if(this.onSongIndex < 0){
            this.onSongIndex = plLength;
        }else if(this.onSongIndex > plLength){
            if(this.repeat)
                this.onSongIndex = 0;
            else
                return;
        }

        this.videoId = this.itemBuilder.parseId(this.currentPlaylist.playlistSong[this.onSongIndex].song.url);
        this.player.loadVideoById(this.videoId);
    }

    /*
        This method is called when the user clicks the "play/pause" button it will
        either pause or play the video
    */
    pauseOrPlayClicked(){
        if(!this.paused) this.player.pauseVideo(); else this.player.playVideo();
    }

    /*
        This method is called when we are creating our youtube player
        It returns our screen height * a given value to help with the scaling
    */
    getScreenHeight(): number {
        return window.screen.height * .35;
    }

    /*
      This method is called when we are creating our youtube player
        It returns our screen height * a given value to help with the scaling
    */
    getScreenWidth(): number {
        return window.screen.width;
    }

}