import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Building, RouterPath, TableName } from '../../app-type';
import { BuildingComponent } from '../../components/building/building.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { QcodeComponent } from '../../components/qcode/qcode.component';
import { GlobalService } from '../../global.service';
import { LongPressDirective } from '../../longpress';
import { DataService, MessageType } from '../../services/data.service';
import { DbService } from '../../services/db.service';
import { LocalStorgeService } from '../../services/local-storge.service';
import Swal from 'sweetalert2';
import toastr from 'toastr';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [MatButtonModule, LongPressDirective,FilterComponent],
  templateUrl: './xiaoqu-page.component.html',
  styleUrl: './xiaoqu-page.component.scss'
})
export class XiaoquPageComponent {

  buildings = []
  filterBuildings = [];
  xiaoquId;
  xiaoquName:string;

  filterFields=['building_number']
  constructor(private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DbService,
    private local:LocalStorgeService,
    private gs:GlobalService,
    private dialog: MatDialog,
    private location: Location) {

    console.log('xiaoqu construstor')
    if (!gs.user) {
      this.router.navigate([''])
    }
    // this.xiaoquId = route.snapshot.params['xqId'];
    // this.xiaoquName = route.snapshot.params['xqName'];
    // this.xiaoquId = this.xiaoqu.id

    this.route.params.subscribe(params=>{
      const {xqId,xqName} = gs.parseData(params[RouterPath.xiaoqu]);
      this.xiaoquId = xqId;
      this.xiaoquName = xqName;
    })
  }

  private sub1: Subscription
  ngOnInit(): void {
    this.getBuildings(this.xiaoquId);
    this.sub1 = this.dataService.message$.subscribe(res => {
      if (res == MessageType.addBuilding || res == MessageType.editBuilding) {
        console.log('refresh buildings')
        this.getBuildings(this.xiaoquId);
      }
    })
  }

  ngOnDestroy() {
    if (this.sub1)
      this.sub1.unsubscribe();
  }

  private getBuildings(xiaoquId) {
    console.log(xiaoquId)
    this.dbService.getHosingBuildings(xiaoquId)
      .subscribe(res => {
        this.buildings = res;
      })
  }

  private clickCount = 0;
  private clickTimer

  onSelectBuilding(building: Building) {
    this.clickCount++
    if (this.clickCount === 1) {
      this.clickTimer = setTimeout(() => {
        if (this.clickCount === 1) {
          this.toBuildingPage(building)
          console.log('click');
        }
        this.clickCount = 0;
      }, 300); // Adjust this time according to your needs
    } else if (this.clickCount === 2) {
      clearTimeout(this.clickTimer);
      this.clickCount = 0;
      console.log('double click');
      this.delBuilding(building)
    }
  }

  private toBuildingPage(building:Building){
    this.gs.current_building = building;
    this.gs.panelIndex = -1;
    this.gs.savedScrollPosition = 0;

    this.router.navigate([RouterPath.building,this.gs.serailizeData({building:building,xqName:this.xiaoquName})])
  }

  private delBuilding(building:Building){
    Swal.fire({
      title: "确定要删除楼栋吗?",
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText:'取消',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.getBuildingWorkInfo(building.id).subscribe(res=>{
          if(res && res.length> 0){
            toastr.warning('楼栋下关联有人员，无法删除')
          }else{
            this.dbService.delete(TableName.collect_building,building.id).subscribe(res=>{
              if(res){
                this.getBuildings(this.xiaoquId);
              }
            })
          }
        })
      } 
    });
  }

  onBack() {
    this.location.back()
  }

  onAddBuilding() {
    // this.dataService.openDialog(BuildingComponent,null)
    this.dialog.open(BuildingComponent, { data: { hosingId: this.xiaoquId }, width: '90%', height: '80%' })
  }

  onEditBuildting(item) {
    console.log(item)
    this.dialog.open(BuildingComponent, { data: item })
  }

  onCreateQCode() {
    const url = `http://114.115.201.238/caiji/xiaoqu;xqId=${this.xiaoquId};xqName=${this.xiaoquName}`
    this.dialog.open(QcodeComponent, { data: {url:encodeURI(url),name:this.xiaoquName}})
  }

  onFilterResult(res){
    this.filterBuildings = res;
  }
}


