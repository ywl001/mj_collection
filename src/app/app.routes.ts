import { Routes } from '@angular/router';
import { XiaoquListPageComponent } from './pages/xiaoqu-list-page/xiaoqu-list-page.component';
import { XiaoquPageComponent } from './pages/xiaoqu-page/xiaoqu-page.component';
import { BuildingPageComponent } from './pages/building-page/building-page.component';
import { PersonPageComponent } from './pages/person-page/person-page.component';
import { LoginComponent } from './pages/login/login.component';
import { WorkPageComponent } from './pages/user-page/user-page.component';
import { RouterPath } from './app-type';

export const routes: Routes = [
    { path: RouterPath.login, component: LoginComponent }, // 默认路由
    { path: RouterPath.xiaoqu_list, component: XiaoquListPageComponent },
    { path: RouterPath.xiaoqu+'/:'+RouterPath.xiaoqu, component: XiaoquPageComponent },
    { path: RouterPath.building+'/:'+RouterPath.building, component: BuildingPageComponent},
    { path: RouterPath.person+'/:'+RouterPath.person, component: PersonPageComponent },
    { path: RouterPath.userwork, component: WorkPageComponent },
    { path: '',   redirectTo: RouterPath.login, pathMatch: 'full' },
    { path: '**', component: LoginComponent }
];
