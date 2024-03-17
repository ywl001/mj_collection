import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { XiaoquListPageComponent } from './pages/xiaoqu-list-page/xiaoqu-list-page.component';
import { NgFor, NgIf } from '@angular/common';
import { DataService, MessageType } from './services/data.service';
import { Subscription, of } from 'rxjs';
import { BuildingPageComponent } from './pages/building-page/building-page.component';
import { XiaoquPageComponent } from './pages/xiaoqu-page/xiaoqu-page.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { LongPressDirective } from './longpress';
import { DbService } from './services/db.service';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { GlobalService } from './global.service';
import { RouterPath } from './app-type';
import { LoadingComponent } from './components/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    LoadingComponent,MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '孟津区公安局信息采集';

  userName = ''

  constructor(private dataService: DataService,
    private gs:GlobalService,
    private dbService:DbService,
    private router: Router) {
    // const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ abcdefghij"
    // console.time('aaa');
    // console.log(this.lengthOfLongestSubstring(s))
    // console.log(this.longestStr(s))
    // console.timeEnd('aaa');
    }

  private sub1:Subscription
  ngOnInit() {
    this.sub1 = this.dataService.login$.subscribe(user=>{
      console.log('login')
      this.userName = user?.real_name?.charAt(0)
    })

    this.dataService.selectDate$.subscribe(res=>{
      if(this.gs.user){
        this.dbService.getUserInsertPersons(this.gs.user?.id,res).subscribe(res=>{
          console.log(res)
          this.saveSheet(res)
        })
      }
    })
  }

  // private longestStr(s:string){
  //   let maxLen = 0
  //   let res = new Map()
  //   for (let i = 0; i <= s.length; i++) {
  //     for (let j = i; j <= s.length; j++) {
  //       const s2 = s.substring(j,i)
  //       // console.log(s2)
  //       if(!this.hasDuplicateChars(s2)){
  //         if(s2.length > maxLen){
  //           maxLen = s2.length;
  //           res.set('len',maxLen);
  //           res.set('value',s2)
  //         }
  //       }
  //     }
  //   }
  //   return maxLen
  // }

//   private lengthOfLongestSubstring = function(s) {
//     let left = 0;
//     let maxLength = 0;
//     let charSet = new Set();

//     for (let right = 0; right < s.length; right++) {
//         while (charSet.has(s[right])) {
//             charSet.delete(s[left]);
//             left++;
//         }

//         charSet.add(s[right]);
//         maxLength = Math.max(maxLength, right - left + 1);
//     }

//     return maxLength;    
// };

//   private hasDuplicateChars(str) {
//     return /(.).*\1/.test(str);
//   }


  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }


  onGetUserWork() {
    if(this.userName && this.userName!=''){
      this.router.navigate([RouterPath.userwork])
    }
  }

  private saveSheet(arr: any[]) {
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'people');

    /* save to file */
    let fileName = this.gs.user?.real_name+'导出数据'
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

}
