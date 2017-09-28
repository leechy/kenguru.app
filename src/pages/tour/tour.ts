import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-tour',
  templateUrl: 'tour.html',
})
export class TourPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TourPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
