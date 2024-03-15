import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { People } from '../../Person';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './people-list.component.html',
  styleUrl: './people-list.component.scss'
})
export class PeopleListComponent {
  peoples = []


  constructor(@Inject(MAT_DIALOG_DATA) data:any){
    this.peoples = data
  }

  onClick() {

  }

  onImgError(e) {
    e.target.src = 'assets/noPhoto.png'
  }

  getPhotoUrl(p) {
    if(!p.id){
      return 'assets/nopeople.png'
    }
    return People.serverImg + p.thumb_url;
  }

  getPeopleInfo(p:People){
    if(!p.id){
      return '添加人员'
    }
    if(p.name && p.pid)
      return `${p.name}-${p.pid.substring(6,14)}`
    else if(p.name){
      return p.name;
    }
    return '';
  }
}
