import { Observable } from 'rxjs';
import { AttachmentModel } from '../../models/attachment.model';

export interface IAttachmentStore {
  findAllByEntityId(entityId: number | string): Observable<AttachmentModel[]>;
  saveForEntityId(
    entityId: number | string,
    attachment: AttachmentModel
  ): Observable<AttachmentModel>;
  delete(id: number): Observable<void>;
}
