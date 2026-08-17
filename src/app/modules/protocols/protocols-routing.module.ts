import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtocolsListComponent } from './views/protocols-list/protocols-list.component';
import { ProtocolsFormComponent } from './views/protocols-form/protocols-form.component';
import { ProtocolsQuestionsComponent } from './views/protocols-questions/protocols-questions.component';
import { ProtocolsAnswerTypeFormComponent } from './views/protocols-answer-type-form/protocols-answer-type-form.component';
import { ProtocolsQuestionFormComponent } from './views/protocols-question-form/protocols-question-form.component';
import { ProtocolsGroupFormComponent } from './views/protocols-group-form/protocols-group-form.component';
import { MyProtocolsFormComponent } from '../patient-view/view/protocols/my-protocols-form/my-protocols-form.component';

const routes: Routes = [
  {
    path: '',
    component: ProtocolsListComponent,
  },
  {
    path: 'form',
    component: ProtocolsFormComponent,
  },
  {
    path: 'form/:id',
    component: ProtocolsFormComponent,
  },
  {
    path: 'form/:id/tipos-respostas',
    component: ProtocolsAnswerTypeFormComponent,
  },
  {
    path: 'form/:id/perguntas',
    component: ProtocolsQuestionFormComponent,
  },
  {
    path: 'form/:id/grupos',
    component: ProtocolsGroupFormComponent,
  },
  {
    path: 'form/:protocolId/visualizacao',
    component: MyProtocolsFormComponent,
  },
  {
    path: 'form/:id/perguntas-old',
    component: ProtocolsQuestionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtocolsRoutingModule {}
