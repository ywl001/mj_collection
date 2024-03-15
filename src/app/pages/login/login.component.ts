import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import toastr from 'toastr'
import { Router } from '@angular/router';
import { LocalStorgeService } from '../../services/local-storge.service';
import { DataService, MessageType } from '../../services/data.service';
import { DbService } from '../../services/db.service';
import { UserService } from '../../services/user.service';

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
    private userService:UserService,
    private router:Router){
    if(this.local.getObject('user')){
      // User.id = parseInt(this.local.get('userId'))
      // User.user_name = this.local.get('userName')
      // User.password = this.local.get('password')
      // User.real_name = this.local.get('realName')
      // User.type = parseInt(this.local.get('userType'))

      this.userService.user = this.local.getObject('user')
      this.router.navigate(['/xiaoqu_list'])
      this.dataService.sendMessage(MessageType.getUserInfo)
    }
  }

  onSubmit() {
    // 在这里处理登录逻辑，可以发送 HTTP 请求到后端验证用户
    console.log('Login clicked. Username:', this.username, 'Password:', this.password);
    this.sql.getUserInfo(this.username,this.password).subscribe(res=>{
      if(res.length > 0){
        const user = res[0];
        // console.log(user)
        // User.id = user.id;
        // User.user_name = user.username;
        // User.real_name = user.real_name;
        // User.password = user.password;
        // User.type = user.type;
        this.userService.user = user;

        this.local.set('user',user)

        // console.log(User.id)

        // this.local.set('userName',user.username)
        // this.local.set('password',user.password)
        // this.local.set('userId',user.id)
        // this.local.set('realName',user.real_name)
        // this.local.set('userType',user.type)


        this.router.navigate(['/xiaoqu_list'])
        this.dataService.sendMessage(MessageType.login_success)

      }else{
        toastr.info('用户名或密码错误')
      }
    })
  }
}
