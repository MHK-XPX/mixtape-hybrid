/*
  Written by: Ryan Kruse 
  login.ts is the main controller for the user login page.
*/
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Loading, LoadingController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage, FirstRunPage } from '../pages';

import { Storage } from '@ionic/storage';

import { ItemBuilder } from '../../providers/items/item.builder';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { Username: string, Password: string } = {
    Username: 'rkruse',
    Password: 'password'
  };

  // Our translated text strings
  private loginErrorString: string;

  private loader: Loading;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private itemBuilder: ItemBuilder) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  ionViewDidLoad(){
    this.createLoader();
  }

  createLoader(){
    this.loader = this.loadingCtrl.create({
      content: "Logging in..."
    })
  }

  /*
    This method is called when we first try to login.
    It sends our creds to the user provider which will return a token if they are valid
    once we get a token, we make sure that it is valid via a doLogin call
  */
  getToken(){
    this.createLoader();

    this.loader.present().then(() => {
      this.itemBuilder.user.getToken(this.account).subscribe((resp) => {
        this.loader.dismiss();
        this.doLogin();
      }, (err) => {
        // Unable to log in
        this.loader.dismiss();
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    });
  }

  /*
    This method is called when we get a token from the api. It will make another call
    to make sure that our token is valid. If the token is valid, we can set our user
    and navigate to the home page.
  */
  doLogin() {
    this.itemBuilder.user.login().subscribe((resp) => {
      this.itemBuilder.queryUserPlaylists().subscribe(
        d => this.itemBuilder.updateUserPlaylists(d),
        err => console.log("Unable to get user playlists")
      );
      // this.navCtrl.push(MainPage);
      this.navCtrl.setRoot(MainPage);
    }, (err) => {
      // this.navCtrl.push(FirstRunPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });

  }
}
