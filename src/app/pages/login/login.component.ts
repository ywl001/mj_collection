import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import toastr from 'toastr'
import { User } from '../../User';
import { Router } from '@angular/router';
import { LocalStorgeService } from '../../services/local-storge.service';
import { DataService, MessageType } from '../../services/data.service';
import { DbService } from '../../services/db.service';

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
    private local:LocalStorgeService,
    private dataService:DataService,
    private router:Router){
    if(this.local.get('userId')){
      User.id = parseInt(this.local.get('userId'))
      User.user_name = this.local.get('userName')
      User.password = this.local.get('password')
      User.real_name = this.local.get('realName')

      this.router.navigate(['/hosing'])

      this.dataService.sendMessage(MessageType.getUserInfo)
    }
  }

  onSubmit() {
    // 在这里处理登录逻辑，可以发送 HTTP 请求到后端验证用户
    console.log('Login clicked. Username:', this.username, 'Password:', this.password);
    this.sql.getUserInfo(this.username,this.password).subscribe(res=>{
      if(res.length > 0){
        const user = res[0];
        console.log(user)
        User.id = user.user_id;
        User.user_name = user.user_name;
        User.real_name = user.real_name;
        User.password = user.password;

        console.log(User.id)

        this.local.set('userName',user.user_name)
        this.local.set('password',user.password)
        this.local.set('userId',user.user_id)
        this.local.set('realName',user.real_name)


        this.router.navigate(['/hosing'])

      }else{
        toastr.info('用户名或密码错误')
      }
    })
  }
}
