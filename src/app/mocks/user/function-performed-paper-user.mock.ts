import { PermissionModel } from '../../models/permission.model';
import { UserModel } from '../../models/user.model';

export class PermissionModelMock {
  static ProtocolFormNew: PermissionModel = {
    id: '1',
    name: 'Criar Novo Protocolos',
    claim: 'protocol.form.new',
    code: 'protocol.form.new',
  } as PermissionModel;

  static getAll(): PermissionModel[] {
    return [this.ProtocolFormNew];
  }
}
