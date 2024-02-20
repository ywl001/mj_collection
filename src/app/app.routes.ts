import { Routes } from '@angular/router';
import { HosingsPageComponent } from './hosings-page/hosings-page.component';
import { BuildingsPageComponent } from './buildings-page/buildings-page.component';
import { BuildingComponent } from './building-page/building-page.component';
import { PersonPageComponent } from './person-page/person-page.component';

export const routes: Routes = [
    { path: '', component: HosingsPageComponent }, // 默认路由
    { path: 'buildings', component: BuildingsPageComponent },
    { path: 'building', component: BuildingComponent },
    { path: 'person', component: PersonPageComponent }
];
