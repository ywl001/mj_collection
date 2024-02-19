// data.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private buildings = new Subject();
  building$ = this.buildings.asObservable();
  building(data: any) {
    this.buildings.next(data);
  }

  private sharedData: any;

  setSharedData(data: any): void {
    this.sharedData = data;
  }

  getSharedData(): any {
    return this.sharedData;
  }
}
