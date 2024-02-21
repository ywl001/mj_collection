import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { People } from '../../Person';
import { SqlService } from '../../services/sql.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { NgFor } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableName } from '../../app-type';

@Component({
  selector: 'app-edit-person',
  standalone: true,
  imports: [FormsModule,MatFormFieldModule,MatButtonModule,MatInputModule,MatDialogModule,MatRadioModule,NgFor,MatCheckboxModule],
  templateUrl: './edit-person.component.html',
  styleUrl: './edit-person.component.scss'
})
export class EditPersonComponent {

  residence_types=[
    '自住','租住','经商','其他',
  ]

  residence_type:string = '自住';

  person:People

  is_host:boolean = false;

  constructor(private sql:SqlService,@Inject(MAT_DIALOG_DATA) data: any,
  private dialogRef:MatDialogRef<EditPersonComponent>){
    this.person = data;
  }

  onSubmit(){
    const tableData={
      telephone:this.person.telephone,
      work_place:this.person.work_place
    }
    this.sql.update(TableName.people,tableData,this.person.id).subscribe(res=>{
      this.dialogRef.close();
    })
  }

  checkPersonChange(){
    
  }
}
