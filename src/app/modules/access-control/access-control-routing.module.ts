import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './views/user-list/user-list.component';
import { UserFormComponent } from './views/user-form/user-form.component';
import { PaperUserFormComponent } from './views/role-form/role-form.component';
import { PaperUserListComponent } from './views/role-list/role-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
  },
  {
    path: 'usuario',
    component: UserListComponent,
  },
  {
    path: 'usuario/form',
    component: UserFormComponent,
  },
  {
    path: 'usuario/:id',
    component: UserFormComponent,
  },
  {
    path: 'papel',
    component: PaperUserListComponent,
  },
  {
    path: 'papel/form',
    component: PaperUserFormComponent,
  },
  {
    path: 'papel/:id',
    component: PaperUserFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessControlRoutingModule {}
