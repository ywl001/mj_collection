import { Injectable } from '@angular/core';
import { User } from '../app-type';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: User;
  public get user(): User {
    return this._user;
  }
  public set user(value: User) {
    this._user = value;
  }

  constructor() { }



}
