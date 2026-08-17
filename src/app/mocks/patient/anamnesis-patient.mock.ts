import { Observable, of } from 'rxjs';
import { AnamnesisPatientAttachmentModel } from '../../models/anamnesis-patient-attachment.model';
import { AnamnesisPatientModel } from '../../models/anamnesis-patient.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { UserModelMock } from '../user/user.mock';
import { PatientModelMock } from './patient.mock';
import { SearchReturn } from '../../core/models/search-return.model';
import { AnamnesisPatientOptions } from '../../models/options/anamnesis-patient.options';

export class AnamnesisPatientMock {
  static Marcelo_Kaique_Marcio_Monteiro_1: AnamnesisPatientModel = {
    id: 1,
    patientId: 1,
    patient: PatientModelMock.Marcelo_Kaique_Marcio_Monteiro,
    therapistId: 1,
    therapist: UserModelMock.getAllTraineeTherapist()[0],
    createdDate: ConvertUtils.stringToDate('2024-01-01'),
    anamnesiText: 'Algum texto',
    attachments: [
      {
        id: 1,
        attachment: {
          id: 1,
          createdDate: ConvertUtils.stringToDate('2024-01-01'),
          name: 'Anexo da Anamnese 1',
          type: 'pdf',
        },
      },
      {
        id: 2,
        attachment: {
          id: 2,
          createdDate: ConvertUtils.stringToDate('2024-02-01'),
          name: 'Anexo da Anamnese 2',
          type: 'png',
        },
      },
      {
        id: 3,
        attachment: {
          id: 3,
          createdDate: ConvertUtils.stringToDate('2024-03-01'),
          name: 'Anexo da Anamnese 3',
          type: 'xlsx',
        },
      },
    ] as AnamnesisPatientAttachmentModel[],
  } as AnamnesisPatientModel;
  static Marcelo_Kaique_Marcio_Monteiro_2: AnamnesisPatientModel = {
    id: 2,
    patientId: PatientModelMock.Marcelo_Kaique_Marcio_Monteiro.id,
    patient: PatientModelMock.Marcelo_Kaique_Marcio_Monteiro,
    therapistId: UserModelMock.getAllTraineeTherapist()[1].id,
    therapist: UserModelMock.getAllTraineeTherapist()[1],
    createdDate: ConvertUtils.stringToDate('2024-04-01'),
    anamnesiText: 'Algum texto',
    attachments: [
      {
        id: 5,
        attachment: {
          id: 5,
          createdDate: ConvertUtils.stringToDate('2024-01-01'),
          name: 'Anexo da Anamnese 5',
          type: 'pdf',
        },
      },
      {
        id: 6,
        attachment: {
          id: 6,
          createdDate: ConvertUtils.stringToDate('2024-02-01'),
          name: 'Anexo da Anamnese 6',
          type: 'png',
        },
      },
      {
        id: 7,
        attachment: {
          id: 7,
          createdDate: ConvertUtils.stringToDate('2024-03-01'),
          name: 'Anexo da Anamnese 7',
          type: 'xlsx',
        },
      },
    ] as AnamnesisPatientAttachmentModel[],
  } as AnamnesisPatientModel;
  static Renata_Betina_Clarice_Porto_1: AnamnesisPatientModel = {
    id: 3,
    patientId: PatientModelMock.Renata_Betina_Clarice_Porto.id,
    patient: PatientModelMock.Renata_Betina_Clarice_Porto,
    therapistId: UserModelMock.getAllTraineeTherapist()[1].id,
    therapist: UserModelMock.getAllTraineeTherapist()[1],
    createdDate: ConvertUtils.stringToDate('2024-02-01'),
    anamnesiText: 'Algum texto',
    attachments: [
      {
        id: 4,
        attachment: {
          id: 4,
          createdDate: ConvertUtils.stringToDate('2024-01-01'),
          name: 'Anexo da Anamnese 4',
          type: 'pdf',
        },
      },
    ] as AnamnesisPatientAttachmentModel[],
  } as AnamnesisPatientModel;
  static Catarina_Josefa_Fogaca_1: AnamnesisPatientModel = {
    id: 4,
    patientId: PatientModelMock.Catarina_Josefa_Fogaca.id,
    patient: PatientModelMock.Catarina_Josefa_Fogaca,
    therapistId: UserModelMock.getAllTraineeTherapist()[2].id,
    therapist: UserModelMock.getAllTraineeTherapist()[2],
    createdDate: ConvertUtils.stringToDate('2024-03-01'),
    anamnesiText: 'Algum texto',
    attachments: [] as AnamnesisPatientAttachmentModel[],
  } as AnamnesisPatientModel;
  static Maria_Lorena_Leticia_Ramos_1: AnamnesisPatientModel = {
    id: 5,
    patientId: PatientModelMock.Maria_Lorena_Leticia_Ramos.id,
    patient: PatientModelMock.Maria_Lorena_Leticia_Ramos,
    therapistId: UserModelMock.getAllTraineeTherapist()[2].id,
    therapist: UserModelMock.getAllTraineeTherapist()[2],
    createdDate: ConvertUtils.stringToDate('2024-03-01'),
    anamnesiText: 'Algum texto',
    attachments: [] as AnamnesisPatientAttachmentModel[],
  } as AnamnesisPatientModel;

  static getAll(): AnamnesisPatientModel[] {
    return [
      this.Marcelo_Kaique_Marcio_Monteiro_1,
      this.Marcelo_Kaique_Marcio_Monteiro_2,
      this.Renata_Betina_Clarice_Porto_1,
      this.Catarina_Josefa_Fogaca_1,
      this.Maria_Lorena_Leticia_Ramos_1,
    ];
  }
  static getById(id: number): Observable<AnamnesisPatientModel> {
    let anamnesisPatient = this.getAll().find((anamnesisPatient) => anamnesisPatient.id == id);
    if (!anamnesisPatient) throw new Error('AnamnesisPatient not found.');
    return of(anamnesisPatient);
  }

  static getByPatientId(patientId: number): Observable<AnamnesisPatientModel[]> {
    let anamnesis =
      this.getAll().filter(
        (anamnesisPatientModel) => anamnesisPatientModel.patient.id == patientId
      ) || [];
    return of(anamnesis);
  }
  static search(options: AnamnesisPatientOptions): Observable<SearchReturn> {
    let registers = this.getAll().filter((anamnesi) => {
      return (
        (!options.id || anamnesi.id == options.id) &&
        (!options.patientId || anamnesi.patient.id == options.patientId) &&
        (!options.therapistId || anamnesi.therapist.id == options.therapistId) &&
        (!options.createdDateStarts || anamnesi.createdDate >= options.createdDateStarts) &&
        (!options.createdDateEnds || anamnesi.createdDate <= options.createdDateEnds)
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
