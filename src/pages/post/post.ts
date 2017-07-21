import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})

export class PostPage implements OnInit {
  searchPage = SearchPage;
  post: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    this.post = this.navParams.data;
  }
}
