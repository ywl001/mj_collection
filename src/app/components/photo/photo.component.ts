import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Building } from '../../app-type';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss'
})
export class PhotoComponent {
  src: string = ''

  constructor(@Inject(MAT_DIALOG_DATA) data: string,) {
    this.src = data;
  }
}
