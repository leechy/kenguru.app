import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SettingsService } from '../../services/settings';

import { PostPage } from '../post/post';
import { CategoryPage } from '../category/category';
import { SearchPage } from '../search/search';

import { Store } from "@ngrx/store";
import * as CategoryActions from "../../store/categories.actions";
import { AppState } from '../../models/app-state.interface';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  postPage = PostPage;
  categoryPage = CategoryPage;
  searchPage = SearchPage;

  categoriesUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/categories';
  categories: any[] = [];

  postsUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/posts?_embed&categories=';
  posts: any[] = [];

  birthDate: string = null;
  children: any[] = [];

  constructor(
    public navCtrl: NavController,
    private http: Http,
    public loadingCtrl: LoadingController,
    private store: Store<AppState>,
    private settingsService: SettingsService
  ) {
  }

  ionViewDidLoad() {
    this.birthDate = this.settingsService.getBirthDate();
    this.children = this.settingsService.getChildren();

    this.updatePostsList(null);
  }

  updatePostsList(refresher) {
    let loading: Loading;
    if (!refresher) {
      loading = this.loadingCtrl.create({
        content: 'Зареждаме статиите...'
      });
      loading.present();
    }

    // retrieve categories
    this.http.get(this.categoriesUrl)
    .map(res => res.json())
    .subscribe(data => {

      if (refresher) refresher.complete();
      if (loading) loading.dismiss();

      this.store.dispatch(new CategoryActions.Reset());
      this.categories = data;

      // retrieve posts in each category
      this.categories.forEach(category => {
        if (category.slug != 'uncategorized') {
          this.store.dispatch(new CategoryActions.Push(category));
          if (category.parent == 0) {
            this.http.get(this.postsUrl + category.id)
              .map(res => res.json())
              .subscribe(data => {
                this.posts[category.id] = data;
              })
          }
        }
      });
    });

  }

}
