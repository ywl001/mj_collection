import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { People } from '../../Person';
import { SqlService } from '../../services/sql.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgFor } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableName } from '../../app-type';
import copy from 'fast-copy';
import toastr from 'toastr'

@Component({
  selector: 'app-edit-person',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatDialogModule, MatRadioModule, NgFor, MatCheckboxModule],
  templateUrl: './edit-person.component.html',
  styleUrl: './edit-person.component.scss'
})
export class EditPersonComponent {



  person: People

  is_host = false;
  is_huji = true;

  oldData;

  constructor(private sql: SqlService, @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<EditPersonComponent>) {
    this.person = data;
    this.is_host = this.person.is_host == 1
    this.is_huji = this.person.is_huji == 1

    this.oldData = copy(data);
  }

  onSubmit() {
    if (this.isPersonChange()) {
      const tableData = {
        telephone: this.person.telephone,
        work_place: this.person.work_place
      }
      this.sql.update(TableName.people, tableData, this.person.id).subscribe(res => {
        this.dialogRef.close();
        toastr.success('更新成功')
      })
    }

    if (this.isPersonBuildingChange()) {
      const tableData = {
        is_huji: this.is_huji ? 1 : 0,
        is_host: this.is_host ? 1 : 0
      }
      this.sql.update(TableName.person_building, tableData, this.person.pb_id).subscribe(res => {
        this.dialogRef.close();
        this.person.is_host = this.is_host ? 1 : 0;
        this.person.is_huji = this.is_huji ? 1 : 0
        toastr.success('更新成功')
      })
    }
    this.dialogRef.close();
  }

  private isPersonChange() {
    if (this.person.telephone != this.oldData.telephone || this.person.work_place != this.oldData.work_place) {
      return true;
    }
    return false;
  }

  private isPersonBuildingChange() {
    if (this.is_host != this.oldData.is_host || this.is_huji != this.oldData.is_huji) {
      return true;
    }
    return false;
  }
}
