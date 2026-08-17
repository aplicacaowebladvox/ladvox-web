import { PermissionModel } from '../../models/permission.model';
import { RoleModel } from '../../models/role.model';
import { PermissionModelMock } from './function-performed-paper-user.mock';

export class RoleModelMock {
  static Admin: RoleModel = {
    id: '1',
    name: 'Administrador',
    permissions: [PermissionModelMock.ProtocolFormNew] as PermissionModel[],
  } as RoleModel;
  static ChiefTherapist: RoleModel = {
    id: '2',
    name: 'Terapeuta Chefe',
    showOnLandingPage: true,
    permissions: [PermissionModelMock.ProtocolFormNew] as PermissionModel[],
  } as RoleModel;
  static TraineeTherapist: RoleModel = {
    id: '3',
    name: 'Terapeuta Estagiário',
    showOnLandingPage: true,
    permissions: [PermissionModelMock.ProtocolFormNew] as PermissionModel[],
  } as RoleModel;
  static Patient: RoleModel = {
    id: '4',
    name: 'Paciente',
    showOnLandingPage: true,
    permissions: [PermissionModelMock.ProtocolFormNew] as PermissionModel[],
  } as RoleModel;

  static getAll(): RoleModel[] {
    return [this.Admin, this.ChiefTherapist, this.TraineeTherapist, this.Patient];
  }
}
