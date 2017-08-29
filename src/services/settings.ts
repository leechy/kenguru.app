import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
  private textSize: number = 6;
  private birthDate: string = null;
  private children: any[] = new Array();

  constructor(private storage: Storage) {
    this.updateValuesFromStorage();
  }

  updateValuesFromStorage() {
    this.storage.get('text-size').then((val) => {
      if (val) {
        this.textSize = val;
      }
    });
    this.storage.get('birth-date').then((val) => {
      if (val) {
        this.birthDate = val;
      }
    });
    this.storage.get('children').then((val) => {
      if (val) {
        this.children = val;
      }
    });
  }

  // Text Size
  setTextSize(newSize: number) {
    this.storage.set('text-size', newSize);
    return this.textSize = newSize;
  }
  getTextSize(): number {
    return this.textSize;
  }

  // Pregnancy (expected birth date)
  setBirthDate(newBirthDate: string) {
    this.storage.set('birth-date', newBirthDate);
    return this.birthDate = newBirthDate;
  }
  getBirthDate(): string {
    return this.birthDate;
  }
  removeBirthDate(): void {
    this.storage.remove('birth-date');
  }

  // Children
  addChild(newChildData) {
    console.log('addChild', this.children, newChildData);
    this.children.push(newChildData);
    this.updateChildren();
  }
  updateChild(childNo, newChildData) {
    this.children[childNo] = newChildData;
    this.updateChildren();
  }
  removeChild(childNo) {
    this.children.splice(childNo, 1);
    this.updateChildren();
  }
  getChildren() {
    return this.children;
  }
  getChildDataByNo(childNo) {
    return this.children[childNo];
  }
  updateChildren() {
    this.storage.set('children', this.children);
  }
}
