import { UrlParameterBuilder } from './../models/url-parameter.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseStore } from '../abstractions/base.store';
import { SelectOptionExtraAttributeModel, SelectOptionModel } from '../models/select-option.model';

@Injectable()
export class TeamMedicalAppointmentPlanningStore extends BaseStore {
  constructor() {
    super('team-medical-appointment-planning');
  }
  getSelectOptions(
    medicalAppointmentPlanningId: number
  ): Observable<SelectOptionExtraAttributeModel<number, string, string>[]> {
    return this.requestService.makeGet(
      this.getUrl('select-options'),
      undefined,
      ...new UrlParameterBuilder()
        .add('medicalAppointmentPlanningId', medicalAppointmentPlanningId)
        .build()
    );
  }
}
