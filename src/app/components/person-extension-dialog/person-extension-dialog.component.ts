import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { People } from '../../Person';
import { DataService } from '../../services/data.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-person-extension-dialog',
  standalone: true,
  imports: [MatRadioModule,FormsModule,MatButtonModule],
  templateUrl: './person-extension-dialog.component.html',
  styleUrl: './person-extension-dialog.component.scss'
})
export class PersonExtensionDialogComponent {
  is_host = '1';
  is_huji = '1';

  data:People;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
  private dialogRef:MatDialogRef<PersonExtensionDialogComponent>,
  private dataService:DataService){
    this.data = data;
  }

  onSubmit(){
    this.data.is_host = parseInt(this.is_host);
    this.data.is_huji = parseInt(this.is_huji);

    console.log(this.data);

    this.dataService.personExtension(this.data)
    this.dialogRef.close();
  }
}
