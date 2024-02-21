import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, MessageType } from '../services/data.service';
import { Location } from '@angular/common';
import { SqlService } from '../services/sql.service';
import { BuildingComponent } from '../building/building.component';
import { MatDialog } from '@angular/material/dialog';

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
  constructor(private dataService: DataService,
    private router: Router,
    private sql: SqlService,
    private dialog: MatDialog,
    private location: Location, rout: ActivatedRoute) {
    console.log('buildings construstor')
    // this.buildings = dataService.getRouteData('buildings')
    this.hosingId = rout.snapshot.queryParams['hosingId']
    console.log(this.hosingId)
  }

  ngOnInit(): void {
    this.getBuildings(this.hosingId);
    this.dataService.message$.subscribe(res => {
      if (res == MessageType.addBuilding) {
        this.getBuildings(this.hosingId);
      }
    })
  }

  private getBuildings(hosingId) {
    this.sql.getHosingBuildings(hosingId).subscribe(res => {
      this.buildings = res;
    })
  }

  onSelectBuilding(building: any) {
    console.log(building.floor, building.unit_home)
    // this.dataService.setRouteData('building', building)
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
