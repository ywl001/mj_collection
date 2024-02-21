import { Component, Input } from '@angular/core';
import { Building, Hosing } from '../../app-type';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgFor, NgIf } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SqlService } from '../../services/sql.service';
import { GVar } from '../../global-variables';
import { User } from '../../User';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [MatExpansionModule, NgFor, MatButtonModule, NgIf],
  templateUrl: './building-page.component.html',
  styleUrl: './building-page.component.scss'
})
export class BuildingComponent {

  constructor(private dataService: DataService,
    private router: Router,
    private sql: SqlService,
    private location: Location,
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
      return 'green'
    } else if (item.result == 0) {
      return 'red'
    }
    return 'white'
  }

  ngOnInit() {
    this.getBuildingInfo()
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
        const roomNumber = `${unit + 1}-${i + 1}0${j + 1}`;
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

}
