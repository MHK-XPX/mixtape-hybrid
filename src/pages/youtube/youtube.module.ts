import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { YoutubePlayerModule } from 'ngx-youtube-player';

import { YoutubePage } from './youtube';

@NgModule({
  declarations: [
    YoutubePage,
  ],
  imports: [
    YoutubePlayerModule,
    IonicPageModule.forChild(YoutubePage),
    TranslateModule.forChild()
  ],
  exports: [
    YoutubePage
  ]
})
export class YoutubePageModule { }
