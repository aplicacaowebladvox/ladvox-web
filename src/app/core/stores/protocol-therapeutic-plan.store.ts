import { ProtocolTherapeuticPlanModel } from './../../models/protocol-therapeutic-plan.model';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientModelMock } from '../../mocks/patient/patient.mock';
import { PatientModel } from '../../models/patient.model';
import { MedicalAppointmentPlanningMock } from '../../mocks/medical-appointment-planning/medical-appointment-planning.mock';
import { BaseStore } from '../abstractions/base.store';
import { ProtocolTherapeuticPlanOptions } from '../../models/options/protocol-therapeutic-plan.options';
import { SearchReturn } from '../models/search-return.model';
import { MyProtocolsOptions } from '../../models/options/my-protocols.options';
import { AnswerValueTypeEnum } from '../../models/enum/answer-value-type.enum';
import { ProtocolCalculatedModel } from '../../models/protocol-calculated.model';

@Injectable()
export class ProtocolTherapeuticPlanStore extends BaseStore {
  constructor() {
    super('protocol-therapeutic-plan');
  }
  search(options: ProtocolTherapeuticPlanOptions): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  getById(id: number): Observable<ProtocolTherapeuticPlanModel> {
    return this.requestService.makeGet(this.getUrl('' + id));
  }
  insert(model: ProtocolTherapeuticPlanModel): Observable<ProtocolTherapeuticPlanModel> {
    return this.requestService.makePost(this.getUrl(''), { data: model });
  }
  delete(id: number): Observable<void> {
    return this.requestService.makeDelete(this.getUrl('' + id));
  }
  searchMyProtocols(options: MyProtocolsOptions): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search-my-protocols'), { data: options });
  }
  saveAnswers(id: number, model: ProtocolTherapeuticPlanModel): Observable<void> {
    const mapped = model;
    mapped.answers = mapped.answers.map((a) => {
      a.answerValueType = <string>AnswerValueTypeEnum.parse(a.answerValueType)!.id;
      return a;
    });
    return this.requestService.makePatch(this.getUrl(`${id}/answers`), { data: mapped });
  }
  findResult(id: number): Observable<ProtocolCalculatedModel> {
    return this.requestService.makeGet(this.getUrl(`${id}/result`));
  }
}
