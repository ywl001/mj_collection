import { ChangeDetectorRef, Component, Input, input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { People } from '../../../Person';
import { EditPersonComponent } from '../../../components/edit-person/edit-person.component';
import { SelectHomePersonsComponent } from '../../../components/select-home-persons/select-home-persons.component';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TableName } from '../../../app-type';
import { DataService, MessageType } from '../../../services/data.service';
import { GVar } from '../../../global-variables';
import { DbService } from '../../../services/db.service';

@Component({
  selector: 'app-home-person',
  standalone: true,
  imports: [SweetAlert2Module],
  templateUrl: './home-person.component.html',
  styleUrl: './home-person.component.scss'
})
export class HomePersonComponent {

  imgUrl: string = 'assets/noPhoto.png'

  private _person: People = new People();
  public get person(): People {
    return this._person;
  }

  @Input()
  public set person(value: People) {
    this._person = value;

    if (value.thumb_url){
      this.imgUrl = People.serverImg + value.thumb_url;
    }
    else {
      this.imgUrl = 'assets/noPhoto.png'
    }
  }

  getBgColor(){
    if(this.person.is_host){
      return 'PaleGreen'
    }
    return null;
  }

  constructor(private dialog:MatDialog,
    private cdr:ChangeDetectorRef,
    // private sql:SqlService,
    private dbService:DbService,
    private dataService:DataService){}

  onEditPerson(){
    this.dialog.open(EditPersonComponent,{data:this.person})
  }

  onGetHomePeoples(){
    GVar.homePeopleHost = this.person
    this.dbService.getHomePeoples(this.person.id).subscribe(res=>{
      console.log(res)
      this.dialog.open(SelectHomePersonsComponent,{data:res})
    })
  }

  onDelPerson(){
    Swal.fire({
      title: "确定要删除吗?",
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText:'取消'
    }).then((result) => {
      if (result.isConfirmed) {
        //删除人员
        console.log(this.person.pb_id)
        this.dbService.delete(TableName.person_building,this.person.pb_id).subscribe(res=>{
          console.log(res)
          this.dataService.deleteBuildingPerson(this.person.id)
        })
      } 
    });
  }

  onSetHomeHost(){
    const tableData={is_host:1}
    this.dbService.update(TableName.person_building,tableData,this.person.pb_id).subscribe(res=>{
      this.person.is_host = 1
      console.log('房主ok')
    })
  }
}
