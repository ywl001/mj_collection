import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HosingsPageComponent } from './pages/hosings-page/hosings-page.component';
import { NgFor, NgIf } from '@angular/common';
import { DataService, MessageType } from './services/data.service';
import { of } from 'rxjs';
import { SqlService } from './services/sql.service';
import { BuildingComponent } from './pages/building-page/building-page.component';
import { BuildingsPageComponent } from './pages/buildings-page/buildings-page.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { User } from './User';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatButtonModule,
    MatDialogModule,
    HosingsPageComponent,
    NgIf, NgFor,
    BuildingsPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mj_collection';

  userName=''

  constructor(private dataService: DataService,
    private router:Router,
    private sql: SqlService) { 
    }

  ngOnInit() {
    this.dataService.message$.subscribe(res=>{
      if(res== MessageType.getUserInfo){
        this.userName = User.real_name.substring(0,1)
      }
    })
  }

  onGetUserWork(){
      this.router.navigate(['/userwork'])
  }
}
