import { Component } from '@angular/core';
import { CommonModule, NgFor, Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorgeService } from '../../services/local-storge.service';
import { DbService } from '../../services/db.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportDataComponent } from '../../components/export-data/export-data.component';
import { DataService, MessageType } from '../../services/data.service';
import { GlobalService } from '../../global.service';
import { RouteParams, RouterPath, personPageData } from '../../app-type';
import { RoomItemComponent } from '../../room-item/room-item.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [MatButtonModule,ExportDataComponent,RoomItemComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class WorkPageComponent {
  works = []

  // formattedDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');

  constructor(private sql: DbService,
    private location: Location,
    private local:LocalStorgeService,
    private dataService:DataService,
    private dialog:MatDialog,
    private gs:GlobalService,
    private router: Router) {
    if (!gs.user) {
      this.router.navigate([''])
    }
  }

  ngOnInit(): void {
    this.sql.getUserWork(this.gs.user.id).pipe(
      map((res:any[])=>{
        return res.map(item=>{
          const a:personPageData = {
            xqName:item.hosing_name,
            buildingId:item.building_id,
            buildingNumber:item.building_number,
            result:item.result,
            resultMessage:item.result_message,
            roomNumber:item.room_number,
            type:'user',
            userId:item.user_id
          }
          return a;
        })
      })
    ).subscribe(res => {
      console.log(res)
      this.works = res;
    })
  }

  back() {
    this.location.back()
  }

  onLogout(){
    this.local.clear();
    this.gs.user = null;
    this.router.navigate([RouterPath.login])
  }

  onExportData(){
    this.dialog.open(ExportDataComponent)
  }

  // getItem(item){

  // }

  onClick(item){
    console.log(item)
    this.gs.userRecord = item;

    // const data:personPageData={
    //   xqName:item.hosing_name,
    //   buildingId:item.building_id,
    //   roomNumber:item.room_number,
    //   buildingNumber:item.building_number
    // }

    this.router.navigate([RouterPath.person,this.gs.serailizeData(item)])
  }
}
