import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, MessageType } from '../../services/data.service';
import { Location } from '@angular/common';
import { BuildingComponent } from '../../components/building/building.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, map } from 'rxjs';
import { DbService } from '../../services/db.service';
import { LongPressDirective } from '../../longpress';
import { QcodeComponent } from '../../components/qcode/qcode.component';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [NgFor, MatButtonModule, LongPressDirective],
  templateUrl: './xiaoqu-page.component.html',
  styleUrl: './xiaoqu-page.component.scss'
})
export class XiaoquPageComponent {

  buildings = []
  xiaoquId;
  xiaoqu;
  constructor(private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DbService,
    private gs:GlobalService,
    private dialog: MatDialog,
    private location: Location) {

    console.log('xiaoqu construstor')
    if (!gs.user || !gs.current_xiaoqu) {
      this.router.navigate([''])
    }
    this.xiaoqu = gs.current_xiaoqu
    this.xiaoquId = this.xiaoqu.id
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

  onSelectBuilding(building: any) {
    this.gs.current_building = building;
    this.gs.panelIndex = -1;
    this.gs.savedScrollPosition = 0;

    this.router.navigate(['/building'],{queryParams:building})
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
    const pre = 'http://114.115.201.238/caiji/'
    const url = pre+this.route.snapshot.url.join('/');
    this.dialog.open(QcodeComponent, { data: {url:url,name:this.xiaoqu.hosing_name}})
  }
}


