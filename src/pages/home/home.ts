import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PostPage } from '../post/post';
import { CategoryPage } from '../category/category';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  postPage = PostPage;
  categoryPage = CategoryPage;

  categoriesUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/categories';
  categories: any;

  postsUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/posts?_embed&categories=';
  posts: any[] = [];

  constructor(public navCtrl: NavController, private http: Http, public loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    this.updatePostsList(null);
  }

  updatePostsList(refresher) {
    let loading: Loading;
    if (!refresher) {
      loading = this.loadingCtrl.create();
      loading.present();
    }

      // retrieve categories
      this.http.get(this.categoriesUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.categories = data;

          if (refresher) refresher.complete();
          if (loading) loading.dismiss();

          // retrieve posts in each category
          this.categories.forEach(category => {
            if (category.slug != 'uncategorized') {
              this.http.get(this.postsUrl + category.id)
                .map(res => res.json())
                .subscribe(data => {
                  this.posts[category.id] = data;
                })
            }
          });
        });

  }

}
