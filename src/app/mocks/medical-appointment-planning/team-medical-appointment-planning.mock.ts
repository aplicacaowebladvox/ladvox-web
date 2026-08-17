import { TeamMedicalAppointmentPlanningModel } from '../../models/team-medical-appointment-planning.model';
import { UserModel } from '../../models/user.model';
import { UserModelMock } from '../user/user.mock';

export class TeamMedicalAppointmentPlanningMock {
  static TEAM_1: TeamMedicalAppointmentPlanningModel = {
    id: 1,
    name: 'Equipe 1',
    color: '#F5D636',
    therapistsIds: [
      UserModelMock.EMILLY_JOANA_CLARICE_NOGUEIRA.id.toString(),
      UserModelMock.JESSICA_DAIANE_BENEDITA_BERNARDES.id.toString(),
      UserModelMock.CARLOS_EDUARDO_RUAN_DIAS.id.toString(),
    ] as string[],
  } as TeamMedicalAppointmentPlanningModel;
  static TEAM_2: TeamMedicalAppointmentPlanningModel = {
    id: 2,
    name: 'Equipe 2',
    color: '#36DEF5',
    therapistsIds: [
      UserModelMock.GABRIEL_YAGO_OTAVIO_CAMPOS.id.toString(),
      UserModelMock.LUCCA_ELIAS_BENTO_MONTEIRO.id.toString(),
      UserModelMock.ISADORA_FATIMA_BERNARDES.id.toString(),
    ] as string[],
  } as TeamMedicalAppointmentPlanningModel;
  static TEAM_3: TeamMedicalAppointmentPlanningModel = {
    id: 3,
    name: 'Equipe 3',
    color: '#F53688',
    therapistsIds: [
      UserModelMock.EMILLY_JOANA_CLARICE_NOGUEIRA.id.toString(),
      UserModelMock.ALEXANDRE_EDUARDO_TOMAS_VIANA.id.toString(),
      UserModelMock.OLIVIA_BEATRIZ_REBECA_DA_SILVA.id.toString(),
    ] as string[],
  } as TeamMedicalAppointmentPlanningModel;
}
