import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { interval, of } from 'rxjs';
import { DataService, MessageType } from '../services/data.service';
import { SqlService } from '../services/sql.service';
import { MatButtonModule } from '@angular/material/button';
import { HosingComponent } from '../hosing/hosing.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private dataService: DataService,
    private dialog:MatDialog,
     private sql: SqlService, 
     private router: Router) { }

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

  onSelectHosing(hosing: any) {
    console.log(hosing)
    this.router.navigate(['/buildings'],{queryParams:{hosingId:hosing.id}})
  }

  onAddHosing() {
    // this.dataService.openDialog(HosingComponent, null)
    this.dialog.open(HosingComponent,null)
  }

  onEditHosing(hosing){
    console.log(hosing)
    this.dialog.open(HosingComponent,{data:hosing})
    // this.dataService.openDialog(HosingComponent, hosing)
  }
}
