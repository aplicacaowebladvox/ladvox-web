import { ChooseableUserRoleModel } from './../../modules/authentication/models/chooseable-user-role.model';
import { Injectable } from '@angular/core';
import { BaseStore } from '../abstractions/base.store';
import { Observable } from 'rxjs';
import { MenuResponseModel } from '../models/menu-response.model';
import { UrlParameterBuilder } from '../models/url-parameter.model';
import { FastActionModel } from '../models/fast-action.model';
import { NextSessionModel } from '../models/next-session.model';

@Injectable()
export class SystemConfigStore extends BaseStore {
  constructor() {
    super('system-config');
  }

  getMenu(chooseableUserRoleModel?: ChooseableUserRoleModel): Observable<MenuResponseModel> {
    return this.requestService.makePost(this.getUrl('menu'), { data: chooseableUserRoleModel });
  }
  performedAction(menuItemId: number): Observable<void> {
    return this.requestService.makePatch(
      this.getUrl('performed-action'),
      {},
      ...new UrlParameterBuilder().add('menuItemId', menuItemId).build()
    );
  }
  fastActions(): Observable<FastActionModel> {
    return this.requestService.makeGet(this.getUrl('fast-actions'));
  }
  getNextSessions(): Observable<NextSessionModel> {
    return this.requestService.makeGet(this.getUrl('next-session'));
  }
}
