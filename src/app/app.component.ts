import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { AuthService } from '../services/auth';

import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SearchPage } from '../pages/search/search';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  searchPage:any = SearchPage;
  settingsPage:any = SettingsPage;
  signInPage:any = SignInPage;
  isAuthenticated = false;
  userEmail: string = '';
  @ViewChild('nav') nav: NavController;

	constructor(platform: Platform,
	            statusBar: StatusBar,
	            splashScreen: SplashScreen,
	            private menuCtrl: MenuController,
	            private authService: AuthService) {
		firebase.initializeApp({
			apiKey: "AIzaSyDJaLK-z6TL2c3tn_PJrKlR_fKNU3iofBY",
			authDomain: "kenguruapp.firebaseapp.com"
		});
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.userEmail = user.email;
				this.isAuthenticated = true;
			} else {
				this.isAuthenticated = false;
			}
		})

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();
		});
	}

	setRoot(page: any) {
		this.nav.setRoot(page);
		this.menuCtrl.close();
	}

	navPush(page: any) {
		this.nav.push(page, {}, { animate: false });
		this.menuCtrl.close();
	}

	logout() {
		this.authService.logout();
		this.menuCtrl.close();
	}

}
