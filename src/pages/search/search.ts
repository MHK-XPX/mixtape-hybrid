//NOT USED
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Item } from '../../models/item';
import { ItemBuilder, PlaylistBuilder } from '../../providers/providers';
import { SearchResults } from '../../models/searchresults';
import { Subscription } from 'rxjs/Subscription';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { Song } from '../../models/song';
import { Playlist } from '../../models/playlist';
import { PlaylistSong } from '../../models/playlistsong';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  userPlaylists: Playlist[] = [];
  currentPlaylist: Playlist;

  searchResults: SearchResults;

  constructor(public navCtrl: NavController, public navParams: NavParams, private itemBuilder: ItemBuilder, private playlistBuilder: PlaylistBuilder, private actionSheetCtrl: ActionSheetController) { }

  /**
   * Perform a service for the proper items.
   
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.currentItems = this.items.query({
      name: val
    });
  }*/
  ionViewDidLoad() {
    this.itemBuilder.userPlaylists.subscribe(res => this.userPlaylists = res);
    this.itemBuilder.currentPlaylist.subscribe(res => this.currentPlaylist = res);
  }

  getItems(ev) {
    let val: string = ev.target.value;

    if (!val || !val.trim() || val.length == 0) {
      this.searchResults = null;
    }

    let s: Subscription = this.itemBuilder.searchQuery<SearchResults>("Search", val).subscribe(
      d => this.searchResults = d,
      err => console.log("Cant find results"),
      () => s.unsubscribe()
    );
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  openArtist(artist: Artist) {
    let a: Artist;
    let s: Subscription = this.itemBuilder.singleQuery<Artist>("Artists/Spec", artist.artistId).subscribe(
      d => a = d,
      err => console.log("Unable to pull artist"),
      () => {
        s.unsubscribe();
        this.navCtrl.push('ItemDetailPage', {
          userPlaylists: this.userPlaylists,
          artist: a
        });
      }
    );
  }

  openAlbum(album: Album) {
    let a: Album;
    let s: Subscription = this.itemBuilder.singleQuery<Album>("Albums", album.albumId).subscribe(
      d => a = d,
      err => console.log("Unable to pull album"),
      () => {
        s.unsubscribe();
        this.navCtrl.push('ItemDetailPage', {
          userPlaylists: this.userPlaylists,
          album: a
        });
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
    let addingToCurrent: boolean = this.currentPlaylist.playlistId === playlist.playlistId;
    this.playlistBuilder.add(playlist, this.userPlaylists, song, playlistIndex, addingToCurrent);
  }
}
