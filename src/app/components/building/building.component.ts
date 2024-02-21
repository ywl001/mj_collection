import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { config } from 'rxjs';
import { NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SqlService } from '../../services/sql.service';
import { DataService, MessageType } from '../../services/data.service';
import { TableName } from '../../app-type';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatButtonModule, MatCheckboxModule, MatInputModule, NgIf, MatDialogModule],
  templateUrl: './building.component.html',
  styleUrl: './building.component.scss'
})
export class BuildingComponent {

  isNormal: boolean = true;

  data: any = {};

  countUint

  countHome

  unitArray = ''

  hosingId

  constructor(private sql: SqlService,
    private dataService:DataService,
    private dialog:MatDialogRef<BuildingComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,) {
    this.hosingId = data.hosingId
  }

  onSubmit() {
    if (!this.data.id) {
      // this.data.hosing_id = this.h
      const tableData = Object.assign({}, this.data, { unit_home: this.getUnitData(), hosing_id: this.hosingId })
      console.log(tableData)
      this.sql.insert(TableName.collect_building, tableData).subscribe(res => {
        console.log(res);
        this.dataService.sendMessage(MessageType.addBuilding);
        this.dialog.close();
      })
    }
  }

  private getUnitData() {
    if (this.isNormal) {
      return JSON.stringify(Array(this.countUint).fill(this.countHome))
    } else {
      const arr = this.unitArray.trim().replace(/ +/g, ' ').split(' ');
      return JSON.stringify(arr)
    }
  }

  private checkData() {
    if (!this.data.building_number || this.data.building_number.length == 0) {
      return false;
    }
    if (!this.isPositiveInteger(this.countUint)) {
      //单元数或单元户数必须正整数
      return false;
    }
    if (!this.isNormal) {
      const arr = this.unitArray.trim().replace(/ +/g, ' ').split(' ');
      if (arr.length != this.countUint) {
        //输入的数量和单元数量不符
        return false;
      }
      if (this.isNumericArray(arr)) {
        // 单元必须纯数字
        return false;
      }
    } else {
      if (!this.isPositiveInteger(this.countHome)) {
        //单元数或单元户数必须正整数
        return false;
      }
    }
    return true;
  }

  //是否纯数字的数组
  private isNumericArray(arr) {
    return arr.every(function (element) {
      // 使用isNaN检查是否为数字
      return !isNaN(element);
    });
  }

  private isPositiveInteger(str) {
    // 使用正则表达式匹配纯数字且大于0
    return /^\d+$/.test(str) && parseInt(str, 10) > 0;
  }

  onChange(e) {
    this.isNormal = !e.checked
  }
}
