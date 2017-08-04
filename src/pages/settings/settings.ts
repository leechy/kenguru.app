import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsService } from '../../services/settings';

import { ChildPage } from '../child/child'

@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage {

	// pages
	childPage: any = ChildPage;

	// settings
	textSize: number = 6;
	isPregnant: boolean = false;
	birthDate: string = null;
	children: any[] = [];

	// service variables
	yesterday: Date = new Date();
	fourtyWeeksFromToday: Date = new Date();

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private settingsService: SettingsService
	) {
		this.yesterday.setDate(-1);
		this.fourtyWeeksFromToday.setDate(this.yesterday.getDate() + 265);
	}

	//
	ionViewDidEnter() {
		this.textSize = this.settingsService.getTextSize();
		this.birthDate = this.settingsService.getBirthDate();
		if (this.birthDate) this.isPregnant = true;
		this.children = this.settingsService.getChildren();
	}

	// update data in SettingsService from Storage for other pages
	// (there can be problems with isPregnant switch)
	ionViewWillLeave() {
		this.settingsService.updateValuesFromStorage();
	}

	// saving text size
	onTextSizeChange(event) {
		this.settingsService.setTextSize(event.value);
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

}
