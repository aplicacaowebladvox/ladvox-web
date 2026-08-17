import { Md5 } from 'ts-md5';
import { TokenResponseModel } from '../../modules/authentication/models/token-response.model';
import { SecurityStorageNotProvidedService } from './security-storage.not-provided.service';

export class StorageNotProvidedService {
  private storage: SecurityStorageNotProvidedService;
  private tokenKey: string;

  constructor(localStorage: Storage) {
    this.storage = new SecurityStorageNotProvidedService(localStorage);
    this.tokenKey = Md5.hashStr('___token_data_projetofono').toString();
  }

  setAuthTokenModel(authToken: TokenResponseModel | null): void {
    return this.storage.save(this.tokenKey, authToken);
  }
  getAuthTokenModel(): TokenResponseModel {
    return this.storage.get(this.tokenKey);
  }
}
