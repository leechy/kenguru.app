import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsService } from '../../services/settings';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../models/app-state.interface';
import { SettingsInterface, ChildrenInterface } from '../../models/settings.interface';

@Component({
  selector: 'page-child',
  templateUrl: 'child.html',
})
export class ChildPage implements OnInit, OnDestroy {

  // dates
  eighteenYearsAgo: Date = new Date();
  today: Date = new Date();

  // model
  childNo: number = -1;
  child: ChildrenInterface = {
    name: null,
    birthDate: ''
  };
  settingsState$: Observable<SettingsInterface>;
  settingsSubscription: Subscription;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settingsService: SettingsService,
    private store: Store<AppState>
  ) {
    this.eighteenYearsAgo.setFullYear(this.eighteenYearsAgo.getFullYear() - 18);
  }

  ngOnInit() {
    this.childNo = (this.navParams.data || this.navParams.data == 0)? this.navParams.data : -1;
    this.settingsState$ = this.store.select('settings');
    this.settingsSubscription = this.settingsState$.subscribe((settings: SettingsInterface) => {
      if (settings.children[this.childNo]) {
        this.child = settings.children[this.childNo];
      }
    });
    console.log('this.childNo', this.childNo);
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
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
