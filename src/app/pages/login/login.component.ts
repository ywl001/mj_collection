import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import toastr from 'toastr'
import { Router } from '@angular/router';
import { LocalStorgeService } from '../../services/local-storge.service';
import { DataService, MessageType } from '../../services/data.service';
import { DbService } from '../../services/db.service';
import { GlobalService } from '../../global.service';
import { RouterPath } from '../../app-type';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private sql:DbService,
    private gs:GlobalService,
    private router:Router){
    if(this.gs.user){
      this.router.navigate([RouterPath.xiaoqu_list])
    }
  }

  onSubmit() {
    // 在这里处理登录逻辑，可以发送 HTTP 请求到后端验证用户
    this.sql.getUserInfo(this.username,this.password).subscribe(res=>{
      if(res.length > 0){
        const user = res[0];
        this.gs.user = user;
        this.router.navigate([RouterPath.xiaoqu_list])
      }else{
        toastr.info('用户名或密码错误')
      }
    })
  }
}
