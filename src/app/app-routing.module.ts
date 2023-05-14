import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { DxDataGridModule, DxFormModule, DxSchedulerModule, DxDraggableModule, DxScrollViewModule } from 'devextreme-angular';
import { SchedulerComponent } from './pages/scheduler/scheduler.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'pages/scheduler',
    component: SchedulerComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), 
    DxDataGridModule, 
    DxFormModule, 
    DxSchedulerModule,
    DxDraggableModule,
    DxScrollViewModule,
    CommonModule
  ],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    SchedulerComponent
  ]
})
export class AppRoutingModule { }
