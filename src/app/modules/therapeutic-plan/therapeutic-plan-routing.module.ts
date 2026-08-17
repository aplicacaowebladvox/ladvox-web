import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TherapeuticPlanListComponent } from './views/therapeutic-plan-list/therapeutic-plan-list.component';
import { TherapeuticPlanFormComponent } from './views/therapeutic-plan-form/therapeutic-plan-form.component';
import { AnswerProtocolComponent } from './views/answer-protocol/answer-protocol.component';
import { MyProtocolsFormComponent } from '../patient-view/view/protocols/my-protocols-form/my-protocols-form.component';

const routes: Routes = [
  {
    path: '',
    component: TherapeuticPlanListComponent,
  },
  {
    path: 'form',
    component: TherapeuticPlanFormComponent,
  },
  {
    path: ':id',
    component: TherapeuticPlanFormComponent,
  },
  {
    path: ':id/protocolo/:protocolTherapeuticPlanId',
    component: MyProtocolsFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TherapeuticPlanRoutingModule {}
