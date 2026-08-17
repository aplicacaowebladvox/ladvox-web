import { AttachmentModel } from './../../models/attachment.model';
import { Injectable } from '@angular/core';
import { BaseStore } from '../abstractions/base.store';
import { Observable } from 'rxjs';

@Injectable()
export class AttachmentStore extends BaseStore {
  constructor() {
    super('attachment');
  }

  save(model: AttachmentModel): Observable<AttachmentModel> {
    return this.requestService.makePost(this.getUrl(''), { data: model });
  }
}
