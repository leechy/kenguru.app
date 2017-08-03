import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
  private textSize: number;

  constructor(private storage: Storage) {
    this.storage.get('text-size').then((val) => {
       console.log('getTextSize', val);
       this.textSize = val;
    })
  }

  setTextSize(newSize: number) {
    this.storage.set('text-size', newSize);
    console.log('setTextSize', newSize);
    return this.textSize = newSize;
  }

  getTextSize(): Promise<any> {
    return this.storage.get('text-size');
  }
}
