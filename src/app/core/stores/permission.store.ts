import { PermissionModelMock } from '../../mocks/user/function-performed-paper-user.mock';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoleModel } from '../../models/role.model';
import { RoleModelMock } from '../../mocks/user/paper-user.mock';
import { RoleOptionsModel } from '../../models/options/role.options';
import { SearchReturn } from '../models/search-return.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { RoleGrid } from '../../models/grid/role.grid';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';
import { PermissionModel } from '../../models/permission.model';
import { BaseStore } from '../abstractions/base.store';
import { SelectOptionModel } from '../models/select-option.model';

@Injectable()
export class PermissionStore extends BaseStore {
  constructor() {
    super('permission');
  }
  getSelectOptions(): Observable<SelectOptionModel<string, string>[]> {
    return this.requestService.makeGet(this.getUrl('select-options'));
  }
  getAll(): Observable<PermissionModel[]> {
    return of(PermissionModelMock.getAll());
  }
}
