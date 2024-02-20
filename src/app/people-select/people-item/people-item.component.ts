import { Component, EventEmitter, Input, Output } from '@angular/core';
import { People } from '../../Person';
import { SqlService } from '../../services/sql.service';

@Component({
  selector: 'app-people-item',
  standalone:true,
  templateUrl: './people-item.component.html',
  styleUrls: ['./people-item.component.scss']
})
export class PeopleItemComponent {

  pInfo: string;

  private _data:People;

  imgUrl: string = 'assets/noPhoto.png'

  @Output() selectPeople:EventEmitter<People> = new EventEmitter();

  constructor(private sql: SqlService) { }

  @Input()
  set data(value: People) {
    this._data = value;
    if (value.thumb_url){
      this.imgUrl = People.serverImg + value.thumb_url;
      // console.log(this.imgUrl)
    }
    else {
      this.imgUrl = 'assets/noPhoto.png'
    }
    if (!value.id) {
      this.imgUrl = 'assets/nopeople.png';
      this.pInfo = '添加人员'
    } else {
      this.pInfo = value.name + '-' + value?.pid.substring(6, 10);
    }
  }
  
  onClick(){
      this.selectPeople.emit(this._data)
  }

  onImgError(e) {
    e.target.src = 'assets/noPhoto.png'
  }
}
