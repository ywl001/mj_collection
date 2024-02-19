import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HosingsComponent } from './hosings/hosings.component';
import { NgFor, NgIf } from '@angular/common';
import { DataService } from './services/data.service';
import { of } from 'rxjs';
import { SqlService } from './services/sql.service';
import { BuildingComponent } from './building/building.component';

export enum AppState {
  'xiaoqu', 'building','home'
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, HosingsComponent, NgIf,NgFor,BuildingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mj_collection';

  appState: AppState = AppState.xiaoqu

  hosings=[]
  buildings = []

  constructor(private dataService: DataService,private sql:SqlService) { }

  ngOnInit() {
   this.getHosings()
  }

  private getHosings(){
    this.sql.getAllHosing().subscribe(res=>{
      this.hosings = res;
    })
  }

  onSelectHosing(hosing:string){
    console.log(hosing)
    this.sql.getHosingBuildings(hosing).subscribe(res=>{
      this.buildings = res;
      this.appState = AppState.building
    })
  }

  onSelectBuilding(building){
    console.log(building.floor,building.unit_home)
  }

  onBack(){
    if(this.appState == AppState.building){
      this.appState = AppState.xiaoqu
      this.getHosings()
    }
  }

}
