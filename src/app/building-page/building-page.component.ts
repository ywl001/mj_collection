import { Component, Input } from '@angular/core';
import { Building } from '../building';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgFor } from '@angular/common';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [MatExpansionModule, NgFor,MatButtonModule],
  templateUrl: './building-page.component.html',
  styleUrl: './building-page.component.scss'
})
export class BuildingComponent {

  constructor(private dataService: DataService, private router: Router,private location:Location) {
    this.building = dataService.getRouteData('building')
  }

  @Input()
  building: Building = {
    building_number: '1',
    floor: 6,
    unit_home: [2, 3, 2, 2]
  }

  unitRoomNumbers = [];

  private numToArray(num) {
    return Array(num).fill(0).map((x, i) => i + 1);
  }

  onClickUnit(unit) {
    console.log(unit)
    this.unitRoomNumbers = this.createUnitArray(unit)
  }

  private createUnitArray(unit) {
    const countHome = this.building.unit_home[unit];
    let arr = [];
    for (let i = 0; i < this.building.floor; i++) {
      for (let j = 0; j < countHome; j++) {
        // console.log(`${unit + 1}-${i + 1}0${j + 1}`)
        const roomNumber = `${unit + 1}-${i + 1}0${j + 1}`;
        arr.push(roomNumber)
      }
    }
    return arr;
  }

  onBack(){
    this.location.back()
  }

  onClickRoom(room){
    
    console.log(room)
    this.router.navigate(['person'])
    
  }

}
