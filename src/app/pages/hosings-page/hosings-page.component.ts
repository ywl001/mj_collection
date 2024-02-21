import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { interval, of } from 'rxjs';
import { DataService, MessageType } from '../../services/data.service';
import { SqlService } from '../../services/sql.service';
import { MatButtonModule } from '@angular/material/button';
import { HosingComponent } from '../../components/hosing/hosing.component';
import { MatDialog } from '@angular/material/dialog';
import { GVar } from '../../global-variables';
import { User } from '../../User';

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
    private dialog: MatDialog,
    private sql: SqlService,
    private router: Router) {
      console.log(User.real_name)
      if(!User.id){
        this.router.navigate([''])
      }
  }

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
    GVar.current_hosing = hosing;
    this.router.navigate(['/buildings'], { queryParams: { hosing_id: hosing.id } })
  }

  onAddHosing() {
    // this.dataService.openDialog(HosingComponent, null)
    this.dialog.open(HosingComponent, null)
  }

  onEditHosing(hosing) {
    console.log(hosing)
    this.dialog.open(HosingComponent, { data: hosing })
    // this.dataService.openDialog(HosingComponent, hosing)
  }
}