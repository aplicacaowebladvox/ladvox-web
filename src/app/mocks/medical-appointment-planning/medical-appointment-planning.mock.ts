import { TeamMedicalAppointmentPlanningMock } from './team-medical-appointment-planning.mock';
import { MedicalAppointmentPlanningModel } from '../../models/medical-appointment-planning.model';
import { TeamMedicalAppointmentPlanningModel } from '../../models/team-medical-appointment-planning.model';
import { stringToDate } from '../../modules/shared/utils/date.util';
import { MedicalAppointmentModel } from '../../models/medical-appointment.model';
import { MedicalAppointmentMock } from './medical-appointment.mock';
import { MedicalAppointmentPlanningOptions } from '../../models/options/medical-appointment-planning.options';
import { Observable, of } from 'rxjs';
import { SearchReturn } from '../../core/models/search-return.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';

export class MedicalAppointmentPlanningMock {
  static Appointment_Planning_1: MedicalAppointmentPlanningModel = {
    id: 1,
    name: 'Planejamento 1',
    initialValidity: stringToDate('2024-01-01'),
    finalValidity: stringToDate('2024-06-31'),
    teams: [
      TeamMedicalAppointmentPlanningMock.TEAM_1,
      TeamMedicalAppointmentPlanningMock.TEAM_2,
      TeamMedicalAppointmentPlanningMock.TEAM_3,
    ] as TeamMedicalAppointmentPlanningModel[],
    medicalAppointments: [
      MedicalAppointmentMock.APPOINTMENT_1,
      MedicalAppointmentMock.APPOINTMENT_2,
      MedicalAppointmentMock.APPOINTMENT_3,
    ] as MedicalAppointmentModel[],
  } as MedicalAppointmentPlanningModel;

  static getAll(): MedicalAppointmentPlanningModel[] {
    return [this.Appointment_Planning_1];
  }
  static getById(id: number): Observable<MedicalAppointmentPlanningModel> {
    let medicalAppointmentPlanning = this.getAll().find((map) => map.id == id);
    if (!medicalAppointmentPlanning) throw new Error('MedicalAppointmentPlanningModel not found.');
    else return of(medicalAppointmentPlanning);
  }

  static search(options: MedicalAppointmentPlanningOptions): Observable<SearchReturn> {
    let registers = this.getAll().filter((register) => {
      return (
        (!options.id || register.id == options.id) &&
        (!options.name ||
          register.name.toLocaleLowerCase().includes(options.name.toLocaleLowerCase())) &&
        (!options.initialValidityStarts ||
          register.initialValidity >= options.initialValidityStarts) &&
        (!options.initialValidityEnds || register.initialValidity <= options.initialValidityEnds) &&
        (!options.finalValidityStarts || register.finalValidity >= options.finalValidityStarts) &&
        (!options.finalValidityEnds || register.finalValidity <= options.finalValidityEnds) &&
        (!options.teamName ||
          register.teams.some((t) =>
            t.name.toLowerCase().includes(options.teamName.toLocaleLowerCase())
          )) &&
        (!options.room ||
          register.medicalAppointments.some((ma) =>
            ma.room.toLowerCase().includes(options.room.toLocaleLowerCase())
          )) &&
        (!options.patientId ||
          register.medicalAppointments.some((ma) => ma.patientId == options.patientId))
      );
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
}
