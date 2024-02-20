import { Component, Input, input } from '@angular/core';
import { People } from '../../Person';

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

}
