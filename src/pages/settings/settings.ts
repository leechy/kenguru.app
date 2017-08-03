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
    this.textSize = this.settingsService.getTextSize();
  }

  onTextSizeChange(event) {
    this.settingsService.setTextSize(event.value);
  }

}
