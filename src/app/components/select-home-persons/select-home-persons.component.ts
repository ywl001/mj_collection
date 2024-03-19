import { NgFor } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-select-home-persons',
  standalone: true,
  imports: [MatListModule,NgFor,MatButtonModule,MatDialogModule],
  templateUrl: './select-home-persons.component.html',
  styleUrl: './select-home-persons.component.scss'
})
export class SelectHomePersonsComponent {
  homePeoples=[]

  @ViewChild(MatSelectionList) list:MatSelectionList

  constructor(@Inject(MAT_DIALOG_DATA) data: any,private dataService:DataService,private dialogRef:MatDialogRef<SelectHomePersonsComponent>){
    this.homePeoples = data
  }


  onSubmit(){
    const selectPersons = this.list.selectedOptions.selected.map(option => option.value);
    console.log('Selected Items:', selectPersons);
    this.dataService.selectPersons(selectPersons)
    this.dialogRef.close();
  }
}
