import { NgFor, NgIf } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SqlService } from '../services/sql.service';
import { DataService, MessageType } from '../services/data.service';
import { Dialog } from '@angular/cdk/dialog';
// import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-hosing',
  standalone: true,
  imports: [MatFormFieldModule,
    FormsModule,
    NgIf, NgFor,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatAutocompleteModule],
  templateUrl: './hosing.component.html',
  styleUrl: './hosing.component.scss'
})
export class HosingComponent {
  data: any = {};

  constructor(private sql: SqlService,
    private injector: Injector,
    private dataService: DataService) { }

  policeStations = [
    '城关派出所',
    '吉利派出所',
    '河阳派出所',
    '会盟派出所',
    '横水派出所',
    '常袋派出所',
    '朝阳派出所',
    '平乐派出所',
    '送庄派出所',
    '白鹤派出所',
    '麻屯派出所',
    '小浪底派出所'
  ]

  onSubmit() {
    this.sql.insert('collect_hosing', this.data).subscribe(res => {
      this.dataService.sendMessage(MessageType.addHosing);
      // this.dialogRef.close()
      const dialogRef = this.injector.get(MatDialogRef, null);
      dialogRef.close()
    })
  }

  onCancel() {
    const dialogRef = this.injector.get(MatDialogRef, null);
      dialogRef.close()
  }
}
