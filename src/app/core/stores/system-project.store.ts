import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchReturn } from '../models/search-return.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';
import { SystemLandingPageProjectMock } from '../../mocks/system-landing-page-project.mock';
import { SystemLandingPageProjectModel } from '../../models/system-landing-page-project.model';
import { SystemLandingPageProjectOptions } from '../../models/options/system-landing-page-project.options';
import { BaseStore } from '../abstractions/base.store';

@Injectable()
export class SystemProjectStore extends BaseStore {
  constructor() {
    super('project');
  }
  getById(id: number): Observable<SystemLandingPageProjectModel> {
    return this.requestService.makeGet(this.getUrl('' + id));
  }
  delete(id: any): Observable<void> {
    return this.requestService.makeDelete(this.getUrl('' + id));
  }
  search(options: SystemLandingPageProjectOptions): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  insert(model: SystemLandingPageProjectModel): Observable<SystemLandingPageProjectModel> {
    return this.requestService.makePost(this.getUrl(''), { data: model });
  }
  update(
    id: number,
    model: SystemLandingPageProjectModel
  ): Observable<SystemLandingPageProjectOptions> {
    return this.requestService.makePut(this.getUrl(`${id}`), { data: model });
  }
}
