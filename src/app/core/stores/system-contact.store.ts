import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientModelMock } from '../../mocks/patient/patient.mock';
import { PatientModel } from '../../models/patient.model';
import { SystemContactModel } from '../../models/system-contact.model';
import { SystemContactMock } from '../../mocks/system-contact.mock';
import { BaseStore } from '../abstractions/base.store';

@Injectable()
export class SystemContactStore extends BaseStore {
  constructor() {
    super('system-contact');
  }
  getActive(): Observable<SystemContactModel> {
    return this.requestService.makeGet(this.getUrl('active'));
  }
  save(model: SystemContactModel): Observable<SystemContactModel> {
    return this.requestService.makePatch(this.getUrl(''), { data: model });
  }
}
