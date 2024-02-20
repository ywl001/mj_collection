// data.service.ts

import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


export enum MessageType {
  closeInfowindow = 'closeInfoWindow',
  startPickMapPoint = 'startMove',
  refreshMark = 'refreshMark',
  clickMap = 'clickMap',
  uploadFile = 'uploadFile',
  closePeoplePlanel = 'closePeoplePlanel',
  saveLocation = "saveLocation",
  changeLayer = 'changeLayer',
  addBuilding = 'addBuilding',
  addPoint = 'addPoint',
  clearSketchGraphic = 'clearSketchGraphic',
  uploadPhotoComplete='uploadPhotoComplete',
  addHosing = 'addHosing'
}

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private buildings = new Subject();
  building$ = this.buildings.asObservable();
  building(data: any) {
    this.buildings.next(data);
  }

  private _message = new Subject<MessageType>();
  message$ = this._message.asObservable();
  sendMessage(m:MessageType) {
    this._message.next(m);
  }

  private _openDialog = new Subject();
  openDialog$ = this._openDialog.asObservable();
  openDialog(component:ComponentType<any>,data:any) {
    this._openDialog.next({component:component,data:data});
  }

  private routeData: any={};

  setRouteData(key:string,data: any): void {
    this.routeData[key] = data;
  }

  getRouteData(key:string): any {
    return this.routeData[key];
  }
}
