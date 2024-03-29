import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class LocalStorgeService {
  public localStorage: any;

  constructor() {
    if (!window.localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = window.localStorage;
  }

  public set(key: string, value: string): void {
    this.localStorage[key] = value;
  }

  public get(key: string): string {
    return this.localStorage[key] || null;
  }

  public setObject(key:string,value:any){
    this.localStorage[key] = JSON.stringify(value)
  }

  public getObject(key:string){
    if(this.localStorage[key])
      return JSON.parse(this.localStorage[key]);
    return null
  }

  public remove(key: string): any {
    this.localStorage.removeItem(key);
  }

  public clear(){
    this.localStorage.clear();
  }

  /**删除包含关键字的所有键 */
  public remove2(keyword: string) {
    Object.keys(this.localStorage).forEach((item) => {
      // console.log(keyword,item)
      if (item.indexOf(keyword) != -1) this.remove(item);
    });
  }
}
