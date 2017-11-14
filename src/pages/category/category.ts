import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PostPage } from '../post/post';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage implements OnInit {

  postPage = PostPage;
  searchPage = SearchPage;

  category: any;

  posts: any[];
  page: number = 1;
  per_page: number = 10;
  askForMoreResults: boolean = true;
  postsUrl: string = 'https://kenguruapp.online/wp-json/wp/v2/posts?_embed&per_page=' + this.per_page + '&categories=';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http
  ) {}

  ngOnInit() {
    this.category = this.navParams.data;



    this.http.get(this.postsUrl + this.category.id)
      .map(res => res.json())
      .subscribe(data => {
        this.posts = data;
        if (this.posts.length < this.per_page) {
          this.askForMoreResults = false;
        }
      })
  }

  doInfinite(infiniteScroll) {
    let scroll = infiniteScroll;

    if (this.askForMoreResults) {
      console.log('Begin async operation');
      this.http.get(this.postsUrl + this.category.id + '&page=' + ++this.page)
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
