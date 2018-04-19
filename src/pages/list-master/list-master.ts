//NOT USED
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Songs } from '../../providers/items/songs';
import { Playlists } from '../../providers/items/playlists';
import { Playlist } from '../../models/playlist'

import { ItemBuilder} from '../../providers/items/item.builder';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Playlist[];

  constructor(public navCtrl: NavController, public songs: Songs, public playlists: Playlists, public modalCtrl: ModalController, public itemBuilder: ItemBuilder) {
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    // this.currentItems = this.items.query();
    // this.songs.query().subscribe(
    //   d => this.currentItems = d,
    //   err => console.log(err),

    // );
    // this.playlists.queryUserPlaylists().subscribe(
    //   d => this.currentItems = d,
    //   err => console.log(err)
    // );


    // console.log(this.itemBuilder.singleQuery<Playlist>());
    this.itemBuilder.queryUserPlaylists().subscribe(
      d => this.itemBuilder.updateUserPlaylists(d),
      err => console.log("Unable to get user playlists")
    );
    
    this.itemBuilder.userPlaylists.subscribe(res => this.currentItems = res);
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.songs.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.songs.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(playlist: Playlist) {
    let filledPlaylist: Playlist;

    this.playlists.query(playlist.playlistId).subscribe(
      d => filledPlaylist = d,
      err => console.log("Cannot get playlist"),
      () => {
        this.navCtrl.push('ItemDetailPage', {
          playlist: filledPlaylist
        });
      }
    )
  }
}
