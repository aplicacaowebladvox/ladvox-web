import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchReturn } from '../models/search-return.model';
import { RequestAppointmentOptions } from '../../models/options/request-appointment.optionsl';
import { RequestAppointmentModel } from '../../models/request-appointment.model';
import { BaseStore } from '../abstractions/base.store';

@Injectable()
export class RequestAppointmentStore extends BaseStore {
  constructor() {
    super('request-appointment');
  }
  search(options: RequestAppointmentOptions): Observable<SearchReturn> {
    return this.requestService.makePost(this.getUrl('search'), { data: options });
  }
  getById(id: number): Observable<RequestAppointmentModel> {
    return this.requestService.makeGet(this.getUrl(`${id}`));
  }
  conclude(id: number): Observable<void> {
    return this.requestService.makePatch(this.getUrl(`${id}/conclude`));
  }
}
