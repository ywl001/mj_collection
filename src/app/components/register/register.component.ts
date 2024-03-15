import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { DialogRef } from '@angular/cdk/dialog';
import { TableName } from '../../app-type';
import toastr from 'toastr'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  data: any = {}

  constructor(private dbService: DbService, private dialogRef: DialogRef) {
  }

  onSubmit() {
    if (this.validate()) {
      this.dbService.insert(TableName.user, this.data).subscribe(res => {
        this.dialogRef.close();
        console.log(res)
        if (res > 0) {
          toastr.success('注册成功')
        } else {
          toastr.error('注册失败');
        }
      })
    }

  }

  private validate() {
    if (this.isEmpty(this.data.username)) {
      toastr.warning('用户名不能为空')
      return false;
    }
    if (this.isEmpty(this.data.password)) {
      toastr.warning('密码不能为空')
      return false;
    }
    if (this.isEmpty(this.data.real_name)) {
      toastr.warning('真实姓名不能为空')
      return false;
    }
    if (this.isEmpty(this.data.unit)) {
      toastr.warning('单位不能为空')
      return false;
    }
    return true;
  }

  private isEmpty(value: string) {
    if (!value || value.trim() == '') {
      return true;
    }
    return false;
  }
}
