import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchReturn } from '../models/search-return.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';
import { SystemLandingPageProjectOptions } from '../../models/options/system-landing-page-project.options';
import { SystemLandingPagePublicationModel } from '../../models/system-landing-page-publication.model';
import { SystemLandingPagePublicationMock } from '../../mocks/system-landing-page-publication.mock';
import { BaseStore } from '../abstractions/base.store';
import { SystemLandingPageProjectModel } from '../../models/system-landing-page-project.model';

@Injectable()
export class SystemPublicationStore extends BaseStore {
  constructor() {
    super('publication');
  }
  getById(id: number): Observable<SystemLandingPagePublicationModel> {
    return this.requestService.makeGet(this.getUrl('' + id));
  }
  delete(id: number): Observable<void> {
    return this.requestService.makeDelete(this.getUrl('' + id));
  }
  search(options: SystemLandingPageProjectOptions): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  insert(data: SystemLandingPagePublicationModel): Observable<SystemLandingPagePublicationModel> {
    return this.requestService.makePost(this.getUrl(''), { data: data });
  }
  update(
    id: number,
    data: SystemLandingPagePublicationModel
  ): Observable<SystemLandingPagePublicationModel> {
    return this.requestService.makePut(this.getUrl('' + id), { data: data });
  }
}
