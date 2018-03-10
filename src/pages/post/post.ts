import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { App, ViewController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { SettingsService } from '../../services/settings';

import { SearchPage } from '../search/search';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from "@ngrx/store";
import { AppState } from '../../models/app-state.interface';
import { SettingsInterface } from '../../models/settings.interface';


/* Popover Component */
@Component({
  template: `
    <button ion-item (click)="onSearchBtn()">
      <ion-icon name="search"></ion-icon>
      Търсене на статия
    </button>
    <ion-item>
      <ion-range min="2" max="12" step="2" snaps="true" value="4" [(ngModel)]="textSize" (ionChange)="onTextSizeChange($event)">
        <ion-label range-left class="small-text">A</ion-label>
        <ion-label range-right class="large-text">A</ion-label>
      </ion-range>
    </ion-item>
  `
})
export class PostPopover implements OnInit {
  textSize: number = 4;
  searchPage = SearchPage;

  constructor(
    public appCtrl: App,
    public viewCtrl: ViewController,
    private navParams: NavParams,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.textSize = this.navParams.data.textSize;
    }
  }

  onSearchBtn() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(this.searchPage);
  }

  // saving text size
  onTextSizeChange(event) {
    this.settingsService.setTextSize(event.value);
  }

}


/* Main Post Page Component */
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage implements OnInit {
  post: any;
  postTitle: string;
  postContent: SafeHtml;
  textSize: number = 4;
  now = new Date();
  postPage: any = PostPage;
  loadError: boolean = false

  postUrl = 'https://kenguruapp.online/wp-json/wp/v2/posts/';

  settingsState$: Observable<SettingsInterface>;
  settingsSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    private http: Http,
    private popoverCtrl: PopoverController,
    public navParams: NavParams,
    private store: Store<AppState>,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    if (this.navParams.data.type) {
      let data = this.navParams.data;
      this.post = data;
      this.postTitle = data.title.rendered;
      this.postContent = this.sanitizer.bypassSecurityTrustHtml(data.content.rendered);
    } else if (this.navParams.data.id && !isNaN(this.navParams.data.id)) {
      let postId = this.navParams.data.id
      // we need to load the post from API
      this.http.get(this.postUrl + postId + '?_embed')
        .map(res => res.json())
        .subscribe(data => {
          this.loadError = false;
          this.post = data;
          this.postTitle = data.title.rendered;
          this.postContent = this.sanitizer.bypassSecurityTrustHtml(data.content.rendered);
          console.log('PostPage', data.content.rendered, this.postContent);
        },
        error => {
          console.log('Error loading post', error);
          this.loadError = true;
        });
    }
    this.settingsState$ = this.store.select('settings');
    this.settingsSubscription = this.settingsState$.subscribe(settings => {
      this.textSize = settings.textSize;
    });
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(PostPopover, {
      textSize: this.textSize
    });

    popover.present({ ev: ev });
  }

}
