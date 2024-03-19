import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval, of } from 'rxjs';
import { DataService, MessageType } from '../../services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { XiaoquComponent } from '../../components/xiaoqu/xiaoqu.component';
import { MatDialog } from '@angular/material/dialog';
import { LongPressDirective } from '../../longpress';
import { DbService } from '../../services/db.service';
import { RegisterComponent } from '../../components/register/register.component';
import { GlobalService } from '../../global.service';
import { RouterPath } from '../../app-type';
import { FilterComponent } from '../../components/filter/filter.component';

@Component({
  selector: 'app-hosings',
  standalone: true,
  imports: [MatButtonModule,LongPressDirective,FilterComponent],
  templateUrl: './xiaoqu-list-page.component.html',
  styleUrl: './xiaoqu-list-page.component.scss'
})
export class XiaoquListPageComponent {

  hosings: any[] = []

  filterXiaoqu:any[] = [];

  isShowRegister:boolean = false;


  @Output()
  buildings = new EventEmitter()

  constructor(private dataService: DataService,
    private dialog: MatDialog,
    private gs:GlobalService,
    private dbService:DbService,
    private router: Router) {
      if(!gs.user){
        this.router.navigate([''])
      }

      this.isShowRegister = gs.user.type == 1;
  }

  private sub1:Subscription
  ngOnInit() {
    this.getAllHosing();
    this.sub1 = this.dataService.message$.subscribe(res => {
      if (res == MessageType.addHosing) {
        this.getAllHosing();
      }
    })
  }

  ngOnDestroy(){
    if(this.sub1)
      this.sub1.unsubscribe();
  }

  /**获取所有小区 */
  private getAllHosing() {
    this.dbService.getAllHosing().subscribe(res => {
      this.hosings = res
    })
  }

  // encodeURIComponent(JSON.stringify(building))
  onSelectHosing(xiaoqu: any) {
    // console.log(xiaoqu)
    this.gs.current_xiaoqu = xiaoqu;
    const data={
      xqId:xiaoqu.id,
      xqName:xiaoqu.hosing_name
    }
    this.router.navigate([RouterPath.xiaoqu,this.gs.serailizeData(data)])
  }

  onAddHosing() {
    // this.dataService.openDialog(HosingComponent, null)
    this.dialog.open(XiaoquComponent, null)
  }

  onLongPress(hosing){
    console.log('edit hosing')
    this.dialog.open(XiaoquComponent, { data: hosing })
  }

  onRigiste(){
    this.dialog.open(RegisterComponent)
  }

  onFilter(res){
    this.filterXiaoqu = res;
  }
}
