import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { config } from 'rxjs';
import { NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DataService, MessageType } from '../../services/data.service';
import { Building, TableName } from '../../app-type';
import toastr from 'toastr'
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatDialogModule],
  templateUrl: './building.component.html',
  styleUrl: './building.component.scss'
})
export class BuildingComponent {

  isNormal: boolean = true;

  data: Building = {};

  //单元数
  countUint

  //每单元户数
  countHome

  //单元数组
  unitArray = ''

  hosingId

  constructor(private dbService: DbService,
    private dataService: DataService,
    private dialog: MatDialogRef<BuildingComponent>,
    @Inject(MAT_DIALOG_DATA) data: Building,) {
    this.hosingId = data?.hosingId
    this.data.floor = data?.floor;
    this.data.building_number = data?.building_number
    if (data.unit_home) {
      if (this.areAllElementsEqual(data.unit_home)) {
        this.isNormal = true;
        this.countUint = data.unit_home.length;
        this.countHome = data.unit_home[0]
      } else {
        this.isNormal = false;
        this.unitArray = data.unit_home.join(' ')
        console.log(this.unitArray)
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
        this.dbService.insert(TableName.collect_building, tableData).subscribe(res => {
          console.log(res);
          this.dataService.sendMessage(MessageType.addBuilding);
          this.dialog.close();
        })
      } else {
        const tableData = Object.assign({}, this.data, { unit_home: this.getUnitData() })
        this.dbService.update(TableName.collect_building, tableData, this.data.id).subscribe(res => {
          console.log(res)
          if (res) {
            this.dataService.sendMessage(MessageType.editBuilding);
            toastr.info('编辑楼栋成功')
          }
          this.dialog.close();
        })
      }
    }
  }

  private getUnitData() {
    if (this.isNormal) {
      return JSON.stringify(Array(this.countUint).fill(this.countHome))
    } else {
      return JSON.stringify(this.unitToArray())
    }
  }

  private checkData() {
    if (!this.data.building_number || this.data.building_number.length == 0) {
      toastr.warning('楼号必须填写')
      return false;
    }
    if (!this.data.floor || !this.isPositiveInteger(this.data.floor)) {
      //单元数或单元户数必须正整数
      toastr.warning('楼层数必须正整数')
      return false;
    }
    if (!this.isNormal) {
      const arr = this.unitToArray()
      console.log(arr)
      if (!this.unitArray || !this.isNumericArray(arr)) {
        toastr.warning('单元必须纯数字')
        return false;
      }
    } else {
      if (!this.countHome || !this.isPositiveInteger(this.countHome)) {
        //单元数或单元户数必须正整数
        toastr.warning('每单元每层户数必须是正整数')
        return false;
      }
      if (!this.countUint || !this.isPositiveInteger(this.countUint)) {
        toastr.warning('单元数必须是正整数')
        return false;
      }
    }
    return true;
  }

  private unitToArray() {
    //转成数组前去除两端空格，如果中间有两个空格变成一个空格，然后按空格分割成数组
    return this.unitArray.trim().replace(/ +/g, ' ').split(' ').map(v => parseInt(v));
  }

  //是否纯数字的数组
  private isNumericArray(arr: any[]) {
    return arr.every(element => {
      console.log(element, !isNaN(element))
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
