import { SystemConfigurationModule } from './system-configuration.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsListComponent } from './views/contacts-list/contacts-list.component';
import { ContactsFormComponent } from './views/contacts-form/contacts-form.component';
import { ProjectsListComponent } from './views/projects-list/projects-list.component';
import { ProjectsFormComponent } from './views/projects-form/projects-form.component';
import { PublicationsListComponent } from './views/publications-list/publications-list.component';
import { PublicationsFormComponent } from './views/publications-form/publications-form.component';
import { SocialMediaListComponent } from './views/social-media-list/social-media-list.component';
import { SocialMediaFormComponent } from './views/social-media-form/social-media-form.component';
import { authGuardCanActivateFn } from '../../core/guards/auth.guard';
import { roleGuardCanActivateFn } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: 'contatos',
    component: ContactsListComponent,
    canActivate: [authGuardCanActivateFn, roleGuardCanActivateFn],
    data: {
      permissions: ['configuracao-sistema.contato.form.edit', 'configuracao-sistema.contato.view'],
    },
  },
  {
    path: 'redes-sociais',
    component: SocialMediaListComponent,
    canActivate: [roleGuardCanActivateFn],
    data: {
      permissions: ['configuracao-sistema.redes-sociais.view'],
    },
  },
  {
    path: 'redes-sociais/form',
    component: SocialMediaFormComponent,
    canActivate: [roleGuardCanActivateFn],
    data: {
      permissions: ['configuracao-sistema.redes-sociais.form.new'],
    },
  },
  {
    path: 'redes-sociais/:id',
    component: SocialMediaFormComponent,
    canActivate: [roleGuardCanActivateFn],
    data: {
      permissions: [
        'configuracao-sistema.redes-sociais.form.edit',
        'configuracao-sistema.redes-sociais.form.new',
        'configuracao-sistema.redes-sociais.view',
      ],
    },
  },
  {
    path: 'projetos',
    component: ProjectsListComponent,
  },
  {
    path: 'projetos/form',
    component: ProjectsFormComponent,
  },
  {
    path: 'projetos/:id',
    component: ProjectsFormComponent,
  },
  {
    path: 'publicacoes',
    component: PublicationsListComponent,
  },
  {
    path: 'publicacoes/form',
    component: PublicationsFormComponent,
  },
  {
    path: 'publicacoes/:id',
    component: PublicationsFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigurationRoutingModule {}
