import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { pinyin } from 'pinyin-pro';
import { LocalStorgeService } from '../../services/local-storge.service';

const iconClear = `<svg t="1685117430288" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5533" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M958.358489 152.199401l-89.399099-89.430822L511.17368 420.522566 153.388994 62.768579 63.988872 152.199401l357.785709 357.753987L63.988872 867.708398l89.400123 89.430822L511.17368 599.38421l357.785709 357.753987 89.399099-89.430822L600.573803 509.953388 958.358489 152.199401z" fill="#666666" p-id="5534"></path></svg>`

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})

export class FilterComponent {

  @Input() data: any[] = [];

  @Input() fields:string[]=[];

  @Input() localKey:string

  @Output() result = new EventEmitter()
  @Output() value = new EventEmitter()

  clearIcon = 'clearIcon'

  private _filterValue: string;
  public get filterValue(): string {
    return this._filterValue;
  }
  public set filterValue(value: string) {
    this._filterValue = value;
    this.localStorage.set('filterXq', value)
    this.value.emit(value)
    this.result.emit(this.filter(this.getFilterData(), this.filterValue))
  }

  constructor(
    private localStorage: LocalStorgeService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconLiteral(
      'clearIcon',
      sanitizer.bypassSecurityTrustHtml(iconClear)
    );
  }

  ngOnInit() {
    if (this.localStorage.get('filterXq')) {
      this.filterValue = this.localStorage.get('filterXq')
    }
  }

  ngOnChanges() {
    this.result.emit(this.filter(this.getFilterData(), this.filterValue))
  }

  private filter(arr: any[], val: string): any[] {
    if (!val || val == '') return arr;
    return arr.filter((item) => {
      const vals = val.split(' ');
      let res = false;

        if(typeof(v)=='string'){
          for (let i = 0; i < vals.length; i++) {
            const val = vals[i];
            res =
              res ||
              v?.indexOf(val) >= 0 ||
              this.getFirstPy(v)?.indexOf(val) >= 0 ||
              this.getPy(v)?.indexOf(val) >= 0
          }
        }
        console.log(res)
      })
      return res
    });
  }

  private getFilterData(){
    if(this.fields.length == 0){
      return this.data
    }else{
      console.log(this.fields)
      return this.data.map(val=> this.fields.reduce((acc, prop) => ({ ...acc, [prop]: val[prop] }), {}))
    }
  }

  onClear() {
    this.filterValue = '';
  }

  private getFirstPy(hanzi: string) {
    if(hanzi)
      return pinyin(hanzi, { pattern: 'first', toneType: 'none', type: 'array' }).join('')
    return '';
  }

  private getPy(hanzi: string) {
    if(hanzi)
      return pinyin(hanzi, { pattern: 'pinyin', toneType: 'none', type: 'array' }).join('')
    return ''
  }
}

