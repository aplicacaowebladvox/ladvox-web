import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoleModel } from '../../models/role.model';
import { RoleModelMock } from '../../mocks/user/paper-user.mock';
import { RoleOptionsModel } from '../../models/options/role.options';
import { SearchReturn } from '../models/search-return.model';
import { BaseStore } from '../abstractions/base.store';
import { SelectOptionModel } from '../models/select-option.model';

@Injectable()
export class RoleStore extends BaseStore {
  constructor() {
    super('role');
  }
  getById(id: number): Observable<RoleModel> {
    return this.requestService.makeGet(this.getUrl('' + id));
  }
  getSelectOptions(): Observable<SelectOptionModel<string, string>[]> {
    return this.requestService.makeGet(this.getUrl('select-options'));
  }
  search(options: RoleOptionsModel): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  insert(data: RoleModel): Observable<RoleModel> {
    return this.requestService.makePost(this.getUrl(''), { data: data });
  }
  update(id: number, model: RoleModel): Observable<RoleModel> {
    return this.requestService.makePut(this.getUrl(`${id}`), { data: model });
  }
  delete(id: any): Observable<void> {
    return this.requestService.makeDelete(this.getUrl('' + id));
  }
  getAll(): Observable<RoleModel[]> {
    return of(RoleModelMock.getAll());
  }
}
