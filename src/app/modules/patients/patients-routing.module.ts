import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsListComponent } from './views/patients-list/patients-list.component';
import { PatientsFormComponent } from './views/patients-form/patients-form.component';
import { PatientsAnamnesisComponent } from './views/patients-anamnesis/patients-anamnesis.component';
import { PatientsEvolutionComponent } from './views/patients-protocol-history/patients-protocol-history.component';
import { PatientsAnamnesisFormComponent } from './views/patients-anamnesis-form/patients-anamnesis-form.component';

const routes: Routes = [
  {
    path: '',
    component: PatientsListComponent,
  },
  {
    path: 'form',
    component: PatientsFormComponent,
  },
  {
    path: ':id',
    component: PatientsFormComponent,
  },
  {
    path: ':id/anamnese',
    component: PatientsAnamnesisComponent,
  },
  {
    path: ':id/anamnese/form',
    component: PatientsAnamnesisFormComponent,
  },
  {
    path: ':id/anamnese/:anamnesisId',
    component: PatientsAnamnesisFormComponent,
  },
  {
    path: ':id/historico-protocolos',
    component: PatientsEvolutionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
