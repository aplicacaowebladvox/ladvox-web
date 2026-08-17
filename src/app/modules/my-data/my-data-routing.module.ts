import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserDataFormComponent } from './views/user-data-form/user-data-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserDataFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDataRoutingModule {}
