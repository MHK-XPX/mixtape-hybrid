/*
  Written by: Ryan Kruse
  item-detail.ts holds all of the logic for displaying the playlist-detail page.
  It allows for the the user to play the selected playlist or make changes to it
*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { YoutubePage } from '../youtube/youtube';
import { ItemBuilder, PlaylistBuilder } from '../../providers/providers';

import { Playlist } from '../../models/playlist';
import { PlaylistSong } from '../../models/playlistsong';
import { Song } from '../../models/song';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  artist: Artist;
  album: Album;
  song: Song;

  userPlaylists: Playlist[];
  playlist: Playlist;
  songDetail: Song;


  constructor(public navCtrl: NavController, navParams: NavParams, public itemBuilder: ItemBuilder, private playlistBuilder: PlaylistBuilder, private actionSheetCtrl: ActionSheetController) {
    this.userPlaylists = navParams.get('userPlaylists') || [];
    this.playlist = navParams.get('playlist') || [];
    this.artist = navParams.get('artist') || null;
    this.album = navParams.get('album') || null;
  }

  //NOT ADDED YET
  openPlaylistSong(pls: PlaylistSong){
    this.itemBuilder.singleQuery<Song>("Songs", pls.songId).subscribe(
      d => console.log(d),
      err => console.log("Unable to laod song details")
    );
  }

  /*
    This method is called when the user clicks the play button
    it will set our current playlist in our item builder and
    move us back to the youtube page via nav.pop()
  */
  playSelectedPlaylist(){
    this.itemBuilder.updateCurrentPlaylist(this.playlist);
    // this.navCtrl.setRoot("YoutubePage");
    this.navCtrl.pop();
  }

  /*
    This method is called when click the delete button on a playlist song
    It will remove it from the backend and from the DOM
  */
  deleteSongFromPlaylist(pls: PlaylistSong, index: number){
    this.itemBuilder.removeEntity<PlaylistSong>("PlaylistSongs", pls.playlistSongId).subscribe(
      d => d = d,
      err => this.itemBuilder.doToastMessage("Unable to remove song"),
      () => {
        this.playlist.playlistSong.splice(index, 1)
        this.itemBuilder.updateCurrentPlaylist(this.playlist);
        this.itemBuilder.doToastMessage("Successfully removed");
      }
    );
  }


  openSong(song: Song) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Add song to:",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    let count = 0;
    
    for (let i = 0; i < this.userPlaylists.length; i++) {
      var button = {
        text: this.userPlaylists[i].name,
        handler: () => {
          //console.log("Adding to:", this.userPlaylists[i].name);
          this.addSongToPlaylist(this.userPlaylists[i], song, i);
        }
      }
      actionSheet.addButton(button);
    }
    actionSheet.present();
  }

  addSongToPlaylist(playlist: Playlist, song: Song, playlistIndex: number){
    // let addingToCurrent: boolean = this.currentPlaylist.playlistId === playlist.playlistId;
    this.playlistBuilder.add(playlist, this.userPlaylists, song, playlistIndex, false);
  }

}