import { ChooseableUserRoleModel } from '../../modules/authentication/models/chooseable-user-role.model';
import { MenuResponseModel } from './menu-response.model';
import { Md5 } from 'ts-md5';

export class SidebarObjectModel {
  menuResponse!: MenuResponseModel;
  userName!: string;
  userProfileImage!: string;
  viewMode!: ChooseableUserRoleModel;

  static KEY_NAME = Md5.hashStr('___SidebarObjectModel').toString();
  static setOnLocalStorage(sidebarObjectModel: SidebarObjectModel): void {
    localStorage.setItem(this.KEY_NAME, JSON.stringify(sidebarObjectModel));
  }
  static getFromLocalStorage(): SidebarObjectModel {
    return JSON.parse(localStorage.getItem(this.KEY_NAME) || '{}');
  }
  static cleanFromLocalStorage(): void {
    localStorage.removeItem(this.KEY_NAME);
  }
}
