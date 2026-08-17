import { inject } from '@angular/core';
import { RequestService } from '../services/request.provided.service';
import { environment } from '../../../environments/environment';

export abstract class BaseStore {
  protected baseController: string;
  protected requestService: RequestService;

  constructor(baseControllerName: string) {
    this.requestService = inject(RequestService);
    this.requestService.apiUrl = environment.config.apiUrl;

    this.baseController = baseControllerName;
  }

  protected getUrl(action: string) {
    return `${this.baseController}/${action}`;
  }
}
