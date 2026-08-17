import { Observable, of } from 'rxjs';
import { SearchReturn } from '../../core/models/search-return.model';
import { PatientOptionsModel } from '../../models/options/patient.options';
import { PatientModel } from '../../models/patient.model';
import { stringToDate } from '../../modules/shared/utils/date.util';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';

export class PatientModelMock {
  static Marcelo_Kaique_Marcio_Monteiro: PatientModel = {
    id: 1,
    name: 'Marcelo Kaique Márcio Monteiro',
    document: '15690450898',
    birthDate: stringToDate('1951-05-05'),
  } as PatientModel;

  static Renata_Betina_Clarice_Porto: PatientModel = {
    id: 2,
    name: 'Renata Betina Clarice Porto',
    document: '47563742638',
    birthDate: stringToDate('2003-01-19'),
  } as PatientModel;

  static Catarina_Josefa_Fogaca: PatientModel = {
    id: 2,
    name: 'Catarina Josefa Fogaça',
    document: '34121694716',
    birthDate: stringToDate('1944-07-05'),
  } as PatientModel;

  static Maria_Lorena_Leticia_Ramos: PatientModel = {
    id: 2,
    name: 'Maria Lorena Letícia Ramos',
    document: '97678611811',
    birthDate: stringToDate('1989-02-13'),
  } as PatientModel;

  static Felipe_Leonardo_Noah_Caldeira: PatientModel = {
    id: 2,
    name: 'Felipe Leonardo Noah Caldeira',
    document: '35956637722',
    birthDate: stringToDate('1953-05-26'),
  } as PatientModel;

  static Catarina_Sara_Lorena_Almada: PatientModel = {
    id: 2,
    name: 'Catarina Sara Lorena Almada',
    document: '28763738406',
    birthDate: stringToDate('1956-07-05'),
  } as PatientModel;

  static Helena_Malu_Castro: PatientModel = {
    id: 2,
    name: 'Helena Malu Castro',
    document: '62211894976',
    birthDate: stringToDate('1975-04-07'),
  } as PatientModel;

  static Matheus_Kevin_Theo_Almada: PatientModel = {
    id: 2,
    name: 'Matheus Kevin Theo Almada',
    document: '94366017350',
    birthDate: stringToDate('2005-06-05'),
  } as PatientModel;

  static Luana_Bianca_Bruna_Rodrigues: PatientModel = {
    id: 2,
    name: 'Luana Bianca Bruna Rodrigues',
    document: '98752758672',
    birthDate: stringToDate('2005-03-23'),
  } as PatientModel;

  static Tiago_Filipe_Cardoso: PatientModel = {
    id: 2,
    name: 'Tiago Filipe Cardoso',
    document: '14172135900',
    birthDate: stringToDate('200-01-15'),
  } as PatientModel;

  static Luiz_Rafael_Rodrigues: PatientModel = {
    id: 2,
    name: 'Luiz Rafael Rodrigues',
    document: '87720615450',
    birthDate: stringToDate('1966-06-19'),
  } as PatientModel;

  static Levi_Fernando_da_Mota: PatientModel = {
    id: 2,
    name: 'Levi Fernando da Mota',
    document: '53651962288',
    birthDate: stringToDate('1974-02-19'),
  } as PatientModel;

  static Alessandra_Antonia_Santos: PatientModel = {
    id: 2,
    name: 'Alessandra Antônia Santos',
    document: '90616310331',
    birthDate: stringToDate('1998-02-21'),
  } as PatientModel;

  static getAll(): PatientModel[] {
    return [
      this.Marcelo_Kaique_Marcio_Monteiro,
      this.Renata_Betina_Clarice_Porto,
      this.Catarina_Josefa_Fogaca,
      this.Maria_Lorena_Leticia_Ramos,
      this.Felipe_Leonardo_Noah_Caldeira,
      this.Catarina_Sara_Lorena_Almada,
      this.Helena_Malu_Castro,
      this.Matheus_Kevin_Theo_Almada,
      this.Luana_Bianca_Bruna_Rodrigues,
      this.Tiago_Filipe_Cardoso,
      this.Levi_Fernando_da_Mota,
      this.Alessandra_Antonia_Santos,
    ];
  }
  static getById(id: number): Observable<PatientModel> {
    let patient = this.getAll().find((p) => p.id == id);
    if (!patient) throw new Error('Patient not found');
    return of(patient);
  }
  static search(options: PatientOptionsModel): Observable<SearchReturn> {
    let today = new Date();
    let registers = this.getAll().filter((patient) => {
      return (
        (!options.id || patient.id == options.id) &&
        (!options.name ||
          patient.name.toLocaleLowerCase().includes(options.name.toLocaleLowerCase())) &&
        (!options.document || patient.document.includes(options.document)) &&
        (!options.ageStarts ||
          !patient.birthDate ||
          patient.birthDate <=
            new Date(today.getFullYear() - options.ageStarts, today.getMonth(), today.getDate())) &&
        (!options.ageEnds ||
          !patient.birthDate ||
          patient.birthDate >=
            new Date(today.getFullYear() - options.ageEnds, today.getMonth(), today.getDate()))
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
