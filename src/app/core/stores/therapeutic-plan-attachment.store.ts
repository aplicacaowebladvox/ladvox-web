import { Injectable } from '@angular/core';
import { BaseStore } from '../abstractions/base.store';
import { IAttachmentStore } from './I-attachment.store';
import { map, Observable } from 'rxjs';
import { AttachmentModel } from '../../models/attachment.model';
import { TherapeuticPlanAttachmentModel } from '../../models/therapeutic-plan-attachment.model';

@Injectable()
export class TherapeuticPlanAttachmentStore extends BaseStore implements IAttachmentStore {
  constructor() {
    super('therapeutic-plan-attachment');
  }

  getAllBy(therapeuticPlanId: number): Observable<TherapeuticPlanAttachmentModel[]> {
    return this.requestService.makeGet(this.getUrl(`therapeutic-plan/${therapeuticPlanId}`));
  }
  saveNewForTherapeuticPlan(
    therapeuticPlanId: number,
    model: AttachmentModel
  ): Observable<TherapeuticPlanAttachmentModel> {
    return this.requestService.makePost(this.getUrl(`therapeutic-plan/${therapeuticPlanId}`), {
      data: model,
    });
  }
  deleteByAttachment(attachmentId: number): Observable<void> {
    return this.requestService.makeDelete(this.getUrl(`attachment/${attachmentId}`));
  }
  findAllByEntityId(entityId: number | string): Observable<AttachmentModel[]> {
    return this.getAllBy(Number.parseInt('' + entityId)).pipe(
      map((therapeuticPlanAttachments) =>
        therapeuticPlanAttachments.map(
          (therapeuticPlanAttachment) => therapeuticPlanAttachment.attachment as AttachmentModel
        )
      )
    );
  }
  saveForEntityId(
    entityId: number | string,
    attachment: AttachmentModel
  ): Observable<AttachmentModel> {
    return this.saveNewForTherapeuticPlan(Number.parseInt(entityId + ''), attachment).pipe(
      map((therapeuticPlanAttachments) => therapeuticPlanAttachments.attachment as AttachmentModel)
    );
  }
  delete(attachmentId: number): Observable<void> {
    return this.deleteByAttachment(attachmentId);
  }
}
