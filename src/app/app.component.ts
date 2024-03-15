import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { XiaoquListPageComponent } from './pages/xiaoqu-list-page/xiaoqu-list-page.component';
import { NgFor, NgIf } from '@angular/common';
import { DataService, MessageType } from './services/data.service';
import { of } from 'rxjs';
import { BuildingPageComponent } from './pages/building-page/building-page.component';
import { XiaoquPageComponent } from './pages/xiaoqu-page/xiaoqu-page.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { LongPressDirective } from './longpress';
import { DbService } from './services/db.service';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatButtonModule,
    MatDialogModule,
    XiaoquListPageComponent,
    NgIf, NgFor,
    XiaoquPageComponent,
    LongPressDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '孟津区公安局信息采集';

  userName = ''

  constructor(private dataService: DataService,
    private userService:UserService,
    private dbService:DbService,
    private router: Router) {
  }

  ngOnInit() {
    console.log(moment().format('yyyy-DD-DD'))
    this.dataService.message$.subscribe(res => {
      if (res == MessageType.getUserInfo || res == MessageType.login_success) {
        this.userName = this.userService.user?.real_name
      }
    })

    this.dataService.selectDate$.subscribe(res=>{
      if(this.userService.user){
        this.dbService.getUserInsertPersons(this.userService.user?.id,res).subscribe(res=>{
          console.log(res)
          this.saveSheet(res)
        })
      }
    })
  }

  onGetUserWork() {
    if(this.userName && this.userName!=''){
      this.router.navigate(['/userwork'])
    }
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
