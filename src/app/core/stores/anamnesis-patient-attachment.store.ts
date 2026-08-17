import { AttachmentModel } from '../../models/attachment.model';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { BaseStore } from '../abstractions/base.store';
import { AnamnesisPatientAttachmentModel } from '../../models/anamnesis-patient-attachment.model';
import { IAttachmentStore } from './I-attachment.store';

@Injectable()
export class AnamnesisPatientAttachmentStore extends BaseStore implements IAttachmentStore {
  constructor() {
    super('anamnesis-patient-attachment');
  }
  getAllBy(anamnesisPatientId: number): Observable<AnamnesisPatientAttachmentModel[]> {
    return this.requestService.makeGet(this.getUrl('anamnesis-patient/' + anamnesisPatientId));
  }
  saveNewForAnamnesisPatient(
    anamnesisPatientId: number,
    attachment: AttachmentModel
  ): Observable<AnamnesisPatientAttachmentModel> {
    return this.requestService.makePost(this.getUrl('anamnesis-patient/' + anamnesisPatientId), {
      data: attachment,
    });
  }
  saveNewForPatient(
    patientId: number,
    attachment: AttachmentModel
  ): Observable<AnamnesisPatientAttachmentModel> {
    return this.requestService.makePost(this.getUrl('patient/' + patientId), {
      data: attachment,
    });
  }
  delete(id: number): Observable<void> {
    return this.requestService.makeDelete(this.getUrl('' + id));
  }
  findAllByEntityId(entityId: number | string): Observable<AttachmentModel[]> {
    if (typeof entityId == 'string' && entityId.startsWith('patientId=')) return of([]);
    return this.getAllBy(Number.parseInt('' + entityId)).pipe(
      map((anamnesisPatientAttachments) =>
        anamnesisPatientAttachments.map(
          (anamnesisPatientAttachment) => anamnesisPatientAttachment.attachment as AttachmentModel
        )
      )
    );
  }
  saveForEntityId(
    entityId: number | string,
    attachment: AttachmentModel
  ): Observable<AttachmentModel> {
    if (typeof entityId == 'string' && entityId.startsWith('patientId=')) {
      return this.saveNewForPatient(
        Number.parseInt(entityId.substring(10)),
        attachment
      ).pipe(
        map((anamnesisPatientAttachmentModel) => {
          anamnesisPatientAttachmentModel.attachment.referecedByEntityId =
            anamnesisPatientAttachmentModel.anamnesisPatientId;
          return anamnesisPatientAttachmentModel.attachment as AttachmentModel;
        })
      );
    } else {
      return this.saveNewForAnamnesisPatient(Number.parseInt('' + entityId), attachment).pipe(
        map(
          (anamnesisPatientAttachmentModel) =>
            anamnesisPatientAttachmentModel.attachment as AttachmentModel
        )
      );
    }
  }
}
