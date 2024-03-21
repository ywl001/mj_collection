import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import toastr from 'toastr';
import { RouterPath, TableName, Xiaoqu } from '../../app-type';
import { FilterComponent } from '../../components/filter/filter.component';
import { RegisterComponent } from '../../components/register/register.component';
import { XiaoquComponent } from '../../components/xiaoqu/xiaoqu.component';
import { GlobalService } from '../../global.service';
import { LongPressDirective } from '../../longpress';
import { DataService, MessageType } from '../../services/data.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-hosings',
  standalone: true,
  imports: [MatButtonModule, LongPressDirective, FilterComponent,SweetAlert2Module],
  templateUrl: './xiaoqu-list-page.component.html',
  styleUrl: './xiaoqu-list-page.component.scss'
})
export class XiaoquListPageComponent {

  hosings: any[] = []

  filterXiaoqu: any[] = [];

  isShowRegister: boolean = false;


  @Output()
  buildings = new EventEmitter()

  constructor(private dataService: DataService,
    private dialog: MatDialog,
    private gs: GlobalService,
    private dbService: DbService,
    private router: Router) {
    if (!gs.user) {
      this.router.navigate([''])
    }

    this.isShowRegister = gs.user.type == 1;
  }

  private sub1: Subscription
  ngOnInit() {
    this.getAllHosing();
    this.sub1 = this.dataService.message$.subscribe(res => {
      if (res == MessageType.addHosing) {
        this.getAllHosing();
      }
    })
  }

  ngOnDestroy() {
    if (this.sub1)
      this.sub1.unsubscribe();
  }

  /**获取所有小区 */
  private getAllHosing() {
    this.dbService.getAllHosing().subscribe(res => {
      this.hosings = res
    })
  }

  // encodeURIComponent(JSON.stringify(building))
  private clickCount = 0;
  private clickTimer
  // clicked: boolean = false;

  onClickXiaoqu(xiaoqu: Xiaoqu) {
    this.clickCount++;
    if (this.clickCount === 1) {
      this.clickTimer = setTimeout(() => {
        if (this.clickCount === 1) {
          this.toXiaoquPage(xiaoqu)
          console.log('click');
        }
        this.clickCount = 0;
      }, 300); // Adjust this time according to your needs
    } else if (this.clickCount === 2) {
      clearTimeout(this.clickTimer);
      this.clickCount = 0;
      console.log('double click');
      this.delXiaoqu(xiaoqu)
    }
  }

  toXiaoquPage(xiaoqu: Xiaoqu) {
    this.gs.current_xiaoqu = xiaoqu;
    const data = {
      xqId: xiaoqu.id,
      xqName: xiaoqu.hosing_name
    }
    this.router.navigate([RouterPath.xiaoqu, this.gs.serailizeData(data)])
  }

  delXiaoqu(xq:Xiaoqu){
    Swal.fire({
      title: "确定要删除小区吗?",
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText:'取消',
    }).then((result) => {
      if (result.isConfirmed) {
        this.checkXiaoquHasBuilding(xq).subscribe(res=>{
          if(res && res.length> 0){
            toastr.warning('小区下面有楼栋，无法删除')
          }else{
            this.dbService.delete(TableName.collect_hosing,xq.id).subscribe(res=>{
              if(res){
                this.getAllHosing();
              }
            })
          }
        })
      } 
    });
  }

  private checkXiaoquHasBuilding(xq:Xiaoqu){
    return this.dbService.getHosingBuildings(xq.id);
  }

  onAddHosing() {
    // this.dataService.openDialog(HosingComponent, null)
    this.dialog.open(XiaoquComponent, null)
  }

  onLongPress(hosing) {
    console.log('edit hosing')
    this.dialog.open(XiaoquComponent, { data: hosing })
  }

  onRigiste() {
    this.dialog.open(RegisterComponent)
  }

  onFilter(res) {
    this.filterXiaoqu = res;
  }

  onDbClick(item) {
    console.log('db click')
  }
}
