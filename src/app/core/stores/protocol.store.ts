import { Injectable } from '@angular/core';
import { ProtocolOptionsModel } from '../../models/options/protocol.options';
import { ProtocolMock } from '../../models/protocols.mock';
import { ProtocolModel } from '../../models/protocol.model';
import { Observable, of } from 'rxjs';
import { BaseStore } from '../abstractions/base.store';
import { SearchReturn } from '../models/search-return.model';
import { UrlParameterBuilder } from '../models/url-parameter.model';
import { ProtocolFirstStepModel } from '../../models/protocol-first-step.model';
import { ProtocolSecondStepModel } from '../../models/protocol-second-step.model';
import { ProtocolThirdStepModel } from '../../models/protocol-third-step.model';
import { ProtocolFourthStepModel } from '../../models/protocol-fourth-step.model';
import { SelectOptionModel } from '../models/select-option.model';
import { MyProtocolModel } from '../../models/my-protocol.model';
import { AnswerQuestionProtocolModel } from '../../models/answer-question-protocol.model';
import { ProtocolCalculatedModel } from '../../models/protocol-calculated.model';

@Injectable()
export class ProtocolStore extends BaseStore {
  constructor() {
    super('protocol');
  }
  search(options: ProtocolOptionsModel): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  getAll(): Observable<ProtocolModel[]> {
    return of(ProtocolMock.getAll());
  }
  get(
    id: number,
    step: number = 1
  ): Observable<ProtocolFirstStepModel | ProtocolSecondStepModel | ProtocolThirdStepModel> {
    return this.requestService.makeGet(
      this.getUrl('' + id),
      {},
      ...new UrlParameterBuilder().add('step', step).build()
    );
  }
  getSecondStep(id: number): Observable<ProtocolSecondStepModel> {
    return this.requestService.makeGet(
      this.getUrl('' + id),
      {},
      ...new UrlParameterBuilder().add('step', 2).build()
    );
  }
  getThirdStep(id: number): Observable<ProtocolThirdStepModel> {
    return this.requestService.makeGet(
      this.getUrl('' + id),
      {},
      ...new UrlParameterBuilder().add('step', 3).build()
    );
  }
  getFourthStep(id: number): Observable<ProtocolFourthStepModel> {
    return this.requestService.makeGet(
      this.getUrl('' + id),
      {},
      ...new UrlParameterBuilder().add('step', 4).build()
    );
  }
  updateSecondStep(
    id: number,
    model: ProtocolSecondStepModel
  ): Observable<ProtocolSecondStepModel> {
    return this.requestService.makePut(this.getUrl(`${id}/second`), { data: model });
  }
  updateThirdStep(id: number, model: ProtocolThirdStepModel): Observable<ProtocolThirdStepModel> {
    return this.requestService.makePut(this.getUrl(`${id}/third`), { data: model });
  }
  update(id: number, model: ProtocolFirstStepModel): Observable<ProtocolFirstStepModel> {
    return this.requestService.makePut(this.getUrl(`${id}`), { data: model });
  }
  updateFourthStep(id: number, model: ProtocolThirdStepModel): Observable<ProtocolThirdStepModel> {
    return this.requestService.makePut(this.getUrl(`${id}/fourth`), { data: model });
  }

  updateQuestions(
    id: number,
    model: ProtocolSecondStepModel | ProtocolThirdStepModel,
    step: number
  ): Observable<ProtocolSecondStepModel | ProtocolThirdStepModel> {
    let route: string = '';
    if (step == 3) {
      route = 'third';
    } else if (step == 4) {
      route = 'fourth';
    } else {
      route = 'second';
    }
    return this.requestService.makePut(this.getUrl(`${id}/${route}`), { data: model });
  }
  insert(protocol: ProtocolFirstStepModel): Observable<ProtocolFirstStepModel> {
    return this.requestService.makePost(this.getUrl(''), { data: protocol });
  }
  getSelectOptions(): Observable<SelectOptionModel<number, string>[]> {
    return this.requestService.makeGet(this.getUrl('select-options'));
  }
  getMyProtocolData(id: number): Observable<MyProtocolModel> {
    return this.requestService.makeGet(this.getUrl(`${id}/my-data`));
  }
  calculate(
    id: number,
    answers: AnswerQuestionProtocolModel[]
  ): Observable<ProtocolCalculatedModel> {
    return this.requestService.makePost(this.getUrl(`${id}/calculate`), { data: answers });
  }
}
