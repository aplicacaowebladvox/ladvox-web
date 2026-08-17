import { AnamnesisPatientOptions } from './../../models/options/anamnesis-patient.options';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientModelMock } from '../../mocks/patient/patient.mock';
import { PatientModel } from '../../models/patient.model';
import { BaseStore } from '../abstractions/base.store';
import { PatientOptionsModel } from '../../models/options/patient.options';
import { SearchReturn } from '../models/search-return.model';
import { AnamnesisPatientModel } from '../../models/anamnesis-patient.model';

@Injectable()
export class AnamnesisPatientStore extends BaseStore {
  constructor() {
    super('anamnesis-patient');
  }
  search(options: AnamnesisPatientOptions): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  getById(id: number): Observable<AnamnesisPatientModel> {
    return this.requestService.makeGet(this.getUrl(id + ''));
  }
  insert(model: AnamnesisPatientModel): Observable<AnamnesisPatientModel> {
    return this.requestService.makePost(this.getUrl(''), { data: model });
  }
  update(id: number, model: AnamnesisPatientModel): Observable<AnamnesisPatientModel> {
    return this.requestService.makePut(this.getUrl(id + ''), { data: model });
  }
}
