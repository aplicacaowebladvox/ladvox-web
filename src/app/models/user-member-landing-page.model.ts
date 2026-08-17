import { AttachmentModel } from './attachment.model';

export interface UserMemberLandingPageModel {
  id: string;
  name: string;
  profileImage: AttachmentModel;
  roles: string[];
}
