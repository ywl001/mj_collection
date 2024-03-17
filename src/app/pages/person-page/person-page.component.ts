import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { HomePersonComponent } from './home-person/home-person.component';
import { Subscription, mergeMap, take } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { PeopleSelectComponent } from '../../people-select/people-select.component';
import { People } from '../../Person';
import { DataService, MessageType } from '../../services/data.service';
import { Person_building, RouteParams, RouterPath, TableName, Work, personPageData } from '../../app-type';
import { RoomErrorComponent } from '../../components/room-error/room-error.component';
import toastr from 'toastr'
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { PersonExtensionDialogComponent } from '../../components/person-extension-dialog/person-extension-dialog.component';
import { DbService } from '../../services/db.service';
import { PeopleListComponent } from '../../components/people-list/people-list.component';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-person-page',
  standalone: true,
  imports: [MatButtonModule, PeopleSelectComponent, HomePersonComponent, MatRadioModule, FormsModule],
  templateUrl: './person-page.component.html',
  styleUrl: './person-page.component.scss'
})
export class PersonPageComponent {

  persons: People[] = [];

  building_id: number;
  room_number: string;
  xiaoquName: string = '';
  buildingName: string;

  residence_types = [
    '自住', '租住', '经商', '其他',
  ]

  residence_type: string = '自住';

  constructor(private dataService: DataService,
    private router: Router,
    private dialog: MatDialog,
    private dbService: DbService,
    route:ActivatedRoute,
    private gs: GlobalService,
    private location: Location) {
    if (!gs.user) {
      this.router.navigate([''])
    }

    route.params.subscribe(params=>{
      const data:personPageData = this.gs.parseData(params[RouterPath.person])
      this.building_id = data.buildingId
      this.room_number = data.roomNumber
      this.xiaoquName = data.xqName;
      this.buildingName = data.buildingNumber + '号楼';
    })
  }

  //选择人员组件选择人员后
  onSelectPeople(p) {
    if (this.checkPersonIsExist(p)) {
      //人员已经存在
      toastr.info('人员已经存在')
    } else {
      //插入住所信息，工作信息
      // 1、打开对话框选择人员是否房主和是否在户籍地
      this.dialog.open(PersonExtensionDialogComponent, { data: p })
      //2、选择后插入数据
      this.dataService.personExtension$.pipe(take(1)).
        subscribe(p => {
          //插入人员到人员房屋表
          this.insertPeopleToBuilding(p).subscribe(res => {
            console.log(res)
            p.pb_id = res.insertedId;
            this.persons.push(p);
            //更新房屋状态
            this.insertOrUpdateWork().subscribe(res => {
              toastr.success('添加人员成功');
              this.getRoomPeoples()
            })
          })
        })
    }
  }

  private sub1: Subscription
  private sub2: Subscription
  ngOnInit() {
    this.getRoomPeoples();
    this.getRoomWorkInfo();
    //选择同户人员的结果
    this.sub1 = this.dataService.selectPersons$.subscribe((res: any) => {
      res.forEach(p => {
        if (!this.checkPersonIsExist(p)) {
          p.is_host = 0;
          p.is_huji = this.gs.homePeopleHost.is_huji;
          console.log('one home', p)
          this.insertPeopleToBuilding(p).subscribe(res => {
            p.pb_id = res;
            this.persons.push(p)
            this.insertOrUpdateWork().subscribe(res => {
              toastr.info('插入人员' + p.name + '成功')
              // this.getRoomPeoples()
            })
          })
        } else {
          toastr.info(`人员${p.name}已经存在`)
        }
      })
    })

    this.sub2 = this.dataService.deleteBuildingPerson$.subscribe(delPersonId => {
      const pindex = this.persons.findIndex(p => p.id === delPersonId)
      this.persons.splice(pindex, 1);
      this.insertOrUpdateWork().subscribe(res => {
        toastr.info('更新房屋状态信息')
      });
    })
  }

  ngOnDestroy() {
    console.log('on destory')
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
    this.gs.userRecord = null
  }

  //获取房间人员
  private getRoomPeoples() {
    this.dbService.getRoomPeoples(this.building_id, this.room_number).subscribe(res => {
      console.log('room peoples', res)
      this.persons = res;
    })
  }

  //为单选按钮赋值
  private getRoomWorkInfo() {
    console.log(this.building_id, this.room_number)
    this.dbService.getRoomWorkInfo(this.building_id, this.room_number).subscribe(res => {
      // console.log('get room work info', res)
      if (res.length > 0) {
        const workInfo = res[0]
        this.residence_type = workInfo.use_for;
      }
    })
  }

  checkPersonIsExist(p) {
    return this.persons.findIndex(v => v.id == p.id) > -1
  }

  onBack() {
    this.location.back();
  }

  onChange() {
    console.log('on change')
    this.insertOrUpdateWork().subscribe(res => {
      toastr.info('更新房屋信息成功')
    })
  }

  //插入人员到楼栋房间
  private insertPeopleToBuilding(p: People) {
    const tableData: Person_building = {
      building_id: this.building_id,
      room_number: this.room_number,
      person_id: p.id,
      is_host: p.is_host,
      user_id: this.gs.user.id,
      is_huji: p.is_huji
    }
    return this.dbService.insert(TableName.person_building, tableData)
  }

  private insertOrUpdateWork() {
    console.log('更新房屋状态信息')
    return this.dbService.getRoomWorkIsExists(this.building_id, this.room_number).pipe(
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
    let tableData: Work = {
      building_id: this.building_id,
      room_number: this.room_number,
      result_message: this.persons.length + '人',
      result: 1,
      user_id: this.gs.user.id,
      use_for: this.residence_type
    }
    console.log('插入work table' + tableData)
    return this.dbService.insert(TableName.collect_work, tableData)
  }

  private updateWork(id) {
    if(this.persons.length == 0){
      return this.dbService.delete(TableName.collect_work,id)
    }else{
      let tableData: Work = {
        result_message: this.persons.length + '人',
        result: 1,
        user_id: this.gs.user.id,
        use_for: this.residence_type
      }
      console.log('更新 work table', tableData)
      return this.dbService.update(TableName.collect_work, tableData, id)
    }
  }

  onErrorWork() {
    const data = { building_id: this.building_id, room_number: this.room_number }
    this.dialog.open(RoomErrorComponent, { data: data })
  }

  onShowQueryPeoples(peoples) {
    this.dialog.open(PeopleListComponent, { data: peoples })
  }
}
