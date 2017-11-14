import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsService } from '../../services/settings';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from "@ngrx/store";
import { AppState } from '../../models/app-state.interface';
import { SettingsInterface } from '../../models/settings.interface';
import { AuthInterface } from '../../models/auth.interface';

import { ChildPage } from '../child/child';
import { SignInPage } from '../sign-in/sign-in';
import { HomePage } from '../home/home';

@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit, OnDestroy {

	// pages
	homePage: any = HomePage;
	childPage: any = ChildPage;
	signInPage: any = SignInPage;

	// settings
	isPregnant: boolean = false;
	birthDate: string = null;
  lastPeriodDate: string = null;
	children: any[] = [];

	// service variables
  today: Date = new Date();
	yesterday: Date = new Date();
	fourtyWeeksFromToday: Date = new Date();
  fourtyWeeksAgo: Date = new Date();

	settingsState$: Observable<SettingsInterface>;
  settingsSubscription: Subscription;
  authState$: Observable<AuthInterface>;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private settingsService: SettingsService,
		private store: Store<AppState>
	) {
		this.yesterday.setDate(this.yesterday.getDate() - 1);
		this.fourtyWeeksFromToday.setDate(this.today.getDate() + 280);
    this.fourtyWeeksAgo.setDate(this.today.getDate() - 280);
	}

	// get data from store
	ngOnInit() {
    this.settingsState$ = this.store.select('settings');
    this.settingsSubscription = this.settingsState$.subscribe(settings => {
			this.birthDate = settings.birthDate;
			if (this.birthDate) {
        this.isPregnant = true;
        this.lastPeriodDate = this.calcLastPeriodDateByBirthDate(this.birthDate);
      } else {
        this.lastPeriodDate = null;
      }
			this.children = settings.children;
		});
		this.authState$ = this.store.select('auth');
	}

	ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  calcLastPeriodDateByBirthDate(birthDate): string {
    let lastPeriodDate = new Date(birthDate);
    lastPeriodDate.setDate(lastPeriodDate.getDate() - 280);
    return lastPeriodDate.toISOString();
  }

  calcBirthDateByLastPeriodDate(lastPeriodDate): string {
    let birthDate = new Date(lastPeriodDate);
    birthDate.setDate(birthDate.getDate() + 280);
    return birthDate.toISOString();
  }

  onLastPeriodChange() {
    if (this.isPregnant && this.lastPeriodDate) {
      this.birthDate = this.calcBirthDateByLastPeriodDate(this.lastPeriodDate);
      this.settingsService.setBirthDate(this.birthDate);
    } else {
			this.settingsService.removeBirthDate();
		}
  }

	onBirthDateChange() {
		if (this.isPregnant && this.birthDate) {
			this.settingsService.setBirthDate(this.birthDate);
		} else {
			this.settingsService.removeBirthDate();
		}
	}

	formatDate(date) {
		const monthNames: string[] = [
			'януари',
			'февруари',
			'март',
			'април',
			'май',
			'юни',
			'юли',
			'август',
			'септември',
			'октомври',
			'ноември',
			'декември'
		];
		let newDate: Date = new Date(date);
		return newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear() + ' г.';
	}

	setRoot(page) {
		this.navCtrl.setRoot(page);
	}

}
