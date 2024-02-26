import {LOCALE_ID, Provider} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';

import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

import {registerLocaleData} from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { CacheInterceptor } from './services/CacheInterceptor';
registerLocaleData(localeDe, localeDeExtra);


export function provideLocaleConfig(): Provider[] {
  return [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ];
}