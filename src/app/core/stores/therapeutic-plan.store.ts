import { Observable, of } from 'rxjs';
import { TherapeuticPlanOptions } from '../../models/options/therapeutic-plan.options';
import { SearchReturn } from '../models/search-return.model';
import { MedicalAppointmentPlanningMock } from '../../mocks/medical-appointment-planning/medical-appointment-planning.mock';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { Injectable } from '@angular/core';
import { TherapeuticPlanModel } from '../../models/therapeutic-plan.model';
import { ProtocolTherapeuticPlanGrid } from '../../models/grid/protocol-therapeutic-plan.grid';
import { ProtocolTherapeuticPlanOptions } from '../../models/options/protocol-therapeutic-plan.options';
import { BaseStore } from '../abstractions/base.store';
import { UrlParameterBuilder } from '../models/url-parameter.model';
import { TherapeuticTextPlanModel } from '../../models/therapeutic-text-plan.model';
import { TherapeuticPlanBaseDataModel } from '../../models/therapeutic-plan-base-data.model';
import { SelectOptionExtraAttributeModel } from '../models/select-option.model';

@Injectable()
export class TherapeuticPlanStore extends BaseStore {
  constructor() {
    super('therapeutic-plan');
  }
  getById(id: number): Observable<TherapeuticPlanModel> {
    return this.requestService.makeGet(this.getUrl('' + id));
  }
  takeOverAsEditor(id: number, medicalAppointmentId: number): Observable<TherapeuticPlanModel> {
    return this.requestService.makePatch(
      this.getUrl('take-over-as-editor'),
      undefined,
      ...new UrlParameterBuilder()
        .add('therapeuticPlanId', id)
        .add('medicalAppointmentId', medicalAppointmentId)
        .build()
        .filter((p) => !!p.value)
    );
  }
  resignAsEditor(id: any): Observable<void> {
    return this.requestService.makePatch(this.getUrl(id + '/resign-as-editor'));
  }
  changeCurrentEditor(
    id: number,
    medicalAppointmentId: number,
    newUserEditorId: string
  ): Observable<void> {
    return this.requestService.makePatch(
      this.getUrl('change-editor'),
      undefined,
      ...new UrlParameterBuilder()
        .add('therapeuticPlanId', id)
        .add('medicalAppointmentId', medicalAppointmentId)
        .add('newUserEditorId', newUserEditorId)
        .build()
        .filter((p) => !!p.value)
    );
  }
  findOrGenerate(medicalAppointmentId: number): Observable<TherapeuticPlanModel> {
    return this.requestService.makePatch(
      this.getUrl('find-generate'),
      undefined,
      ...new UrlParameterBuilder().add('medicalAppointmentId', medicalAppointmentId).build()
    );
  }
  getTherapeuticTextPlan(id: number): Observable<TherapeuticTextPlanModel> {
    return this.requestService.makeGet(this.getUrl(id + '/text'));
  }
  getTherapeuticPlanBaseData(id: number): Observable<TherapeuticPlanBaseDataModel> {
    return this.requestService.makeGet(this.getUrl(id + '/base-data'));
  }
  updateTherapeuticTextPlan(id: number, model: TherapeuticTextPlanModel): Observable<void> {
    return this.requestService.makePatch(this.getUrl(id + '/text'), { data: model });
  }
  getProtocolsByOptions(options: ProtocolTherapeuticPlanOptions): Observable<SearchReturn> {
    let registers: ProtocolTherapeuticPlanGrid[] = [];

    MedicalAppointmentPlanningMock.getAll().forEach((medicalAppointmentPlanning) => {
      medicalAppointmentPlanning.medicalAppointments.forEach((medicalAppointment) => {
        if (options.patientId) {
        }
        if (
          (!!options.id && medicalAppointment.therapeuticPlanId == options.id) ||
          (!!options.patientId && medicalAppointment.patientId == options.patientId)
        ) {
          // ((medicalAppointment.therapeuticPlan || {}).protocols || []).forEach(
          //   (protocolTherapeuticPlan) => {
          //     let register = {} as ProtocolTherapeuticPlanGrid;
          //     register.id = protocolTherapeuticPlan.id;
          //     register.protocolId = protocolTherapeuticPlan.protocol.id || 0;
          //     register.protocolDescription = [
          //       '(',
          //       protocolTherapeuticPlan.protocol.id || 0,
          //       ') - ',
          //       protocolTherapeuticPlan.protocol.abbreviation,
          //       ' de ',
          //       ConvertUtils.dateToString(protocolTherapeuticPlan.protocol.initialValidity, false),
          //       protocolTherapeuticPlan.protocol.finalValidity
          //         ? ' à ' +
          //           ConvertUtils.dateToString(protocolTherapeuticPlan.protocol.finalValidity, false)
          //         : ' em diante',
          //     ].join('');
          //     register.patientId = medicalAppointment.patientId;
          //     register.requestDate = protocolTherapeuticPlan.requestDate;
          //     register.answeredDate = protocolTherapeuticPlan.answeredDate;
          //     register.resultsDescription = ['Descrição resumida dos resultadados'];
          //     registers.push(register);
          //   }
          // );
        }
      });
    });
    let orderByFilters = options.orderByFilters
      .filter((orderBy) => orderBy.field && orderBy.typeOrder && orderBy.orderPriority > 0)
      .sort((orderBy1, orderBy2) => orderBy1.orderPriority - orderBy2.orderPriority);
    orderByFilters.forEach((orderBy) => {
      registers = registers.sort((register1, register2) => {
        return orderBy.typeOrder == 'asc'
          ? ConvertUtils.getAsString((<any>register1)[orderBy.field]).localeCompare(
              ConvertUtils.getAsString((<any>register2)[orderBy.field])
            )
          : ConvertUtils.getAsString((<any>register1)[orderBy.field]).localeCompare(
              ConvertUtils.getAsString((<any>register2)[orderBy.field])
            );
      });
    });
    let totalRegisters = registers.length;
    return of({
      totalRegisters: totalRegisters,
      registers: registers.splice((options.page - 1) * options.pageSize, options.pageSize),
    } as SearchReturn);
  }
  search(options: TherapeuticPlanOptions): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  loadTherapists(
    therapeuticPlanId: number,
    medicalAppointmentId: number
  ): Observable<SelectOptionExtraAttributeModel<string, string, string>[]> {
    return this.requestService.makeGet(
      this.getUrl('therapists'),
      undefined,
      ...new UrlParameterBuilder()
        .add('therapeuticPlanId', therapeuticPlanId)
        .add('medicalAppointmentId', medicalAppointmentId)
        .build()
        .filter((p) => !!p.value)
    );
  }
}
