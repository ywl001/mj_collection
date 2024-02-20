import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [NgFor, MatButtonModule],
  templateUrl: './buildings-page.component.html',
  styleUrl: './buildings-page.component.scss'
})
export class BuildingsPageComponent {

  buildings = []
  constructor(private dataService: DataService, private router: Router, private location: Location) {
    console.log('buildings construstor')
    this.buildings = dataService.getRouteData('buildings')
  }

  onSelectBuilding(building: any) {
    console.log(building.floor, building.unit_home)
    this.dataService.setRouteData('building',building)
    this.router.navigate(['building'])
  }
  onBack() {
    this.location.back()
  }

}
