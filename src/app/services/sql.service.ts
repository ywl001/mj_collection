import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, of } from 'rxjs';
import { People } from '../Person';
import { TableName } from '../table';

const PHP_SQL_URL = '/mjcollect/back/sql.php'
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
    // const hosings:string[] = ['紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区']
    // return of(hosings).pipe(delay(500))
    const sql = `select * from ${TableName.collect_hosing}`;
    console.log(sql)
    return this.execSql(sql,this.ACTION_SELECT)
  }

  getHosingBuildings(hosing_id:string){
    const sql = `select * from ${TableName.collect_building} where hosing_id = ${hosing_id}`
    return this.execSql(sql,this.ACTION_SELECT)
  }

  getPeople(data:any){
    const inputType = data.inputType;
    const keyword = data.input;
    let sql:string;
    if(inputType == 1){
      sql=`select dispinct on(p.id) sex, name,p.pid,p.telephone,p.work_place,thumb_url from people p left join people_photo pp on p.id=pp.people_id where pid = '${keyword}'`
    }else{
      // sql = `select * from people where match (name) AGAINST('${keyword}' IN BOOLEAN MODE)`
      sql = `select p.id,sex, name,p.pid,p.telephone,p.work_place,thumb_url from people p left join people_photo pp on p.id=pp.people_id where name = '${keyword}'`
    }
    console.log(sql)
    return this.execSql(sql, this.ACTION_SELECT).pipe(
      map(res=>this.uniqueArray(res)),
      map(res=>res.map(p=>People.toPeople(p)))
    );
  }

  getHomePeoples(pid){
    const sql=`SELECT DISTINCT ON (p2.id) p2.name,p2.pid,p2.id,p2.telephone,p2.work_place, pp.thumb_url
    FROM people p1
    JOIN mj_people ph1 ON p1.id = ph1.people_id
    JOIN mj_people ph2 ON ph1.home_number = ph2.home_number
    JOIN people p2 ON ph2.people_id = p2.id
    LEFT JOIN people_photo pp ON p2.id = pp.people_id
    WHERE p1.id = ${pid};`
    return this.execSql(sql,this.ACTION_SELECT)
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
    console.log(sql);
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
