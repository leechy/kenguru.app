import { Component, Input, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PostPage } from '../post/post';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  postPage = PostPage;

  search: string;
  posts: any[];
  page: number = 1;
  per_page: number = 10;
  askForMoreResults: boolean = true;
  postsUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/posts?_embed&per_page=' + this.per_page + '&search=';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {}

  // focusing the search input element on page entering
  @ViewChild('search') searchbarElement;
  ionViewDidEnter() {
    setTimeout(() => {
      this.searchbarElement.setFocus();
    },150);
  }

  isRequest: boolean = false;
  isNothingFound: boolean = false;
  isLoadingResults: boolean = false;
  getResults(ev: any) {
    this.search = ev.target.value;

    if (this.search && this.search.trim() != '') {
      this.isRequest = true;
      this.isLoadingResults = true;
      this.http.get(this.postsUrl + this.search)
        .map(res => res.json())
        .subscribe(data => {
          this.posts = data;
          this.isLoadingResults = false;
          if (this.posts.length) {
            this.isNothingFound = false;
            if (this.posts.length < this.per_page) {
              this.askForMoreResults = false;
            }
          } else {
            this.askForMoreResults = false;
            this.isNothingFound = true;
          }
        });
    } else {
      this.isRequest = false;
      this.posts = [];
    }
  }

  doInfinite(infiniteScroll) {
    let scroll = infiniteScroll;

    if (this.askForMoreResults) {
      console.log('Begin async operation');
      this.http.get(this.postsUrl + this.search + '&page=' + ++this.page)
        .map(res => res.json())
        .subscribe(data => {
          data.forEach((post) => {
            this.posts.push(post);
          })

          if (data.length < this.per_page) {
            this.askForMoreResults = false;
          }
          scroll.complete();
        })
    } else {
      scroll.complete();
    }
  }

}
