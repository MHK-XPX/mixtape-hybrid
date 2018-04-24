import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaylistManagerPage } from './playlist-manager';

@NgModule({
  declarations: [
    PlaylistManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaylistManagerPage),
  ],
})
export class PlaylistManagerPageModule {}
