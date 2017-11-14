import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injectable, Injector } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Facebook } from '@ionic-native/facebook'

import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthService } from '../services/auth';
import { SettingsService } from '../services/settings';

import { StoreModule } from "@ngrx/store";
import { reducers } from './../store/reducers';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PostPage, PostPopover } from '../pages/post/post';
import { CategoryPage } from '../pages/category/category';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { ChildPage } from '../pages/child/child';
import { SignInPage } from '../pages/sign-in/sign-in';
import { TourPage } from '../pages/tour/tour';

import { Pro } from '@ionic/pro';
const IonicPro = Pro.init('b4e1a53d', {
  appVersion: "1.1.1"
});

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    IonicPro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PostPage,
    PostPopover,
    CategoryPage,
    SearchPage,
    SettingsPage,
    ChildPage,
    SignInPage,
    TourPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(reducers)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PostPage,
    PostPopover,
    CategoryPage,
    SearchPage,
    SettingsPage,
    ChildPage,
    SignInPage,
    TourPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: MyErrorHandler }],
    AuthService,
    SettingsService,
    Facebook
  ]
})
export class AppModule {}
