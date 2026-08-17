import { Observable, of } from 'rxjs';
import { UserOptionsModel } from '../../models/options/user.options';
import { UserModel } from '../../models/user.model';
import { RoleModelMock } from './paper-user.mock';
import { SearchReturn } from '../../core/models/search-return.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { RoleModel } from '../../models/role.model';

export class UserModelMock {
  static MARLAN_JOVENCIO: UserModel = {
    id: 1,
    name: 'Marlan Jovencio',
    document: '18684346726',
    roles: [RoleModelMock.Admin] as RoleModel[],
  } as UserModel;

  static EMILLY_JOANA_CLARICE_NOGUEIRA: UserModel = {
    id: 2,
    name: 'Emilly Joana Clarice Nogueira',
    document: '33594901181',
    showOnLandingPage: true,
    roles: [RoleModelMock.ChiefTherapist] as RoleModel[],
  } as UserModel;
  static GABRIEL_YAGO_OTAVIO_CAMPOS: UserModel = {
    id: 9,
    name: 'Gabriel Yago Otávio Campos',
    document: '39615879738',
    showOnLandingPage: true,
    roles: [RoleModelMock.ChiefTherapist] as RoleModel[],
  } as UserModel;

  static JESSICA_DAIANE_BENEDITA_BERNARDES: UserModel = {
    id: 3,
    name: 'Jéssica Daiane Benedita Bernardes',
    document: '50650348427',
    showOnLandingPage: true,
    roles: [RoleModelMock.TraineeTherapist] as RoleModel[],
  } as UserModel;
  static CARLOS_EDUARDO_RUAN_DIAS: UserModel = {
    id: 4,
    name: 'Carlos Eduardo Ruan Dias',
    document: '12114440583',
    showOnLandingPage: true,
    roles: [RoleModelMock.TraineeTherapist] as RoleModel[],
  } as UserModel;
  static LUCCA_ELIAS_BENTO_MONTEIRO: UserModel = {
    id: 5,
    name: 'Lucca Elias Bento Monteiro',
    document: '80373708793',
    showOnLandingPage: true,
    roles: [RoleModelMock.TraineeTherapist] as RoleModel[],
  } as UserModel;
  static ISADORA_FATIMA_BERNARDES: UserModel = {
    id: 6,
    name: 'Isadora Fátima Bernardes',
    document: '44976583252',
    showOnLandingPage: true,
    roles: [RoleModelMock.TraineeTherapist] as RoleModel[],
  } as UserModel;
  static ALEXANDRE_EDUARDO_TOMAS_VIANA: UserModel = {
    id: 7,
    name: 'Alexandre Eduardo Tomás Viana',
    document: '65782664967',
    showOnLandingPage: true,
    roles: [RoleModelMock.TraineeTherapist] as RoleModel[],
  } as UserModel;
  static OLIVIA_BEATRIZ_REBECA_DA_SILVA: UserModel = {
    id: 8,
    name: 'Olivia Beatriz Rebeca da Silva',
    document: '91210870673',
    showOnLandingPage: true,
    roles: [RoleModelMock.TraineeTherapist] as RoleModel[],
  } as UserModel;

  static getAll(): UserModel[] {
    return [
      this.MARLAN_JOVENCIO,
      this.EMILLY_JOANA_CLARICE_NOGUEIRA,
      this.GABRIEL_YAGO_OTAVIO_CAMPOS,
      this.JESSICA_DAIANE_BENEDITA_BERNARDES,
      this.CARLOS_EDUARDO_RUAN_DIAS,
      this.LUCCA_ELIAS_BENTO_MONTEIRO,
      this.ISADORA_FATIMA_BERNARDES,
      this.ALEXANDRE_EDUARDO_TOMAS_VIANA,
      this.OLIVIA_BEATRIZ_REBECA_DA_SILVA,
    ];
  }

  static getAllTraineeTherapist(): UserModel[] {
    return [
      this.JESSICA_DAIANE_BENEDITA_BERNARDES,
      this.CARLOS_EDUARDO_RUAN_DIAS,
      this.LUCCA_ELIAS_BENTO_MONTEIRO,
      this.ISADORA_FATIMA_BERNARDES,
      this.ALEXANDRE_EDUARDO_TOMAS_VIANA,
      this.OLIVIA_BEATRIZ_REBECA_DA_SILVA,
    ];
  }

  static search(options: UserOptionsModel): Observable<SearchReturn> {
    let registers = this.getAll().filter((user) => {
      return (
        (!options.id || user.id == options.id) &&
        (!options.name ||
          user.name.toLocaleLowerCase().includes(options.name.toLocaleLowerCase())) &&
        (!options.document || user.document.includes(options.document))
        // && (!options.roleIds || user.roles.findIndex((userPaper) => userPaper.id == options.paper?.id))
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
