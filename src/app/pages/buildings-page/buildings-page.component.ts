import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, MessageType } from '../../services/data.service';
import { Location } from '@angular/common';
import { SqlService } from '../../services/sql.service';
import { BuildingComponent } from '../../components/building/building.component';
import { MatDialog } from '@angular/material/dialog';
import { GVar } from '../../global-variables';
import { User } from '../../User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [NgFor, MatButtonModule],
  templateUrl: './buildings-page.component.html',
  styleUrl: './buildings-page.component.scss'
})
export class BuildingsPageComponent {

  buildings = []
  hosingId;
  hosing;
  constructor(private dataService: DataService,
    private router: Router,
    private route:ActivatedRoute,
    private sql: SqlService,
    private dialog: MatDialog,
    private location: Location) {
      if(!User.id){
        this.router.navigate([''])
      }
    console.log('buildings construstor')
    // this.buildings = dataService.getRouteData('buildings')
    // this.hosingId = this.route.snapshot.params['hosing_id']
    this.hosing = GVar.current_hosing
    console.log(this.hosing)
    this.hosingId = this.hosing.id
    console.log(this.hosingId)
  }

  private sub1:Subscription
  ngOnInit(): void {
    this.getBuildings(this.hosingId);
    this.sub1 = this.dataService.message$.subscribe(res => {
      if (res == MessageType.addBuilding) {
        this.getBuildings(this.hosingId);
      }
    })
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }

  private getBuildings(hosingId) {
    this.sql.getHosingBuildings(hosingId).subscribe(res => {
      console.log(res)
      this.buildings = res;
    })
  }

  onSelectBuilding(building: any) {
    GVar.current_building = building;
    this.router.navigate(['building'],{queryParams:building})
  }
  onBack() {
    this.location.back()
  }

  onAddBuilding() {
    // this.dataService.openDialog(BuildingComponent,null)
    this.dialog.open(BuildingComponent, { data: { hosingId: this.hosingId }, width: '90%', height: '80%' })
  }

}
