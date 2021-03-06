import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { AuthService } from '../services/auth';
import { SettingsService } from '../services/settings';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { HomePage } from '../pages/home/home';
import { CategoryPage } from '../pages/category/category';
import { SettingsPage } from '../pages/settings/settings';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SearchPage } from '../pages/search/search';

import { Store } from "@ngrx/store";
import * as CategoryActions from "../store/categories.actions";
import { AppState } from '../models/app-state.interface';
import { AuthInterface } from '../models/auth.interface';
import * as AuthActions from '../store/auth.actions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {
  rootPage:any = HomePage;
  categoryPage:any = CategoryPage;
  searchPage:any = SearchPage;
  settingsPage:any = SettingsPage;
  signInPage:any = SignInPage;

  @ViewChild('nav') nav: NavController;

  categories: any[] = [];
  categories$: Observable<any>;
  categoriesSubscription: Subscription;
  authState$: Observable<AuthInterface>;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    private authService: AuthService,
    public settingsService: SettingsService,
    private store: Store<AppState>
  ) {
    firebase.initializeApp({
      apiKey: "AIzaSyDJaLK-z6TL2c3tn_PJrKlR_fKNU3iofBY",
      authDomain: "kenguruapp.firebaseapp.com"
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.store.dispatch(new AuthActions.SignIn(user.email));
      } else {
        this.store.dispatch(new AuthActions.Logout());
      }
    });

    this.authState$ = this.store.select('auth');
    this.categories$ = this.store.select<any>("categories");
    this.categoriesSubscription = this.categories$.subscribe(values => {
      this.categories = values;
    })
  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  setRoot(evt: any, page: any, category?: any) {
    // take care of subcategories expansion
    let target = evt.target;
    if (
      target &&
      target.classList &&
      target.classList.contains('icon') &&
      target.getAttribute('ng-reflect-name') != ''
    ) {
      this.store.dispatch(new CategoryActions.ToggleExpansion(category));
    } else {
      this.nav.setRoot(page, category);
      this.menuCtrl.close();
    }
  }

  navPush(page: any) {
    this.nav.push(page, {}, { animate: false });
    this.menuCtrl.close();
  }

  logout() {
    this.authService.logout();
    this.menuCtrl.close();
  }

  log(data) {
    console.log(data);
  }

}
