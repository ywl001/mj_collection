import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { RouterPath } from './app-type';
import { LoadingComponent } from './components/loading/loading.component';
import { GlobalService } from './global.service';
import { DataService } from './services/data.service';
import { DbService } from './services/db.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    LoadingComponent,MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '孟津区公安局信息采集';

  userName = ''

  constructor(private dataService: DataService,
    private gs:GlobalService,
    private dbService:DbService,
    private router: Router) {
    }

  private sub1:Subscription
  ngOnInit() {
    this.sub1 = this.dataService.login$.subscribe(user=>{
      console.log('login')
      this.userName = user?.real_name?.charAt(0)
    })

    this.dataService.selectDate$.subscribe(res=>{
      if(this.gs.user){
        this.dbService.getUserInsertPersons(this.gs.user?.id,res).subscribe(res=>{
          console.log(res)
          this.saveSheet(res)
        })
      }
    })
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

  onGetUserWork() {
    if(this.userName && this.userName!=''){
      this.router.navigate([RouterPath.userwork])
    }
  }

  private saveSheet(arr: any[]) {
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'people');

    /* save to file */
    let fileName = this.gs.user?.real_name+'导出数据'
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

}
