import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { SettingsService } from '../../services/settings';

@Component({
  selector: 'page-tour',
  templateUrl: 'tour.html',
})
export class TourPage {

  settingsPage: any = SettingsPage;

  constructor(
    public appCtrl: App,
		private settingsService: SettingsService,
    private viewCtrl: ViewController
  ) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goToSettings() {
    this.settingsService.hideWelcomeScreen();
    this.dismiss();
    this.appCtrl.getRootNav().setRoot(this.settingsPage);
  }

}
