import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { interval, of } from 'rxjs';
import { DataService } from '../services/data.service';
import { SqlService } from '../services/sql.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hosings',
  standalone: true,
  imports: [NgFor,MatButtonModule],
  templateUrl: './hosings.component.html',
  styleUrl: './hosings.component.scss'
})
export class HosingsComponent {

  hosings:string[] = []

  @Output()
  buildings = new EventEmitter()

  constructor(private dataService: DataService,private sql:SqlService,private router: Router) {}

  ngOnInit(){
    this.sql.getAllHosing().subscribe(res=>{
      this.hosings = res
    })
  }

  onSelectHosing(hosing:string){
    this.sql.getHosingBuildings(hosing).subscribe(res=>{
      //导航
      console.log(res)
      const serializedArray = JSON.stringify(res);
      this.dataService.setSharedData(res)
      this.router.navigate(['/buildings'])
    })
  }
}
