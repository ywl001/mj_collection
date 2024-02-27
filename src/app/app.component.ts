import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HosingsPageComponent } from './pages/hosings-page/hosings-page.component';
import { NgFor, NgIf } from '@angular/common';
import { DataService, MessageType } from './services/data.service';
import { of } from 'rxjs';
import { BuildingPageComponent } from './pages/building-page/building-page.component';
import { BuildingsPageComponent } from './pages/buildings-page/buildings-page.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { User } from './User';
import { LongPressDirective } from './longpress';
import { DbService } from './services/db.service';
import moment from 'moment';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatButtonModule,
    MatDialogModule,
    HosingsPageComponent,
    NgIf, NgFor,
    BuildingsPageComponent,
    LongPressDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '孟津区公安局信息采集';

  userName = ''

  constructor(private dataService: DataService,
    private dbService:DbService,
    private router: Router) {
  }

  ngOnInit() {
    console.log(moment().format('yyyy-DD-DD'))
    this.dataService.message$.subscribe(res => {
      if (res == MessageType.getUserInfo) {
        this.userName = User.real_name.substring(0, 1)
      }if(res == MessageType.login_success){
        this.userName = User.real_name.substring(0, 1)
      }
    })

    this.dataService.selectDate$.subscribe(res=>{
      this.dbService.getUserInserPersons(User.id,res).subscribe(res=>{
        console.log(res)
        this.saveSheet(res)
      })
    })
  }

  onGetUserWork() {
    this.router.navigate(['/userwork'])
  }

  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event): void {
  //   console.log('Scroll event triggered:', event);
  // }

  private saveSheet(arr: any[]) {
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'people');

    /* save to file */
    let fileName = User.real_name+'导出数据'
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

}
