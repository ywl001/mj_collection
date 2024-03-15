import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-qcode',
  standalone: true,
  imports:[QRCodeModule],
  templateUrl: './qcode.component.html',
  styleUrl: './qcode.component.scss'
})
export class QcodeComponent {

  qrdata:string = 'aaaaaaaaa'
  xiaoquName:string = ''

  constructor(@Inject(MAT_DIALOG_DATA) data){
    this.qrdata = data.url;
    this.xiaoquName = data.name;
  }
}
