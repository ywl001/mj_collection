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
import toastr from 'toastr'

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
    private dataService: DataService,
    private dialog: MatDialogRef<BuildingComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,) {
    this.hosingId = data?.hosingId
    this.data.floor = data?.floor;
    this.data.building_number = data?.building_number
    if (data?.unit_home) {
      if (this.areAllElementsEqual(data.unit_home)) {
        this.countUint = data.unit_home.length;
        this.countHome = data.unit_home[0]
      } else {
        this.unitArray = data.unit_home
      }
    }
    if (data.id)
      this.data.id = data?.id
    // console.log(data)
    // this.data.floor = data.floor;
    // this.data.countUint = data.unit_home.length;

  }

  private areAllElementsEqual(array) {
    return array.every((element, index, arr) => element === arr[0]);
  }

  onSubmit() {
    if (this.checkData()) {
      if (!this.data.id) {
        // this.data.hosing_id = this.h
        const tableData = Object.assign({}, this.data, { unit_home: this.getUnitData(), hosing_id: this.hosingId })
        console.log(tableData)
        this.sql.insert(TableName.collect_building, tableData).subscribe(res => {
          console.log(res);
          this.dataService.sendMessage(MessageType.addBuilding);
          this.dialog.close();
        })
      } else {
        const tableData = Object.assign({}, this.data, { unit_home: this.getUnitData() })
        this.sql.update(TableName.collect_building, tableData, this.data.id).subscribe(res => {
          console.log(res);
          this.dataService.sendMessage(MessageType.editBuilding);
          this.dialog.close();
        })
      }
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
      toastr.warning('单元数或单元户数必须正整数')
      return false;
    }
    if (!this.isNormal) {
      const arr = this.unitArray.trim().replace(/ +/g, ' ').split(' ');
      if (this.isNumericArray(arr)) {
        // 单元必须纯数字
        toastr.warning('单元必须纯数字')
        return false;
      }
    } else {
      if (!this.isPositiveInteger(this.countHome)) {
        //单元数或单元户数必须正整数
        toastr.warning('单元数或单元户数必须正整数')
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
