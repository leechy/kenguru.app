import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
  private textSize: number = 6;

  constructor(private storage: Storage) {
    this.storage.get('text-size').then((val) => {
       this.textSize = val;
    })
  }

  setTextSize(newSize: number) {
    this.storage.set('text-size', newSize);
    return this.textSize = newSize;
  }

  getTextSize(): number {
    return this.textSize;
  }
}
