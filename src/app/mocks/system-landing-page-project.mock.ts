import { FormBuilder, FormGroup } from '@angular/forms';
import { SystemLandingPageProjectModel } from '../models/system-landing-page-project.model';

export class SystemLandingPageProjectMock {
  static PROJECT_1 = {
    id: 1,
    title: 'Nome do Projeto 1',
    status: 'Situação do projeto 1',
    description: 'Descrição do projeto 1',
  } as SystemLandingPageProjectModel;

  static getAll(): SystemLandingPageProjectModel[] {
    return [this.PROJECT_1];
  }
}
