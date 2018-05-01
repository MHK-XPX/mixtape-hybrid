/*
  Written by: Ryan Kruse
  app.component.ts is the main controller for navigating pages. It also allows for the user to see the 
  side menu and make selections from there.
*/
import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';

import { ItemBuilder } from '../providers/items/item.builder';
import { Playlist } from '../models/playlist';
import { PlaylistBuilder } from '../providers/items/playlist.builder';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  userPlaylists: Playlist[];

  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Home', component: 'TabsPage' },
    { title: 'Youtube', component: 'YoutubePage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' }
  ]

  constructor(private translate: TranslateService, platform: Platform, settings: Settings,
    private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen,
    public itemBuilder: ItemBuilder, public playlistBuilder: PlaylistBuilder, private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController, private menuCtrl: MenuController) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.itemBuilder.userPlaylists.subscribe(res => this.userPlaylists = res);
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  //Not called
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  
  /*
    This method is called when the user selects a playlist from the side-menu
    it pulls the playlist they selected from the api and moves us to the detail page
    @param playlist: Playlist - The playlist to get the details on
  */
  openPlaylistDetails(playlist: Playlist) {
    let filledPlaylist: Playlist;

    this.playlistBuilder.query(playlist.playlistId).subscribe(
      d => filledPlaylist = d,
      err => console.log("Cannot get playlist"),
      () => {
        this.nav.push('ItemDetailPage', {
          playlist: filledPlaylist
        });
      }
    )
  }

  addNewPlaylist() {
    this.playlistBuilder.create(this.userPlaylists);
  }

  //MOVED TO playlist provider!
  deletePlaylist(playlist: Playlist, index: number) {
    this.playlistBuilder.delete(playlist, this.userPlaylists, index);
  }


  doPlaylistPressActions(playlist: Playlist, index: number) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Edit Playlist",
      buttons: [
        {
          text: 'Delete Playlist',
          role: 'destructive',
          handler: () => {
            // this.deletePlaylist(playlist, index);
           this.doConfirmDeleteActions(playlist, index);
          },
        },{
          text: 'Play',
          handler: () =>{
            this.itemBuilder.updateCurrentPlaylist(playlist);
            this.menuCtrl.close();
          }
        },{
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  doConfirmDeleteActions(playlist: Playlist, index: number){
    let confirm = this.alertCtrl.create({
      title: "Are you sure?",
      message: "Do you want to delte playlist: " + playlist.name + "?",
      buttons: [
        {
          text: "No",
          role: 'cancel',
        },
        {
          text: "Yes",
          handler: () =>{
            this.deletePlaylist(playlist, index);
          }
        }
      ]
    });
    confirm.present();
  }

  openSearch(){
    this.nav.push("SearchPage");
  }

  openPlaylistManager() {
    this.nav.push('PlaylistManagerPage');
  }

  /*
    This method is called when we click login or logout, it clears all potential values
    of the Subjects form item.builder.ts and navigates us to the login page
  */
  goToLogin() {
    this.itemBuilder.clearAll();
    this.nav.setRoot('LoginPage');
  }
}
