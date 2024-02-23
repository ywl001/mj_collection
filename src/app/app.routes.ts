import { Routes } from '@angular/router';
import { HosingsPageComponent } from './pages/hosings-page/hosings-page.component';
import { BuildingsPageComponent } from './pages/buildings-page/buildings-page.component';
import { BuildingPageComponent } from './pages/building-page/building-page.component';
import { PersonPageComponent } from './pages/person-page/person-page.component';
import { LoginComponent } from './pages/login/login.component';
import { WorkPageComponent } from './pages/work-page/work-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, // 默认路由
    { path: 'hosing', component: HosingsPageComponent },
    { path: 'buildings', component: BuildingsPageComponent },
    { path: 'building', component: BuildingPageComponent},
    { path: 'person', component: PersonPageComponent },
    { path: 'userwork', component: WorkPageComponent },
    { path: '',   redirectTo: '/login', pathMatch: 'full' },
    { path: '**', component: LoginComponent }
];
