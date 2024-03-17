import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterPath, personPageData } from '../app-type';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-room-item',
  standalone: true,
  imports: [],
  templateUrl: './room-item.component.html',
  styleUrl: './room-item.component.scss'
})
export class RoomItemComponent {

  @Input() data: personPageData;

  constructor(
    private router:Router,
    private gs:GlobalService
  ){}

  getBgColor(): string {
    if (this.data.userId > 10000) {
      return 'blue'
    }
    if (this.data.result == 1) {
      return 'lightgreen'
    } else if (this.data.result == 0) {
      if (this.data.resultMessage == '不在家')
        return 'lightGray'
      return 'silver'
    }
    return 'white'
  }

  getFontColor() {
    if (this.data.userId > 10000) {
      return 'white'
    }
    return null;
  }

  
  onClickRoom() {
    console.log(this.data)
    //导航到person-page,building-id,room-number
    // this.gs.current_room_number = room.room_number

    // const data:RouteParams={
    //   xqName:this.xqName,
    //   buildingId:this.building.id,
    //   roomNumber:room.room_number,
    //   buildingNumber:this.building.building_number
    // }
    this.router.navigate([RouterPath.person,this.gs.serailizeData(this.data)])
  }


}
