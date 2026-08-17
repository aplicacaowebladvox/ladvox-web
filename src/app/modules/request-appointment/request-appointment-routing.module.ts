import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RequestAppointmentListComponent } from './request-appointment-list/request-appointment-list.component';
import { RequestAppointmentFormComponent } from './views/request-appointment-form/request-appointment-form.component';

const routes: Routes = [
  {
    path: '',
    component: RequestAppointmentListComponent,
  },
  {
    path: ':id',
    component: RequestAppointmentFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestAppointmentRoutingModule {}
