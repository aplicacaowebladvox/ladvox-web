import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnswerProtocolComponent } from '../therapeutic-plan/views/answer-protocol/answer-protocol.component';
import { RouterModule, Routes } from '@angular/router';
import { MyProtocolsListComponent } from './view/protocols/my-protocols-list/my-protocols-list.component';
import { MyProtocolsFormComponent } from './view/protocols/my-protocols-form/my-protocols-form.component';

const routes: Routes = [
  {
    path: ':patientId/protocolo/:protocolTherapeuticPlanId',
    component: AnswerProtocolComponent,
  },
  {
    path: 'meus-protocolos',
    component: MyProtocolsListComponent,
  },
  {
    path: 'meus-protocolos/:protocolTherapeuticPlanId',
    component: MyProtocolsFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientViewRoutingModule {}
