import { Component } from '@angular/core';

import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { HomePersonComponent } from './home-person/home-person.component';


import { forkJoin, mergeMap } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

import { MatDialog } from '@angular/material/dialog';
import { PeopleSelectComponent } from '../../people-select/people-select.component';
import { People } from '../../Person';
import { DataService } from '../../services/data.service';
import { SqlService } from '../../services/sql.service';
import { Person_building, TableName, Work } from '../../app-type';
import { User } from '../../User';
import { RoomErrorComponent } from '../../components/room-error/room-error.component';
import { GVar } from '../../global-variables';
import toastr from 'toastr'

@Component({
  selector: 'app-person-page',
  standalone: true,
  imports: [MatButtonModule, PeopleSelectComponent, NgFor, HomePersonComponent],
  templateUrl: './person-page.component.html',
  styleUrl: './person-page.component.scss'
})
export class PersonPageComponent {

  persons: People[] = [];

  building_id;
  room_number;
  hosingName: string = '';
  buildingName: string;

  constructor(private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private sql: SqlService,
    private location: Location) {
    if (!User.id) {
      this.router.navigate([''])
    }
    this.building_id = route.snapshot.queryParams['building_id'];
    this.room_number = route.snapshot.queryParams['room_number'];
    console.log('person-page', this.building_id, this.room_number);
    this.hosingName = GVar.current_hosing?.hosing_name
    this.buildingName = GVar.current_building?.building_number + '号楼';
  }

  onSelectPeople(p) {
    if (this.checkPersonIsExist(p)) {
      //人员已经存在
    } else {
      //插入住所信息，工作信息
      forkJoin([this.insertPeopleToBuilding(p), this.insertOrUpdateWork()]).subscribe(res => {
        //刷新视图
        this.persons.unshift(p)
      })
    }
  }

  ngOnInit() {
    this.getRoomPeoples();
    //选择同户人员的结果
    this.dataService.selectPersons$.subscribe((res: any) => {
      console.log('sss', res)
      // this.persons = this.persons.concat(res)
      res.forEach(p => {
        if (!this.checkPersonIsExist(p)) {
          this.persons.unshift(p)
          forkJoin([this.insertPeopleToBuilding(p), this.insertOrUpdateWork()]).subscribe(res => {
            toastr.info('添加成功')
          })
        }
      })
    })
  }

  //获取房间人员
  private getRoomPeoples() {
    this.sql.getRoomPeoples(this.building_id, this.room_number).subscribe(res => {
      console.log('room peoples', res)
      this.persons = res;
    })
  }

  checkPersonIsExist(p) {
    return this.persons.findIndex(v => v.id == p.id) > -1
  }

  onBack() {
    this.location.back()
  }

  private insertPeopleToBuilding(p: People) {
    const tableData: Person_building = {
      building_id: this.building_id,
      room_number: this.room_number,
      person_id: p.id,
      is_host: 0,
      user_id: User.id,
      residence_type: '自住',
      is_huji: 1
    }
    return this.sql.insert(TableName.person_building, tableData)
  }


  private insertOrUpdateWork() {
    return this.sql.getRoomWorkIsExists(this.building_id, this.room_number).pipe(
      mergeMap(id => {
        if (id > 0) {
          return this.updateWork(id)
        } else {
          return this.insertWork()
        }
      })
    )
  }

  private insertWork() {
    const tableData: Work = {
      building_id: this.building_id,
      room_number: this.room_number,
      result_message: this.persons.length + '人',
      result: 1,
      user_id: User.id
    }
    return this.sql.insert(TableName.collect_work, tableData)
  }

  private updateWork(id) {
    const tableData: Work = {
      result_message: this.persons.length + '人',
      result: 1,
      user_id: User.id
    }
    return this.sql.update(TableName.collect_work, tableData, id)
  }

  onErrorWork() {
    const data = { building_id: this.building_id, room_number: this.room_number }
    this.dialog.open(RoomErrorComponent, { data: data })
  }

}
