import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { interval, of } from 'rxjs';
import { DataService, MessageType } from '../services/data.service';
import { SqlService } from '../services/sql.service';
import { MatButtonModule } from '@angular/material/button';
import { HosingComponent } from '../hosing/hosing.component';

@Component({
  selector: 'app-hosings',
  standalone: true,
  imports: [NgFor, MatButtonModule],
  templateUrl: './hosings-page.component.html',
  styleUrl: './hosings-page.component.scss'
})
export class HosingsPageComponent {

  hosings: any[] = []

  @Output()
  buildings = new EventEmitter()

  constructor(private dataService: DataService, private sql: SqlService, private router: Router) { }

  ngOnInit() {
    this.getAllHosing();
    this.dataService.message$.subscribe(res => {
      if (res == MessageType.addHosing) {
        this.getAllHosing();
      }
    })
  }

  private getAllHosing() {
    this.sql.getAllHosing().subscribe(res => {
      this.hosings = res
    })
  }

  onSelectHosing(hosing: string) {
    this.sql.getHosingBuildings(hosing).subscribe(res => {
      //导航
      console.log(res)
      this.dataService.setRouteData('buildings', res)
      this.router.navigate(['/buildings'])
    })
  }

  onAddHosing() {
    this.dataService.openDialog(HosingComponent, null)
  }
}
