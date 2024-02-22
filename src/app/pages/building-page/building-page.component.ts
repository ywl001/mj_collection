import { Component, Input } from '@angular/core';
import { Building, Hosing } from '../../app-type';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgFor, NgIf } from '@angular/common';
import { DataService, MessageType } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SqlService } from '../../services/sql.service';
import { GVar } from '../../global-variables';
import { User } from '../../User';
import { MatDialog } from '@angular/material/dialog';
import { BuildingComponent } from '../../components/building/building.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [MatExpansionModule, NgFor, MatButtonModule, NgIf],
  templateUrl: './building-page.component.html',
  styleUrl: './building-page.component.scss'
})
export class BuildingPageComponent {

  constructor(
    private router: Router,
    private sql: SqlService,
    private location: Location,
    private dialog:MatDialog,
    private dataService:DataService,
    route: ActivatedRoute) {
      if(!User.id){
        this.router.navigate([''])
      }
    this.building = route.snapshot.queryParams;
    this.hosing = GVar.current_hosing;
  }

  @Input()
  building: Building = {}

  unitRoomNumbers = [];

  private buildingInfos = [];

  hosing:Hosing;

  getBgColor(item): string {
    if (item.result == 1) {
      return 'lightgreen'
    } else if (item.result == 0) {
      return 'red'
    }
    return 'white'
  }

  private sub1:Subscription
  ngOnInit() {
    this.getBuildingInfo()
    this.sub1 = this.dataService.message$.subscribe(res=>{
      if(res == MessageType.editBuilding){
        console.log('编辑楼栋后刷新')
        this.getBuildingInfo();
      }
    })
  }

  ngOnDestroy(){
    if(this.sub1){
      this.sub1.unsubscribe();
    }
  }

  private numToArray(num) {
    return Array(num).fill(0).map((x, i) => i + 1);
  }

  onClickUnit(unit) {
    console.log(unit)
    this.unitRoomNumbers = this.createUnitArray(unit)
  }

  private createUnitArray(unit) {
    const countHome = this.building.unit_home[unit];
    let arr = [];
    for (let i = 0; i < this.building.floor; i++) {
      for (let j = 0; j < countHome; j++) {
        let roomNumber;
        if(j<10){
          roomNumber = `${unit + 1}-${i + 1}0${j + 1}`;
        }else{
          roomNumber = `${unit + 1}-${i + 1}${j + 1}`;
        }
        let a: any = {};
        a.room_number = roomNumber;

        for (let k = 0; k < this.buildingInfos.length; k++) {
          const b = this.buildingInfos[k];
          if (b.room_number == roomNumber) {
            a.result = b.result
            a.result_message = b.result_message
          }
        }
        arr.push(a)
      }
    }

    return arr;
  }

  private getBuildingInfo() {
    this.sql.getBuildingWorkInfo(this.building.id).subscribe(res => {
      this.buildingInfos = res;
    })
  }

  onBack() {
    this.location.back()
  }

  onClickRoom(room) {
    //导航到person-page,building-id,room-number
    this.router.navigate(['person'], { queryParams: { building_id: this.building.id, room_number: room.room_number } })
  }

  onEditBuilding(){
    const data = Object.assign({},this.building,{hosingId:this.hosing.id})
    this.dialog.open(BuildingComponent,{data:this.building})
  }

}
