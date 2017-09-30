import { ShowWelcomeScreen } from './../store/settings.actions';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app-state.interface';
import * as SettingsActions from '../store/settings.actions';
import { ChildrenInterface } from '../models/settings.interface';

@Injectable()
export class SettingsService {

  children: ChildrenInterface[] = [];

  constructor(
    private storage: Storage,
    private store: Store<AppState>
  ) {
    this.updateValuesFromStorage();
  }

  updateValuesFromStorage() {
    this.storage.get('text-size').then((val) => {
      if (val) {
        this.store.dispatch(new SettingsActions.SetTextSize(val));
      }
    });
    this.storage.get('birth-date').then((val) => {
      if (val) {
        this.store.dispatch(new SettingsActions.SetBirthDate(val));
      }
    });
    this.storage.get('children').then((val: ChildrenInterface[]) => {
      if (val) {
        console.log('children', val);
        this.children = val;
        this.store.dispatch(new SettingsActions.AddChildren(val));
      }
    });
    this.storage.get('welcome-screen').then((val) => {
      console.log('store welcome-screen', val);
      this.store.dispatch(new SettingsActions.IsWelcomeScreenShown(val));
    });
  }

  hideWelcomeScreen() {
    this.storage.set('welcome-screen', true);
    this.store.dispatch(new SettingsActions.IsWelcomeScreenShown(true));
  }

  // Text Size
  setTextSize(newSize: number) {
    this.storage.set('text-size', newSize);
    this.store.dispatch(new SettingsActions.SetTextSize(newSize));
  }

  // Pregnancy (expected birth date)
  setBirthDate(newBirthDate: string) {
    this.storage.set('birth-date', newBirthDate);
    this.store.dispatch(new SettingsActions.SetBirthDate(newBirthDate));
  }
  removeBirthDate(): void {
    this.storage.remove('birth-date');
    this.store.dispatch(new SettingsActions.RemoveBirthDate());
  }

  // Children
  addChild(newChildData) {
    console.log('SettingsService addChild', this.children, 'child', newChildData);
    this.children.push(newChildData);
    this.store.dispatch(new SettingsActions.AddChild(newChildData));
    this.updateChildren();
  }
  updateChild(childNo, newChildData) {
    console.log('SettingsService updateChild', this.children, 'childNo', childNo, 'child', newChildData);
    this.children[childNo] = newChildData;
    this.store.dispatch(new SettingsActions.UpdateChild({ id: childNo, child: newChildData }));
    this.updateChildren();
  }
  removeChild(childNo) {
    console.log('SettingsService removeChild', this.children, 'childNo', childNo);
    this.children.splice(childNo, 1);
    this.store.dispatch(new SettingsActions.RemoveChild(childNo));
    this.updateChildren();
  }
  updateChildren() {
    console.log('SettingsService updateChildren', this.children);
    this.storage.set('children', this.children);
  }
}
