import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import toastr from 'toastr';
import { TableName } from '../../app-type';
import { DataService, MessageType } from '../../services/data.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-hosing',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    NgIf, NgFor,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule],
  templateUrl: './xiaoqu.component.html',
  styleUrl: './xiaoqu.component.scss'
})
export class XiaoquComponent {
  data: any = {};

  constructor(private dbService: DbService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<XiaoquComponent>,
    // private dialog:MatDialog,
    private dataService: DataService) {
    // console.log(data)
    if (data)
      this.data = data;
  }

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
    console.log(this.data)
    if(!this.data.hosing_name || this.data.hosing_name.trim()==''){
      toastr.warning('小区名字必须填写')
      return;
    }
    if (!this.data.id) {
      this.dbService.insert('collect_hosing', this.data).subscribe(res => {
        if(res>0){
          toastr.success('添加成功');
          this.dataService.sendMessage(MessageType.addHosing);
        }else{
          toastr.error('添加失败，小区名字必须填写');
        }
        this.dialogRef.close()
      })
    } else {
      this.dbService.update(TableName.collect_hosing, this.data, this.data.id).subscribe(res => {
        // this.dataService.sendMessage(MessageType.closeDialog)
        this.dialogRef.close()
      })
    }
  }
}
