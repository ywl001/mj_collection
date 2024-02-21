import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {MatFormFieldModule} from '@angular/material/form-field';
// import * as IDValidator from 'id-validator';
import toastr from 'toastr';
// import * as pinyin from 'pinyin';
import { SqlService } from '../../services/sql.service';
import { People } from '../../Person';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';

const iconClear = `<svg t="1685117430288" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5533" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M958.358489 152.199401l-89.399099-89.430822L511.17368 420.522566 153.388994 62.768579 63.988872 152.199401l357.785709 357.753987L63.988872 867.708398l89.400123 89.430822L511.17368 599.38421l357.785709 357.753987 89.399099-89.430822L600.573803 509.953388 958.358489 152.199401z" fill="#666666" p-id="5534"></path></svg>`
const iconClear_over = `<svg t="1685117430288" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5533" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M958.358489 152.199401l-89.399099-89.430822L511.17368 420.522566 153.388994 62.768579 63.988872 152.199401l357.785709 357.753987L63.988872 867.708398l89.400123 89.430822L511.17368 599.38421l357.785709 357.753987 89.399099-89.430822L600.573803 509.953388 958.358489 152.199401z" fill="#d4237a" p-id="5534"></path></svg>`
const iconClear2 = `<svg t="1694485031057" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4032" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M512 32C246.4 32 32 246.4 32 512s214.4 480 480 480 480-214.4 480-480S777.6 32 512 32z m140.8 579.2c12.8 12.8 12.8 32 0 41.6-12.8 12.8-32 12.8-41.6 0L512 553.6l-99.2 99.2c-12.8 12.8-32 12.8-41.6 0s-12.8-32 0-41.6l99.2-99.2-99.2-99.2c-12.8-12.8-12.8-32 0-41.6 12.8-12.8 32-12.8 41.6 0l99.2 99.2 99.2-99.2c12.8-12.8 32-12.8 41.6 0 12.8 12.8 12.8 32 0 41.6L553.6 512l99.2 99.2z" p-id="4033" fill="#bfbfbf"></path></svg>`

const enum IconName {
  clear = 'iconCleat',
  clearOver = 'iconClearOver',
  clear2 = 'aa'
}

const enum InputType {
  pid = 1,
  name = 2
}

declare var IDValidator;

@Component({
  selector: 'app-search',
  standalone:true,
  imports:[MatIconModule,FormsModule,MatFormFieldModule,NgIf,MatInputModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  // iconPeople = 'iconPeople';
  // iconLocation = 'iconLocation'

  private _keyword: string='姚伟立';
  public get keyword(): string {
    return this._keyword;
  }
  public set keyword(value: string) {
    this._keyword = value;
    this.isShowBtnClear = value.length > 2;
    if(value.length == 18 ){
      if(!People.isPid(value)){
        toastr.error('输入的身份证号有误')
      }
    }
  }

  iconClear = IconName.clear;
  iconClear2 = IconName.clear2;

  isHomophone = false;

  /**是否显示清除按钮 */
  isShowBtnClear = false;


  historys: string[] = [];

  label: string = '';

  @Output() peoples: EventEmitter<People[]> = new EventEmitter();

  constructor(sanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry,
    private cdr: ChangeDetectorRef,
    private sql: SqlService) {
    this.regiteIcon(sanitizer, iconRegistry);
  }

  ngOnInit() {
    toastr.options.positionClass = 'toast-bottom-center'
  }

  onSumbit() {
    let keyword = this.keyword.trim();

    if (keyword.length < 2) {
      toastr.info('至少输入两个以上字符');
      return;
    }

    this.saveSearchKeyword(keyword)

    let data: any = {};
    let p: People = new People();

    if (People.isChinese(keyword)) {
      console.log('汉字')
      data.inputType = InputType.name
      p.name = keyword;
    } else if (People.isPid(keyword)) {
      console.log('身份证号')
      data.inputType = InputType.pid
      p.pid = keyword;
    }

    data.input = keyword;
    console.log(data.inputType)
    if(data.inputType){
      this.sql.getPeople(data).subscribe(
        res => {
          res.push(p)
          this.peoples.emit(res);
          this.keyword=''
        }
      )
    }else{
      this.peoples.emit([])
    }
  }

  private saveSearchKeyword(keyword: string) {
    if (this.historys.findIndex(v => v == keyword) == -1) {
      this.historys.unshift(keyword);
      this.historys.length = 2;
    }
  }

  onclickBtnClear() {
    this.keyword = '';
  }

  onRemoveHistoryItme(option: string) {
    const index = this.historys.indexOf(option);
    this.historys.splice(index, 1);
  }

  private regiteIcon(sanitizer: DomSanitizer, iconRegistry: MatIconRegistry) {

    iconRegistry.addSvgIconLiteral(
      IconName.clear,
      sanitizer.bypassSecurityTrustHtml(iconClear)
    );

    iconRegistry.addSvgIconLiteral(
      IconName.clearOver,
      sanitizer.bypassSecurityTrustHtml(iconClear_over)
    );

    iconRegistry.addSvgIconLiteral(
      IconName.clear2,
      sanitizer.bypassSecurityTrustHtml(iconClear2)
    );
  }
}
