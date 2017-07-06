import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage implements OnInit {

  post: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.post = this.navParams.data;
    console.log(this.post);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

}
