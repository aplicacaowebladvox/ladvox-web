import { Injectable } from '@angular/core';
import { BaseStore } from '../abstractions/base.store';
import { Observable } from 'rxjs';
import { TherapeuticPlanCommentChatViewModel } from '../../models/therapeutic-plan-comment-chat-view.model';

@Injectable()
export class TherapeuticPlanCommentStore extends BaseStore {
  constructor() {
    super('therapeutic-plan-comment');
  }

  findAllByTherapeuticPlanId(
    therapeuticPlanId: number
  ): Observable<TherapeuticPlanCommentChatViewModel[]> {
    return this.requestService.makeGet(this.getUrl(`therapeutic-plan/${therapeuticPlanId}`));
  }
  newComment(therapeuticPlanId: number, textComment: string): Observable<void> {
    return this.requestService.makePatch(this.getUrl(`therapeutic-plan/${therapeuticPlanId}`), {
      data: { textComment: textComment },
    });
  }
  delete(id: number): Observable<void> {
    return this.requestService.makeDelete(this.getUrl(`${id}`));
  }
}
