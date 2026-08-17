import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalAppointmentPlanningListComponent } from './views/medical-appointment-planning-list/medical-appointment-planning-list.component';
import { MedicalAppointmentPlanningFirstStepFormComponent } from './views/medical-appointment-planning-first-step-form/medical-appointment-planning-first-step-form.component';
import { MedicalAppointmentPlanningSecondStepFormComponent } from './views/medical-appointment-planning-second-step-form/medical-appointment-planning-second-step-form.component';
import { MedicalAppointmentPlanningThirdStepFormComponent } from './views/medical-appointment-planning-third-step-form/medical-appointment-planning-third-step-form.component';
import { MedicalAppointmentPlanningFourthStepFormComponent } from './views/medical-appointment-planning-fourth-step-form/medical-appointment-planning-fourth-step-form.component';

const routes: Routes = [
  {
    path: '',
    component: MedicalAppointmentPlanningListComponent,
  },
  {
    path: 'form',
    component: MedicalAppointmentPlanningFirstStepFormComponent,
  },
  {
    path: ':id',
    component: MedicalAppointmentPlanningFirstStepFormComponent,
  },
  {
    path: ':id/equipes',
    component: MedicalAppointmentPlanningSecondStepFormComponent,
  },
  {
    path: ':id/pacientes',
    component: MedicalAppointmentPlanningThirdStepFormComponent,
  },
  {
    path: ':id/relatorios',
    component: MedicalAppointmentPlanningFourthStepFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalAppointmentRoutingModule {}
