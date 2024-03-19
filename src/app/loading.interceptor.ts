import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, finalize, mergeMap } from 'rxjs';
import { DataService } from './services/data.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private dataService: DataService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // req = this.handleRequest(req);
    // return next.handle(req).pipe(
    //   mergeMap(evt => this.handleResponse(evt))
    // );



    // console.log('aaaaaaaaaaa')
    // return next.handle(req);
    // if (req.context.get(SkipLoading)) {
    //   // Pass the request directly to the next handler
    //   return next.handle(req);
    // }

    this.dataService.loading(true);

    return next.handle(req).pipe(
      finalize(() => {
        // Turn off the loading spinner
        this.dataService.loading(false);
      })
    );
  }

  handleRequest(req: any) {
    console.log(`拦截器A在请求发起前的拦截处理`);
    return req;
  }

  handleResponse(evt: any) {
    console.log("拦截器A在数据返回后的拦截处理");
    return new Observable<HttpEvent<any>>(observer => {
      observer.next(evt);
    });
  }


}
