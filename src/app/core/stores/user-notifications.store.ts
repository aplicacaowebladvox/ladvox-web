import { Injectable } from '@angular/core';
import { BaseStore } from '../abstractions/base.store';
import { Observable } from 'rxjs';

@Injectable()
export class UserNotificationStore extends BaseStore {
  constructor() {
    super('user-notification');
  }
  findNotifications(): Observable<any[]> {
    return this.requestService.makeGet(this.getUrl('filter'));
  }
  markAsRead(id: number): Observable<void> {
    return this.requestService.makePatch(this.getUrl(`${id}/mark-as-read`));
  }
  delete(id: number): Observable<void> {
    return this.requestService.makeDelete(this.getUrl(`${id}`));
  }
}
