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

  @Output() result = new EventEmitter()

  clearIcon = 'clearIcon'


  private _filterValue: string;
  public get filterValue(): string {
    return this._filterValue;
  }
  public set filterValue(value: string) {
    this._filterValue = value;
    this.localStorage.set('filterXq', value)
    this.result.emit(this.filter(this.data, this.filterValue))
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
    this.result.emit(this.filter(this.data, this.filterValue))
  }

  private filter(arr: any[], val: string): any[] {
    if (!val || val == '') return arr;
    return arr.filter((item) => {
      if (!item.hosing_name)
        return false;

      const vals = val.split(' ');

      const xq = item.hosing_name;
      const xqPyFirst = this.getFirstPy(xq)
      const xqPy = this.getPy(xq)

      const pcs = item.station
      const pcsPyFirst = this.getFirstPy(pcs)
      const pcsPy = this.getPy(pcs)

      let res: boolean;
      for (let i = 0; i < vals.length; i++) {
        const val = vals[i];
        res =
          res ||
          xq.indexOf(val) >= 0 ||
          xqPyFirst.indexOf(val) >= 0 ||
          xqPy.indexOf(val) >= 0 ||
          pcs.indexOf(val) >= 0 ||
          pcsPyFirst.indexOf(val) >= 0 ||
          pcsPy.indexOf(val) >= 0
      }

      return res
    });
  }

  onClear() {
    this.filterValue = '';
  }

  private getFirstPy(hanzi: string) {
    return pinyin(hanzi, { pattern: 'first', toneType: 'none', type: 'array' }).join('')
  }

  private getPy(hanzi: string) {
    return pinyin(hanzi, { pattern: 'pinyin', toneType: 'none', type: 'array' }).join('')
  }
}

