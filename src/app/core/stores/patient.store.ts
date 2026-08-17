import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientModelMock } from '../../mocks/patient/patient.mock';
import { PatientModel } from '../../models/patient.model';
import { BaseStore } from '../abstractions/base.store';
import { PatientOptionsModel } from '../../models/options/patient.options';
import { SearchReturn } from '../models/search-return.model';
import { SelectOptionModel } from '../models/select-option.model';
import { UrlParameterBuilder } from '../models/url-parameter.model';

@Injectable()
export class PatientStore extends BaseStore {
  constructor() {
    super('patient');
  }
  search(options: PatientOptionsModel): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  getById(id: number): Observable<PatientModel> {
    return this.requestService.makeGet(this.getUrl('' + id));
  }
  insert(data: PatientModel): Observable<PatientModel> {
    return this.requestService.makePost(this.getUrl(''), { data: data });
  }
  update(id: number, data: PatientModel): Observable<PatientModel> {
    return this.requestService.makePut(this.getUrl('' + id), { data: data });
  }
  getSelectOptions(id?: number): Observable<SelectOptionModel<number, string>[]> {
    return this.requestService.makeGet(
      this.getUrl('select-options'),
      undefined,
      ...(id ? new UrlParameterBuilder().add('id', id).build() : [])
    );
  }
}
