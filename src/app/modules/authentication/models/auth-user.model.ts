export interface AuthUserModel {

  exp: number

  sub: string;
  id: string;
  name: string;
  roles: string[];
  permissions: string[];
}
