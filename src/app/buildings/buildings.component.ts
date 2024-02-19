import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [NgFor,MatButtonModule],
  templateUrl: './buildings.component.html',
  styleUrl: './buildings.component.scss'
})
export class BuildingsComponent {

  buildings=[]
  constructor(dataService:DataService) {
   this.buildings = dataService.getSharedData()
  }

  onSelectBuilding(building: any) {

  }
  onBack() {

  }

}
