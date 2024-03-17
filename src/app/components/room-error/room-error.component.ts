import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { mergeMap } from 'rxjs';
import { Work, TableName } from '../../app-type';
import { DbService } from '../../services/db.service';
import { GlobalService } from '../../global.service';


@Component({
  selector: 'app-room-error',
  standalone: true,
  imports: [MatRadioModule,FormsModule,NgFor,MatButtonModule,MatDialogModule],
  templateUrl: './room-error.component.html',
  styleUrl: './room-error.component.scss'
})
export class RoomErrorComponent {

  result_message='不在家'

  error_reasons = [
    '不在家','空房子','不配合'
  ]

  private building_id
  private room_number;
  constructor(private sql:DbService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private gs:GlobalService,
    private dialogRef:MatDialogRef<RoomErrorComponent>){
      this.building_id = data.building_id;
      this.room_number = data.room_number
  }

  onSubmit(){
    this.insertOrUpdateWork().subscribe(res=>{
      this.dialogRef.close();
    })
  }

  private insertOrUpdateWork() {
    return this.sql.getRoomWorkIsExists(this.building_id, this.room_number).pipe(
      mergeMap(id => {
        if (id > 0) {
          return this.updateWork(id)
        } else {
          return this.insertWork()
        }
      })
    )
  }

  private insertWork() {
    const tableData: Work = {
      building_id: this.building_id,
      room_number: this.room_number,
      result_message: this.result_message,
      result: 0,
      user_id: this.gs.user.id
    }
    return this.sql.insert(TableName.collect_work, tableData)
  }

  private updateWork(id) {
    const tableData: Work = {
      result_message: this.result_message,
      result: 0,
      user_id: this.gs.user.id
    }
    return this.sql.update(TableName.collect_work, tableData, id)
  }
}
