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
  promosUrl: string = 'http://kenguruapp.online/wp-json/wp/v2/promo?_embed&categories=';
  posts: any[] = [];

  settingsState$: Observable<SettingsInterface>;
  settingsSubscription: Subscription;

  // we'll put here all the category names for the personal section
  personalTags: string[] = [];
  year: number = 1000 * 60 * 60 * 24 * 365;

  tagsUrl: string = 'https://kenguruapp.online/wp-json/wp/v2/tags?per_page=100';
  tags: any[] = [];
  personalPostsUrl: string = 'https://kenguruapp.online/wp-json/wp/v2/posts?_embed&tags=';
  personalPosts: any[] = [];

  constructor(
    public navCtrl: NavController,
    private http: Http,
    public loadingCtrl: LoadingController,
    private store: Store<AppState>,
    public modalCtrl: ModalController
  ) {}

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
        let weekCheckdate = new Date();
        if (expectedBirthDate > weekCheckdate) {
          // the baby is not yet born, but we need to check for the
          // actual birth after 39 week ask is baby really still inside?
          // if not — ask for the name and set as a child
          for (let i = 0; i < 40; i++) {
            weekCheckdate.setDate(weekCheckdate.getDate() + 7);
            if (weekCheckdate > expectedBirthDate) {
              this.personalTags.push(`pregnant-${40 - i}w`);
              break;
            }
          }

          // calculating additionally pregnancy month
          let monthCheckdate = new Date();
          for (let i = 0; i < 9; i++) {
            monthCheckdate.setMonth(monthCheckdate.getMonth() + 1);
            if (monthCheckdate > expectedBirthDate) {
              this.personalTags.push(`pregnant-${9 - i}m`);
              break;
            }
          }

        } else {
          // the due date is passed
          // what to do?
        }
      }

      // determine the age group of every child
      settings.children.forEach((child) => {
        let childBirthday = new Date(child.birthDate);
        
        // calculate weeks
        let weekCheckdate = new Date();
        let week = 0;
        while (weekCheckdate > childBirthday) {
          weekCheckdate.setDate(weekCheckdate.getDate() - 7);
          if (weekCheckdate < childBirthday) {
            this.personalTags.push(`age-${week}w`);
          }
          week++;
        }

        // calculate months
        let monthCheckdate = new Date();
        let month = 0;
        while (monthCheckdate > childBirthday) {
          monthCheckdate.setMonth(monthCheckdate.getMonth() - 1);
          if (monthCheckdate < childBirthday) {
            this.personalTags.push(`age-${month}m`);
          }
          month++;
        }

        // calculate years
        let yearCheckdate = new Date();
        let year = 0;
        while (yearCheckdate > childBirthday) {
          yearCheckdate.setFullYear(yearCheckdate.getFullYear() - 1);
          if (yearCheckdate < childBirthday) {
            this.personalTags.push(`age-${year}y`);
          }
          year++;
        }

      });

      console.log('personalTags', this.personalTags);
      
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
            if (category.slug.indexOf('promo') < 0) {
              this.store.dispatch(new CategoryActions.Push(category));
            }
            if (category.parent == 0) {
              this.loadArticlesByCatId(category.id, category.slug.indexOf('promo') > -1);
            }
          }
        });
      });

  }

  loadArticlesByCatId(categoryId, isPromo) {
    const url = (isPromo)? this.promosUrl : this.postsUrl;
    this.http.get(url + categoryId)
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
