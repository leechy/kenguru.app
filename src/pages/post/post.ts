import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { SettingsService } from '../../services/settings';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})

export class PostPage implements OnInit {
  searchPage = SearchPage;
  post: any;
  textSize: number = 6;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settingsService: SettingsService
  ) {}

  ionViewDidEnter() {
    this.settingsService.getTextSize()
      .then((val) => {
        this.textSize = val;
      });
  }

  ngOnInit() {
    this.post = this.navParams.data;
  }
}
