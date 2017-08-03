import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsService } from '../../services/settings';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  textSize: number = 6;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settingsService: SettingsService
  ) {}

  ionViewDidEnter() {
    this.settingsService.getTextSize()
      .then((val) => {
        this.textSize = val;
      });
  }

  onTextSizeChange(event) {
    this.settingsService.setTextSize(event.value);
  }

}
