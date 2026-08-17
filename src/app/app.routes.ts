import { ProjectsComponent } from './modules/public/projects/projects.component';
import { MedicalAppointmentModule } from './modules/medical-appointment/medical-appointment.module';
import { TherapeuticPlanModule } from './modules/therapeutic-plan/therapeutic-plan.module';
import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { PublicHomeComponent } from './views/public-home/public-home.component';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';
import { RequestAppointmentComponent } from './modules/public/request-appointment/request-appointment.component';
import { TeamComponent } from './modules/public/team/team.component';
import { PublicationsComponent } from './modules/public/publications/publications.component';
import { PublicMainLayoutComponent } from './modules/public/public-main-layout/public-main-layout.component';
import { authGuardCanActivateFn } from './core/guards/auth.guard';
import { accountGuardCanActivateFn } from './core/guards/account.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/authentication/authentication.module').then((m) => m.AuthenticationModule),
    // canActivate: [accountGuardCanActivateFn],
  },
  {
    path: '',
    component: PublicMainLayoutComponent,
    children: [
      {
        path: '',
        component: PublicHomeComponent,
      },
      {
        path: 'solicitar-consulta',
        component: RequestAppointmentComponent,
      },
      {
        path: 'equipe',
        component: TeamComponent,
      },
      {
        path: 'projetos',
        component: ProjectsComponent,
      },
      {
        path: 'publicacoes',
        component: PublicationsComponent,
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuardCanActivateFn],
      },
      {
        path: 'controle-acesso',
        loadChildren: () =>
          import('./modules/access-control/access-control.module').then(
            (m) => m.AccessControlModule
          ),
      },
      {
        path: 'pacientes',
        loadChildren: () =>
          import('./modules/patients/patients.module').then((m) => m.PatientsModule),
      },
      {
        path: 'protocolos',
        loadChildren: () =>
          import('./modules/protocols/protocols.module').then((m) => m.ProtocolsModule),
      },
      {
        path: 'plano-terapeutico',
        loadChildren: () =>
          import('./modules/therapeutic-plan/therapeutic-plan.module').then(
            (m) => m.TherapeuticPlanModule
          ),
      },
      {
        path: 'atendimento',
        loadChildren: () =>
          import('./modules/medical-appointment/medical-appointment.module').then(
            (m) => m.MedicalAppointmentModule
          ),
      },
      {
        path: 'paciente',
        loadChildren: () =>
          import('./modules/patient-view/patient-view.module').then((m) => m.PatientViewModule),
      },
      {
        path: 'solicitacoes-atendimento',
        loadChildren: () =>
          import('./modules/request-appointment/request-appointment.module').then(
            (m) => m.RequestAppointmentModule
          ),
      },
      {
        path: 'configuracoes',
        loadChildren: () =>
          import('./modules/system-configuration/system-configuration.module').then(
            (m) => m.SystemConfigurationModule
          ),
      },
      {
        path: 'meus-dados',
        loadChildren: () => import('./modules/my-data/my-data.module').then((m) => m.MyDataModule),
      },
    ],
  },
];
