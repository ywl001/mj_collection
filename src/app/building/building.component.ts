import { Component, Input } from '@angular/core';
import { Building } from '../building';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [MatExpansionModule, NgFor],
  templateUrl: './building.component.html',
  styleUrl: './building.component.scss'
})
export class BuildingComponent {

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

}
