import { Routes } from '@angular/router';
import { HosingsComponent } from './hosings/hosings.component';
import { BuildingsComponent } from './buildings/buildings.component';

export const routes: Routes = [
    { path: '', component: HosingsComponent }, // 默认路由
    { path: 'buildings', component: BuildingsComponent },
];
