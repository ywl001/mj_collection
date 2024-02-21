import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HosingsPageComponent } from './hosings-page/hosings-page.component';
import { NgFor, NgIf } from '@angular/common';
import { DataService, MessageType } from './services/data.service';
import { of } from 'rxjs';
import { SqlService } from './services/sql.service';
import { BuildingComponent } from './building-page/building-page.component';
import { BuildingsPageComponent } from './buildings-page/buildings-page.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';


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

  private dialogRef

  constructor(private dataService: DataService,
    public dialog: Dialog,
    private sql: SqlService) { }

  ngOnInit() {
    // this.getHosings()

  //   this.dataService.openDialog$.subscribe((res: any) => {
  //     console.log(res)
  //     this.dialogRef = this.dialog.open(res.component, {data:res.data});
  //     this.dialogRef.componentInstance.data = res.data;
  //   })

  //   this.dataService.message$.subscribe(res=>{
  //     if(res== MessageType.closeDialog){
  //       this.dialogRef.close();
  //     }
  //   })
  }
}
