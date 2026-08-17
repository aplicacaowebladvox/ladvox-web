import { Observable } from 'rxjs';
import { MedicalAppointmentPlanningOptions } from '../../models/options/medical-appointment-planning.options';
import { BaseStore } from '../abstractions/base.store';
import { SearchReturn } from '../models/search-return.model';
import { Injectable } from '@angular/core';
import { MedicalAppointmentPlanningFirstStepModel } from '../../models/medical-appointment-planning-first-step.model';
import { UrlParameterBuilder } from '../models/url-parameter.model';
import { MedicalAppointmentPlanningSecondStepModel } from '../../models/medical-appointment-planning-second-step.model';
import { MedicalAppointmentPlanningThirdStepModel } from '../../models/medical-appointment-planning-third-step.model';
import { IAttachmentStore } from './I-attachment.store';
import { AttachmentModel } from '../../models/attachment.model';

@Injectable()
export class MedicalAppointmentPlanningStore extends BaseStore implements IAttachmentStore {
  constructor() {
    super('medical-appointment-planning');
  }
  search(options: MedicalAppointmentPlanningOptions): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  getFirstStep(id: number): Observable<MedicalAppointmentPlanningFirstStepModel> {
    return this.requestService.makeGet(
      this.getUrl('' + id),
      {},
      ...new UrlParameterBuilder().add('step', 1).build()
    );
  }
  getSecondStep(id: number): Observable<MedicalAppointmentPlanningSecondStepModel> {
    return this.requestService.makeGet(
      this.getUrl('' + id),
      {},
      ...new UrlParameterBuilder().add('step', 2).build()
    );
  }
  getThirdStep(id: number): Observable<MedicalAppointmentPlanningThirdStepModel> {
    return this.requestService.makeGet(
      this.getUrl('' + id),
      {},
      ...new UrlParameterBuilder().add('step', 3).build()
    );
  }
  updateFirstStep(
    model: MedicalAppointmentPlanningFirstStepModel,
    id?: number
  ): Observable<MedicalAppointmentPlanningFirstStepModel> {
    if (id) return this.requestService.makePut(this.getUrl(`${id}`), { data: model });
    return this.requestService.makePost(this.getUrl(``), { data: model });
  }
  updateSecondStep(
    id: number,
    model: MedicalAppointmentPlanningSecondStepModel
  ): Observable<MedicalAppointmentPlanningSecondStepModel> {
    return this.requestService.makePut(this.getUrl(`${id}/second`), { data: model });
  }
  updateThirdStep(
    id: number,
    model: MedicalAppointmentPlanningThirdStepModel
  ): Observable<MedicalAppointmentPlanningThirdStepModel> {
    return this.requestService.makePut(this.getUrl(`${id}/third`), { data: model });
  }
  deleteTeam(id: number, teamId: number): Observable<void> {
    return this.requestService.makeDelete(
      this.getUrl(`${id}/team-medical-appointment-planning/${teamId}`)
    );
  }
  deleteMedicalAppointment(id: number, medicalAppointmentId: number) {
    return this.requestService.makeDelete(
      this.getUrl(`${id}/medical-appointment/${medicalAppointmentId}`)
    );
  }
  findAllByEntityId(entityId: number | string): Observable<AttachmentModel[]> {
    return this.requestService.makeGet(
      this.getUrl(`${entityId}/medical-appointment-planning-attachment/attachment`)
    );
  }
  saveForEntityId(
    entityId: number | string,
    attachment: AttachmentModel
  ): Observable<AttachmentModel> {
    return this.requestService.makePost(
      this.getUrl(`${entityId}/medical-appointment-planning-attachment/attachment`),
      { data: attachment }
    );
  }
  delete(id: number): Observable<void> {
    return this.requestService.makeGet(
      this.getUrl(`medical-appointment-planning-attachment/attachment/${id}`)
    );
  }
}
