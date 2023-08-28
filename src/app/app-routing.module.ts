import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DxDataGridModule, DxFormModule, DxSchedulerModule, DxDraggableModule, DxScrollViewModule, DxButtonModule, DxPopupModule, DxSelectBoxModule } from 'devextreme-angular';
import { SchedulerComponent } from './pages/scheduler/scheduler.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'scheduler',
    component: SchedulerComponent,
    canActivate: [  ]
  },
  {
    path: '**',
    redirectTo: 'scheduler'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), 
    DxDataGridModule, 
    DxFormModule, 
    DxSchedulerModule,
    DxDraggableModule,
    DxScrollViewModule,
    DxButtonModule,
    DxPopupModule,
    DxSelectBoxModule,
    CommonModule
  ],
  providers: [],
  exports: [RouterModule],
  declarations: [
    SchedulerComponent
  ]
})
export class AppRoutingModule { }
