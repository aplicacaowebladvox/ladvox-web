import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientModelMock } from '../../mocks/patient/patient.mock';
import { PatientModel } from '../../models/patient.model';
import { SystemContactModel } from '../../models/system-contact.model';
import { SystemContactMock } from '../../mocks/system-contact.mock';
import { SystemSocialMediaModel } from '../../models/system-landing-page-social-media.model';
import { SystemSocialMediaMock } from '../../mocks/system-social-media.mock';
import { SystemSocialMediaOptions } from '../../models/options/system-social-media.options';
import { SearchReturn } from '../models/search-return.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';
import { BaseStore } from '../abstractions/base.store';

@Injectable()
export class SystemSocialMediaStore extends BaseStore {
  constructor() {
    super('social-media');
  }
  getById(id: number): Observable<SystemSocialMediaModel> {
    return this.requestService.makeGet(this.getUrl('' + id));
  }
  delete(id: any): Observable<void> {
    return this.requestService.makeDelete(this.getUrl('' + id));
  }
  search(options: SystemSocialMediaOptions): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  insert(model: SystemSocialMediaModel): Observable<SystemSocialMediaModel> {
    return this.requestService.makePost(this.getUrl(''), { data: model });
  }
  update(id: number, model: SystemSocialMediaModel): Observable<SystemSocialMediaModel> {
    return this.requestService.makePut(this.getUrl(`${id}`), { data: model });
  }
  getIconClassAvailableForSelectOptions(): Observable<any[]> {
    return of(
      SystemSocialMediaMock.getAll().map((ssm) => ({
        id: ssm.iconClass,
        name: `<i class="${ssm.iconClass}"></i>`,
      }))
    );
  }
}
