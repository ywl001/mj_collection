import { HttpInterceptorFn } from '@angular/common/http';
import { DataService } from './services/data.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loading2Interceptor: HttpInterceptorFn = (req, next) => {
  const dataService:DataService = inject(DataService);
  console.log('start')
  dataService.loading(true)
  return next(req).pipe(
    finalize(() => {
      // Turn off the loading spinner
      dataService.loading(false);
      console.log('end')
    })
  )
};
