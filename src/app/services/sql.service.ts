import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

const PHP_SQL_URL = '/relative/back/sql.php'
@Injectable({
  providedIn: 'root'
})
export class SqlService {

  ACTION_SELECT = 'select';
  private ACTION_INSERT = 'insert';
  private ACTION_DELETE = 'delete';
  private ACTION_UPDATE = 'update';

  

  constructor(private http: HttpClient) { }


  getAllHosing(){
    const hosings:string[] = ['紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区']
    return of(hosings).pipe(delay(500))
  }

  getHosingBuildings(hosingName:string){
    const a = {
      building_number:'1',
      floor:6,
      unit_home:[2,2,2,2]
    };

    const b = {
      building_number:'2',
      floor:6,
      unit_home:[2,2,2,2]
    }

    const buildings = [a,b];
    return of(buildings).pipe(delay(500))
  }

  insert(tableName:string, data:any) {
    let sql: string = `insert into ${tableName} (`;

    Object.keys(data).forEach(key => {
      sql += key + ",";
    })

    sql = sql.substring(0, sql.length - 1) + ") values (";

    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value == "now()")//php now（）函数，不能带引号
        sql += value + ",";
      else
        sql += "'" + value + "',";
    })

    sql = sql.substring(0, sql.length - 1) + ")";
    // console.log(sql);
    return this.execSql(sql, this.ACTION_INSERT);
  }

  update(tableName:string, data, id) {
    let sql = "update " + tableName + " set ";

    Object.keys(data).forEach(key => {
      const value = data[key];
      if(value == null)
        sql+= (key + "=" + value +",");
      else
        sql += (key + "='" + value + "',");
    })
    sql = sql.substring(0, sql.length - 1) + " where id =" + id;
    console.log(sql);
    return this.execSql(sql, this.ACTION_UPDATE);
  }

  delete(tableName,id){
    let sql =  `delete from ${tableName} where id = ${id}`;
    console.log(sql)
    return this.execSql(sql,this.ACTION_DELETE);
  }

  execSql(sql: string, action: string) {
    return this.http.post<any>(PHP_SQL_URL, { 'sql': sql, 'action': action });
  }
}
