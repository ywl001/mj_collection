import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { People } from '../Person';


enum PhpMethodNames {
  SELECT_HOSINGS = "selectHosings",
  GET_HOSING_BUILDINGS = "getHosingBuildings",
  GET_PEOPLE = "getPeople",
  GET_HOME_PEOPLES = "getHomePeoples",
  GET_ROOM_PEOPLES = "getRoomPeoples",
  GET_USER_INFO = "getUserInfo",
  GET_USER_WORK = "getUserWork",
  GET_USER_INSERT_PEOPLE='getUserInsertPeople',
  GET_BUILDING_WORK_INFO = "getBuildingWorkInfo",
  GET_USER_BUILDING_PERSONNEL = "getUserBuildingPersonnel",
  GET_BUILDING_PERSONS = 'getBuildingPeoples',
  GET_SELECT_RESULT = "getSelectResult",
  GET_ROOM_WORK_INFO = 'getRoomWorkInfo',
  GET_ROOM_WORK_IS_EXISTS = 'getRoomWorkIsExists',
  INSERT = "insert",
  UPDATE = "update",
  DELETE = "delete"
}
const PHP_SQL_URL = '/mjcollect/back/db.php'

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient) { }

  exec(phpFunc, data) {
    return this.http.post<any>(PHP_SQL_URL, { 'func': phpFunc, 'data': data })
  }

  getAllHosing() {
    return this.exec(PhpMethodNames.SELECT_HOSINGS, null)
  }

  getHosingBuildings(hosing_id: string) {
    return this.exec(PhpMethodNames.GET_HOSING_BUILDINGS, hosing_id).pipe(
      map(buildings => buildings.map(building => {
        building.unit_home = JSON.parse(building.unit_home);
        return building;
      }))
    )
  }

  getPeople(data: any) {
    return this.exec(PhpMethodNames.GET_PEOPLE, data).pipe(
      map(res => this.uniqueArray(res)),
      map(res => res.map(p => People.toPeople(p)))
    )
  }

  getHomePeoples(pid) {
    return this.exec(PhpMethodNames.GET_HOME_PEOPLES, pid)
  }

  getRoomPeoples(building_id, room_number) {
    return this.exec(PhpMethodNames.GET_ROOM_PEOPLES, { building_id: building_id, room_number: room_number })
  }

  getBuildingWorkInfo(building_id) {
    return this.exec(PhpMethodNames.GET_BUILDING_WORK_INFO, building_id)
  }

  getRoomWorkInfo(building_id, room_number) {
    return this.exec(PhpMethodNames.GET_ROOM_WORK_INFO, { building_id: building_id, room_number: room_number })
  }

  getRoomWorkIsExists(building_id, room_number) {
    return this.exec(PhpMethodNames.GET_ROOM_WORK_IS_EXISTS, { building_id: building_id, room_number: room_number }).pipe(
      map(res => {
        if (res.length > 0)
          return res[0].id
        else return 0;
      })
    )
  }

  getUserInfo(userName, password) {
    return this.exec(PhpMethodNames.GET_USER_INFO, { user_name: userName, password: password })
  }

  getUserWork(userid) {
    return this.exec(PhpMethodNames.GET_USER_WORK, userid)
  }

  getUserInserPersons(userid,selectDate) {
    return this.exec(PhpMethodNames.GET_USER_INSERT_PEOPLE, {userId:userid,selectDate:selectDate})
  }

  getUserBuildingPersons(buidlingId) {
    return this.exec(PhpMethodNames.GET_BUILDING_PERSONS, buidlingId)
  }


  insert(tableName: string, data: any) {
    console.log(data)
    return this.exec(PhpMethodNames.INSERT, { tableName: tableName, tableData: data })
  }

  update(tableName: string, data, id) {
    return this.exec(PhpMethodNames.UPDATE, { tableName: tableName, tableData: data, id: id })
  }

  delete(tableName, id) {
    return this.exec(PhpMethodNames.DELETE, { tableName: tableName, id: id })
  }

  private uniqueArray(arr: People[]) {
    let temp = [];
    arr.forEach(p => {
      if (temp.findIndex(p2 => p.id == p2.id) == -1) {
        temp.push(p)
      }
    })
    return temp;
  }

}
