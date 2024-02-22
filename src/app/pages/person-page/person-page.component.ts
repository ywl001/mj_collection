import { Component } from '@angular/core';

import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { HomePersonComponent } from './home-person/home-person.component';


import { Subscription, forkJoin, mergeMap } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

import { MatDialog } from '@angular/material/dialog';
import { PeopleSelectComponent } from '../../people-select/people-select.component';
import { People } from '../../Person';
import { DataService, MessageType } from '../../services/data.service';
import { SqlService } from '../../services/sql.service';
import { Person_building, TableName, Work } from '../../app-type';
import { User } from '../../User';
import { RoomErrorComponent } from '../../components/room-error/room-error.component';
import { GVar } from '../../global-variables';
import toastr from 'toastr'
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-person-page',
  standalone: true,
  imports: [MatButtonModule, PeopleSelectComponent, NgFor, HomePersonComponent,MatRadioModule,FormsModule],
  templateUrl: './person-page.component.html',
  styleUrl: './person-page.component.scss'
})
export class PersonPageComponent {

  persons: People[] = [];

  building_id;
  room_number;
  hosingName: string = '';
  buildingName: string;

  residence_types=[
    '自住','租住','经商','其他',
  ]

  residence_type:string = '自住';

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
      this.persons.unshift(p)
      forkJoin([this.insertPeopleToBuilding(p), this.insertOrUpdateWork()]).subscribe(res => {
        //刷新视图
        this.getRoomPeoples();
      })
    }
  }

  private sub1: Subscription
  private sub2: Subscription
  ngOnInit() {
    this.getRoomPeoples();
    //选择同户人员的结果
    this.sub1 = this.dataService.selectPersons$.subscribe((res: any) => {
      res.forEach(p => {
        if (!this.checkPersonIsExist(p)) {
          this.persons.unshift(p)
          forkJoin([this.insertPeopleToBuilding(p), this.insertOrUpdateWork()])
            .subscribe(res => {
              toastr.info('添加成功')
              this.getRoomPeoples();
            })
        }
      })
    })

    this.sub2 = this.dataService.message$.subscribe(res => {
      if (res == MessageType.delPersonFromBuilding) {
        this.sql.getRoomPeoples(this.building_id, this.room_number)
          .subscribe(res => {
            this.persons = res;
            //删除人员后更新房屋状态
            this.insertOrUpdateWork().subscribe(res=>{
              toastr.info('更新房屋状态信息')
            });
          })
      }
    })
  }

  ngOnDestroy() {
    console.log('on destory')
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
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
    console.log('更新房屋状态信息')
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
      user_id: User.id,
      use_for:this.residence_type
    }
    console.log('插入' + tableData)
    return this.sql.insert(TableName.collect_work, tableData)
  }

  private updateWork(id) {
    const tableData: Work = {
      result_message: this.persons.length + '人',
      result: 1,
      user_id: User.id,
      use_for:this.residence_type
    }
    console.log('更新', tableData)
    return this.sql.update(TableName.collect_work, tableData, id)
  }

  onErrorWork() {
    const data = { building_id: this.building_id, room_number: this.room_number }
    this.dialog.open(RoomErrorComponent, { data: data })
  }

}
