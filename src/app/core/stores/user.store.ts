import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserOptionsModel } from '../../models/options/user.options';
import { SearchReturn } from '../models/search-return.model';
import { UserModel } from '../../models/user.model';
import { ChooseableUserRoleModel } from '../../modules/authentication/models/chooseable-user-role.model';
import { BaseStore } from '../abstractions/base.store';
import { SelectOptionModel } from '../models/select-option.model';
import { UrlParameterBuilder } from '../models/url-parameter.model';
import { UserMyDataModel } from '../../models/user-my-data.model';
import { AttachmentModel } from '../../models/attachment.model';

@Injectable()
export class UserStore extends BaseStore {
  constructor() {
    super('user');
  }
  mountChooseableRole(): Observable<ChooseableUserRoleModel[]> {
    return this.requestService.makeGet(this.getUrl('chooseable-user-roles'));
  }
  search(options: UserOptionsModel): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  getById(id: number): Observable<UserModel> {
    return this.requestService.makeGet(this.getUrl('' + id));
  }
  insert(data: UserModel): Observable<UserModel> {
    return this.requestService.makePost(this.getUrl(''), { data: data });
  }
  update(id: number, model: UserModel): Observable<UserModel> {
    return this.requestService.makePut(this.getUrl(`${id}`), { data: model });
  }
  delete(id: any): Observable<void> {
    return this.requestService.makeDelete(this.getUrl('' + id));
  }
  getSelectOptions(therapists: boolean): Observable<SelectOptionModel<string, string>[]> {
    return this.requestService.makeGet(
      this.getUrl('select-options'),
      undefined,
      ...new UrlParameterBuilder().add('therapists', therapists == true).build()
    );
  }
  getMyData(): Observable<UserMyDataModel> {
    return this.requestService.makeGet(this.getUrl('data'));
  }
  saveImage(id: string, profileImage: AttachmentModel): Observable<AttachmentModel> {
    return this.requestService.makePost(this.getUrl(id + '/profile-image'), { data: profileImage });
  }
  getProfileImage(): Observable<AttachmentModel> {
    return this.requestService.makeGet(this.getUrl('profile-image'));
  }
  updateBaseData(id: string, model: UserModel): Observable<UserMyDataModel> {
    return this.requestService.makePatch(this.getUrl(id + '/data'), { data: model });
  }
}
