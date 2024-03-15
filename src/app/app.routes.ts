import { Routes } from '@angular/router';
import { XiaoquListPageComponent } from './pages/xiaoqu-list-page/xiaoqu-list-page.component';
import { XiaoquPageComponent } from './pages/xiaoqu-page/xiaoqu-page.component';
import { BuildingPageComponent } from './pages/building-page/building-page.component';
import { PersonPageComponent } from './pages/person-page/person-page.component';
import { LoginComponent } from './pages/login/login.component';
import { WorkPageComponent } from './pages/user-page/user-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, // 默认路由
    { path: 'xiaoqu_list', component: XiaoquListPageComponent },
    { path: 'xiaoqu', component: XiaoquPageComponent },
    { path: 'building', component: BuildingPageComponent},
    { path: 'person', component: PersonPageComponent },
    { path: 'userwork', component: WorkPageComponent },
    { path: '',   redirectTo: '/login', pathMatch: 'full' },
    { path: '**', component: LoginComponent }
];
