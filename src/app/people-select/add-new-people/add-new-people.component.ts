import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import toastr from 'toastr';
import { People } from '../../Person';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import IDValidator from 'id-validator'
import { DbService } from '../../services/db.service';
import { TableName } from '../../app-type';
const randomIcon = `<svg t="1695112984643" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4022" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M488 72.896a48 48 0 0 1 43.456-2.304l4.544 2.304L880.256 271.68a48 48 0 0 1 23.776 36.928l0.224 4.64V710.72a48 48 0 0 1-20.096 39.04l-3.904 2.56-344.256 198.72a48 48 0 0 1-43.456 2.336l-4.544-2.304L143.744 752.32a48 48 0 0 1-23.776-36.928l-0.224-4.64V313.28c0-15.616 7.552-30.112 20.096-39.04l3.904-2.56L488 72.96z m-304.32 282.88l0.032 345.728L480 872.544V531.52l-4-6.944-292.288-168.8z m656.576 0l-292.288 168.768-3.968 6.88v341.12l296.256-171.04V355.776zM384 688.16c17.664 8.736 32 30.176 32 47.84 0 17.664-14.336 24.896-32 16.16-17.664-8.768-32-30.176-32-47.84 0-17.696 14.336-24.928 32-16.16z m384-63.872c17.664-8.64 32-1.376 32 16.32 0 17.664-14.336 39.04-32 47.68-17.664 8.672-32 1.376-32-16.288s14.336-39.04 32-47.68z m-512-0.128c17.664 8.736 32 30.176 32 47.84 0 17.664-14.336 24.896-32 16.16-17.664-8.768-32-30.176-32-47.84 0-17.696 14.336-24.928 32-16.16z m384-64c17.664-8.768 32-1.536 32 16.16 0 17.664-14.336 39.072-32 47.84-17.664 8.736-32 1.504-32-16.16s14.336-39.104 32-47.84z m-256-32c17.664 8.736 32 30.176 32 47.84 0 17.664-14.336 24.896-32 16.16-17.664-8.768-32-30.176-32-47.84 0-17.696 14.336-24.928 32-16.16z m-128-64c17.664 8.736 32 30.176 32 47.84 0 17.664-14.336 24.896-32 16.16-17.664-8.768-32-30.176-32-47.84 0-17.696 14.336-24.928 32-16.16z m256-331.232L218.848 302.144l293.12 169.28 293.12-169.28L512 132.928zM512 272c26.496 0 48 14.336 48 32s-21.504 32-48 32-48-14.336-48-32 21.504-32 48-32z" fill="#d4237a" p-id="4023"></path></svg>`


// declare var IDValidator;


@Component({
  selector: 'app-add-new-people',
  standalone: true,
  imports:[MatFormFieldModule,FormsModule,NgIf,MatCheckboxModule,MatInputModule,MatButtonModule],
  templateUrl: './add-new-people.component.html',
  styleUrls: ['./add-new-people.component.scss']
})
export class AddNewPeopleComponent {
  pName: string;
  pid: string;
  tel: string;

  private _isDead: boolean;
  public get isDead(): boolean {
    return this._isDead;
  }
  public set isDead(value: boolean) {
    this._isDead = value;
    this.isShowRandomIcon = value;
    if (this.isRandomPid()) {
      this.pid = ''
    }
  }

  isShowRandomIcon: boolean;

  @Output() cancelAddNew: EventEmitter<null> = new EventEmitter();
  @Output() addPeopleSuccess: EventEmitter<People> = new EventEmitter();


  @Input()
  set data(value: People) {
    if (value) {
      if (value.name) {
        this.pName = value.name
      } else if (value.pid) {
        this.pid = value.pid
      }
    }
  }

  constructor(sanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry, 
    private deService: DbService) {
    iconRegistry.addSvgIconLiteral(
      'random',
      sanitizer.bypassSecurityTrustHtml(randomIcon)
    );
  }

  onSubmit() {
    if (this.validate()) {
      let p = this.getData();
      this.deService.insert(TableName.people, p).subscribe(res => {
        console.log(res);
        if (res > 0) {
          p.id = res;
          p = People.toPeople(p)
          this.addPeopleSuccess.emit(p);
          toastr.success('人员添加成功')
        }else{
          toastr.error('人员插入失败,可能人员已经存在，请使用其他查询')
        }
      })
    }
  }

  onRandomPid() {
    const validator = new IDValidator();
    this.pid = validator.makeID();
  }

  onCancel() {
    this.cancelAddNew.emit();
  }

  private isRandomPid() {
    return this.pid?.substring(0, 8) == '41000018'
  }

  private getSex() {
    if (this.isRandomPid()) {
      return '男'
    }
    return Number(this.pid.substring(16, 17)) % 2 == 0 ? '女' : '男';
  }

  private validate() {
    if (!People.isChinese(this.pName)) {
      toastr.info('姓名应该是中文字符')
      return false;
    }
    if (this.pName?.length < 2) {
      toastr.info('姓名需要两个字以上')
      return false;
    }

    const validator = new IDValidator();
    if (!validator.isValid(this.pid)) {
      toastr.info('身份证号输入有误');
      return false;
    }
    return true;
  }


  private getData() {
    let data: any = {
      name: this.pName,
      pid: this.pid,
      sex: this.getSex(),
      is_dead: this.isDead ? 1 : 0
    };
    if(this.tel){
      data.telephone = this.tel;
    }
    return data;
  }
}
