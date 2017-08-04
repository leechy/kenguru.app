import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsService } from '../../services/settings';

@Component({
  selector: 'page-child',
  templateUrl: 'child.html',
})
export class ChildPage {

  // dates
  eighteenYearsAgo: Date = new Date();
  today: Date = new Date();

  // model
  childNo: number = -1;
  child: any = {
    name: '',
    birthDate: ''
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settingsService: SettingsService
  ) {
    this.eighteenYearsAgo.setFullYear(this.eighteenYearsAgo.getFullYear() - 18);
  }

  ngOnInit() {
    if (this.navParams.data || this.navParams.data == 0) {
      this.childNo = this.navParams.data;
      if (this.childNo >= 0) {
        this.child = this.settingsService.getChildDataByNo(this.childNo);
      }
    } else {
      this.childNo = -1;
    }
    console.log('this.childNo', this.childNo);
  }

  saveChild() {
    console.log('Child', this.child);
    if (this.child.birthDate && this.child.birthDate != '') {
      if (this.childNo >= 0) {
        this.settingsService.updateChild(this.childNo, this.child);
      } else {
        this.settingsService.addChild(this.child);
      }
      this.navCtrl.pop();
    }
  }

  removeChild() {
    if (this.childNo >= 0) {
      this.settingsService.removeChild(this.childNo);
      this.navCtrl.pop();
    }
  }

}
