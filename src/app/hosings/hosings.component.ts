import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { interval, of } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-hosings',
  standalone: true,
  imports: [NgFor],
  templateUrl: './hosings.component.html',
  styleUrl: './hosings.component.scss'
})
export class HosingsComponent {

  hosings:string[] = ['紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区','紫金花园','河阳新村社区']

  @Output()
  buildings = new EventEmitter()

  constructor(private dataService: DataService) {}

  onSelectHosing(hosing:string){
    console.log(hosing)
    of(hosing).subscribe(res=>{
      this.buildings.emit(['1','2','3','5'])
      this.dataService.building(['1','2','3','5'])
    })
  }
}
