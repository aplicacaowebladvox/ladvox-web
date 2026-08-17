import { RequestAppointmentModel } from '../../models/request-appointment.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { UserModelMock } from '../user/user.mock';

export class RequestAppointmentMock {
  static Fernanda_Tatiane_Isis_Mendes: RequestAppointmentModel = {
    id: 1,
    name: 'Fernanda Tatiane Isis Mendes',
    email: 'fernanda.tatiane.mendes@trevorh.com.br',
    phone1: '62999652250',
    phone2: '6228554188',
    problemDescription: 'Lorem ...',
    createdDate: ConvertUtils.stringToDate('2023-12-21'),
    conclusionDate: ConvertUtils.stringToDate('2024-02-21'),
    userOfConclusionId: UserModelMock.EMILLY_JOANA_CLARICE_NOGUEIRA.id.toString(),
    userOfConclusionName: UserModelMock.EMILLY_JOANA_CLARICE_NOGUEIRA.name,
  } as RequestAppointmentModel;

  static Antonella_Amanda_Santos: RequestAppointmentModel = {
    id: 2,
    name: 'Antonella Amanda Santos',
    email: 'antonella.amanda.santos@hawk.com.br',
    phone1: '68991759124',
    phone2: '6826869545',
    problemDescription: 'Lorem ...',
    createdDate: ConvertUtils.stringToDate('2024-07-26'),
  } as RequestAppointmentModel;

  static getAll(): RequestAppointmentModel[] {
    return [this.Fernanda_Tatiane_Isis_Mendes, this.Antonella_Amanda_Santos];
  }
}
