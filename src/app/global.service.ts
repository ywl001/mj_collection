import { Injectable } from '@angular/core';
import { Hosing, Building, User } from './app-type';
import { People } from './Person';
import { DataService } from './services/data.service';
import { LocalStorgeService } from './services/local-storge.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  current_xiaoqu: Hosing;
  current_building: Building;
  current_room_number: string;

  //记录building页面打开的面包的index和楼栋的buildingInfo
  panelIndex:number = -1;
  savedScrollPosition;

  //当旋转同户人员时，保存查询人员的is_huji 属性，给同户人员
  homePeopleHost:People;

  userRecord:any;


  private _user: User;
  public get user(): User {
    if(!this._user){
      this._user = this.local.getObject('user');
      console.log('get local user login')
      this.dataService.login(this._user);
    }
    return this._user;
  }
  public set user(value: User) {
    this._user = value;
    this.dataService.login(value);
    console.log('set user login')
    value ? this.local.setObject('user',value) : this.local.remove('user')
  }

  constructor(private dataService:DataService,private local:LocalStorgeService) { }


  serailizeData(data:any){
    return encodeURIComponent(JSON.stringify(data))
  }

  parseData(data:string){
    return JSON.parse(decodeURIComponent(data))
  }
}
