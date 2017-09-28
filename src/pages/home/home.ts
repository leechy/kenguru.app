import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, Loading, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { PostPage } from '../post/post';
import { CategoryPage } from '../category/category';
import { SearchPage } from '../search/search';
import { TourPage } from '../tour/tour';

import { Store } from "@ngrx/store";
import * as CategoryActions from "../../store/categories.actions";
import { AppState } from '../../models/app-state.interface';
import { SettingsInterface } from '../../models/settings.interface';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  postPage = PostPage;
  categoryPage = CategoryPage;
  searchPage = SearchPage;

  categoriesUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/categories?per_page=100';
  categories: any[] = [];

  postsUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/posts?_embed&categories=';
  posts: any[] = [];

  settingsState$: Observable<SettingsInterface>;
  settingsSubscription: Subscription;

  // we'll put here all the category names for the personal section
  personalTags: string[] = [];
  year: number = 1000 * 60 * 60 * 24 * 365;

  tagsUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/tags?per_page=100';
  tags: any[] = [];
  personalPostsUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/posts?_embed&tags=';
  personalPosts: any[] = [];

  constructor(
    public navCtrl: NavController,
    private http: Http,
    public loadingCtrl: LoadingController,
    private store: Store<AppState>,
    public modalCtrl: ModalController
  ) {
  }

  presentModal() {
    let modal = this.modalCtrl.create(TourPage);
    modal.present();
  }

  ngOnInit() {
    this.settingsState$ = this.store.select('settings');
    this.settingsSubscription = this.settingsState$.subscribe(settings => {
      this.personalTags.length = 0;

      // determine pregnancy week
      if (settings.birthDate) {
        let expectedBirthDate = new Date(settings.birthDate);
        let checkdate = new Date();
        if (expectedBirthDate > checkdate) {
          // the baby is not yet born, but we need to check for the
          // actual birth after 39 week ask is baby really still inside?
          // if not — ask for the name and set as a child
          for (let i = 0; i < 40; i++) {
            checkdate.setDate(checkdate.getDate() + 7);
            if (checkdate > expectedBirthDate) {
              this.personalTags.push(`pregnant-${40 - i}w`);
              break;
            }
          }
  
        } else {
          // the due date is passed
          // what to do?
        }
      }

      // determine the age of every child
      settings.children.forEach((child) => {
        let childBirthday = new Date(child.birthDate);
        let checkdate = new Date();
        
        if (checkdate.getTime() - childBirthday.getTime() < this.year) {
          // if the child is less than one year old — calculate months
          for (let i = 0; i < 13; i++) {
            checkdate.setMonth(checkdate.getMonth() - 1);
            if (checkdate < childBirthday) {
              this.personalTags.push(`age-${i}m`);
              break;
            }
          }
        } else {
          // if the child is older than one year — calculate years
          for (let i = 0; i < 18; i++) {
            checkdate.setFullYear(checkdate.getFullYear() - 1);
            if (checkdate < childBirthday) {
              this.personalTags.push(`age-${i}y`);
              break;
            }
          }
        }
      });

      this.updatePersonalCategory();
    });

    this.updatePostsList(null);

    this.presentModal();
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  updatePostsList(refresher) {
    let loading: Loading;
    if (!refresher) {
      loading = this.loadingCtrl.create({
        content: 'Зареждаме статиите...'
      });
      loading.present();
    }

    // retrieve tags
    this.http.get(this.tagsUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.tags = data;
        this.updatePersonalCategory();
      });

    // retrieve categories
    this.http.get(this.categoriesUrl)
      .map(res => res.json())
      .subscribe(data => {

        if (refresher) refresher.complete();
        if (loading) loading.dismiss();

        this.store.dispatch(new CategoryActions.Reset());
        this.categories = data;

        this.updatePersonalCategory();

        // retrieve posts in each category
        this.categories.forEach(category => {
          if (category.slug != 'uncategorized') {
            this.store.dispatch(new CategoryActions.Push(category));
            if (category.parent == 0) {
              this.loadArticlesByCatId(category.id)
            }
          }
        });
      });

  }

  loadArticlesByCatId(categoryId) {
    this.http.get(this.postsUrl + categoryId)
      .map(res => res.json())
      .subscribe(data => {
        this.posts[categoryId] = data;
      });
  }

  updatePersonalCategory() {
    if (this.personalTags.length && this.tags.length) {
      const tagsList = [];

      this.personalTags.forEach(tagSlug => {
        this.tags.forEach(tag => {
          if (tagSlug == tag.slug) {
            tagsList.push(tag.id);
          }
        });
      });

      // retrieve all posts with these tags
      if (tagsList.length) {
        this.http.get(this.personalPostsUrl + tagsList.join(','))
          .map(res => res.json())
          .subscribe(data => {
            this.personalPosts = data;
          });
      }

    }
  }

}
