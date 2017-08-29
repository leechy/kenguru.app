import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Facebook } from '@ionic-native/facebook'

import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthService } from '../services/auth';
import { SettingsService } from '../services/settings';

import { StoreModule } from "@ngrx/store";
import { ROOT_REDUCER } from './../reducers/reducers';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PostPage } from '../pages/post/post';
import { CategoryPage } from '../pages/category/category';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { ChildPage } from '../pages/child/child';
import { SignInPage } from '../pages/sign-in/sign-in';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PostPage,
    CategoryPage,
    SearchPage,
    SettingsPage,
    ChildPage,
    SignInPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(ROOT_REDUCER)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PostPage,
    CategoryPage,
    SearchPage,
    SettingsPage,
    ChildPage,
    SignInPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    SettingsService,
    Facebook
  ]
})
export class AppModule {}
