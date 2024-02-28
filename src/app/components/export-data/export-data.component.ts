import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, LOCALE_ID } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
// import 'moment/locale/zh';
import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
import { MatButtonModule } from '@angular/material/button';
import moment, { Moment } from 'moment';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import toastr from 'toastr'
import { DataService } from '../../services/data.service';

registerLocaleData(localeZh);

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
}

@Component({
  selector: 'app-export-data',
  standalone: true,
  imports: [MatRadioModule, NgFor, NgIf,
    MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatDialogModule,
    FormsModule, ReactiveFormsModule, MatNativeDateModule,],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'zh-Hans' },
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './export-data.component.html',
  styleUrl: './export-data.component.scss'
})

export class ExportDataComponent {

  dataTypes = [
    { label: '所有数据', value: 0 },
    { label: '当天数据', value: 1 },
    { label: '两天数据', value: 2 },
    { label: '三天数据', value: 3 },
    { label: '一周数据', value: 7 },
    { label: '自定义日期', value: -1 }
  ]

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  dataType = 0


  selectDate=new EventEmitter()

  constructor(private dataService:DataService,private dialogRef:MatDialogRef<ExportDataComponent>){}

  onChange() {

  }

  onSubmit() {
    const data = this.getQueryDate();
    console.log(data)
    if(!data){
      toastr.warning('请选择日期')
    }else{
      this.dataService.selectDate(data);
      this.dialogRef.close()
    } 
  }

  private getQueryDate() {
    const value = this.dataType - 1;
    if (value > 0) {
      return {
        startDate: moment().subtract(value, 'days').format('yyyy-MM-DD')
      }
    } else if (value == 0) {
      return {
        startDate: moment().format('yyyy-MM-DD')
      }
    } else if (value == -1) {
      return {};
    } else if (value == -2) {
      if (this.range?.value?.start && this.range?.value?.end) {
        return {
          startDate: (this.range.value.start as any).format('yyyy-MM-DD'),
          endDate: (this.range.value.end as any).format('yyyy-MM-DD')
        }
      }
    }
    return null
  }

}
