import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseStore } from '../abstractions/base.store';
import { SelectOptionExtraAttributeModel } from '../models/select-option.model';

@Injectable()
export class GenderStore extends BaseStore {
  constructor() {
    super('gender');
  }
  getSelectOptions(): Observable<SelectOptionExtraAttributeModel<number, string, boolean>[]> {
    return this.requestService.makeGet(this.getUrl('select-options'));
  }
}
