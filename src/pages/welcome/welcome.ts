/*
  Written by: Ryan Kruse
  welcome.ts is the first page the user will see, it will prompt them to login or sign up, based on their 
  choice, it will navigate the user to the correct page
*/
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController) { }

  /*
    Called when the user clicks login, it navigates the user to the login page
  */
  login() {
    this.navCtrl.push('LoginPage');
  }

  /*
    Called when the user clicks sign up, it navigates the user to the sign up page
  */
  signup() {
    this.navCtrl.push('SignupPage');
  }
}
