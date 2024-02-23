// data.service.ts

import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { People } from '../Person';


export enum MessageType {
  delPersonFromBuilding = 'delPersonFromBuilding',
  startPickMapPoint = 'startMove',
  refreshMark = 'refreshMark',
  clickMap = 'clickMap',
  uploadFile = 'uploadFile',
  closePeoplePlanel = 'closePeoplePlanel',
  saveLocation = "saveLocation",
  changeLayer = 'changeLayer',
  addBuilding = 'addBuilding',
  editBuilding = 'editBuilding',
  clearSketchGraphic = 'clearSketchGraphic',
  uploadPhotoComplete='uploadPhotoComplete',
  addHosing = 'addHosing',
  getUserInfo = 'getUserInfo'
  // closeDialog = 'closeDialog'
}

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private _selectPersons = new Subject<any[]>();
  selectPersons$ = this._selectPersons.asObservable();
  selectPersons(data: any[]) {
    this._selectPersons.next(data);
  }

  private _message = new Subject<MessageType>();
  message$ = this._message.asObservable();
  sendMessage(m:MessageType) {
    this._message.next(m);
  }

  private _personExtension = new Subject<People>();
  personExtension$ = this._personExtension.asObservable();
  personExtension(data:People) {
    this._personExtension.next(data);
  }

  // private routeData: any={};

  // setRouteData(key:string,data: any): void {
  //   this.routeData[key] = data;
  // }

  // getRouteData(key:string): any {
  //   return this.routeData[key];
  // }
}
