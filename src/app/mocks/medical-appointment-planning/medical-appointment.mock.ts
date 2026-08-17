import { TeamMedicalAppointmentPlanningMock } from './team-medical-appointment-planning.mock';
import { MedicalAppointmentModel } from '../../models/medical-appointment.model';
import { PatientModelMock } from '../patient/patient.mock';
import { TherapeuticPlanModel } from '../../models/therapeutic-plan.model';
import { TherapeuticPlanTextModel } from '../../models/therapeutic-plan-text.model';
import { ProtocolTherapeuticPlanModel } from '../../models/protocol-therapeutic-plan.model';
import { WeekdayEnum } from '../../models/enum/weekday.enum';
import { ProtocolMock } from '../../models/protocols.mock';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { UserModel } from '../../models/user.model';

export class MedicalAppointmentMock {
  static APPOINTMENT_1: MedicalAppointmentModel = {
    id: 1,
    teamId: TeamMedicalAppointmentPlanningMock.TEAM_1.id,
    room: 'SALA 1',
    patientId: PatientModelMock.Marcelo_Kaique_Marcio_Monteiro.id,
    consultDate: '',
    therapeuticPlanId: 1,
    weekDay: WeekdayEnum.TUESDAY,
    hour: '14:00',
    observation: '',
  } as MedicalAppointmentModel;

  static APPOINTMENT_2: MedicalAppointmentModel = {
    id: 2,
    teamId: TeamMedicalAppointmentPlanningMock.TEAM_2.id,
    room: 'SALA 2',
    patientId: PatientModelMock.Catarina_Josefa_Fogaca.id,
    weekDay: WeekdayEnum.TUESDAY,
    hour: '14:00',
    therapeuticPlanId: 2,
  } as MedicalAppointmentModel;

  static APPOINTMENT_3: MedicalAppointmentModel = {
    id: 3,
    teamId: TeamMedicalAppointmentPlanningMock.TEAM_3.id,
    room: 'SALA 3',
    patientId: PatientModelMock.Catarina_Sara_Lorena_Almada.id,
    weekDay: WeekdayEnum.TUESDAY,
    hour: '14:00',
    therapeuticPlanId: 3,
  } as MedicalAppointmentModel;
}
