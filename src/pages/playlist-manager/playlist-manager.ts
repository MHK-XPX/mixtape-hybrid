import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemBuilder} from '../../providers/providers'
import { Playlist } from '../../models/playlist';

@IonicPage()
@Component({
  selector: 'page-playlist-manager',
  templateUrl: 'playlist-manager.html',
})
export class PlaylistManagerPage {
  public userPlaylists: Playlist[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private itemBuilder: ItemBuilder) {
  }

  ionViewDidLoad() {
    this.itemBuilder.userPlaylists.subscribe(res => this.userPlaylists = res);
  }

  deletePlaylist(index: number){
    let p: Playlist = this.userPlaylists[index];

    this.itemBuilder.removeEntity<Playlist>("Playlists", p.playlistId).subscribe(
      d => d = d,
      err => {
        this.itemBuilder.doToastMessage("Unable to delete playlist: " + p.name);
      },
      () => {
        this.userPlaylists.splice(index, 1);
        this.itemBuilder.updateUserPlaylists(this.userPlaylists);
        this.itemBuilder.doToastMessage("Deleted playlist: " + p.name);
      }
    );
  }

}
