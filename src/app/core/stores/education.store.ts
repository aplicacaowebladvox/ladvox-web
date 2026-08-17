import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseStore } from '../abstractions/base.store';
import { SelectOptionExtraAttributeModel } from '../models/select-option.model';

@Injectable()
export class EducationStore extends BaseStore {
  constructor() {
    super('education');
  }
  getSelectOptions(): Observable<SelectOptionExtraAttributeModel<number, string, boolean>[]> {
    return this.requestService.makeGet(this.getUrl('select-options'));
  }
}
