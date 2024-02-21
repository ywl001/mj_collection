import { Component, Input, input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { People } from '../../../Person';
import { EditPersonComponent } from '../../../components/edit-person/edit-person.component';
import { SelectHomePersonsComponent } from '../../../components/select-home-persons/select-home-persons.component';
import { SqlService } from '../../../services/sql.service';

@Component({
  selector: 'app-home-person',
  standalone: true,
  imports: [],
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

  constructor(private dialog:MatDialog,private sql:SqlService){}

  onEditPerson(){
    this.dialog.open(EditPersonComponent,{data:this.person})
  }

  onGetHomePeoples(){
    this.sql.getHomePeoples(this.person.id).subscribe(res=>{
      console.log(res)
      this.dialog.open(SelectHomePersonsComponent,{data:res})
    })
  }
}
