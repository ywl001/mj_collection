import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { DataService } from './services/data.service';

export const SkipLoading = new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private dataService: DataService) { 
    console.log('lan jie qi constructor')
  }

  private reqTimes = 0;
  private resTimes = 0;

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
    this.reqTimes++;
    // console.log('start busy')

    return next.handle(req).pipe(
      finalize(() => {
        // Turn off the loading spinner
        this.resTimes++;
        if(this.resTimes == this.reqTimes){
          // console.log('end busy')
          this.dataService.loading(false);
        }
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
