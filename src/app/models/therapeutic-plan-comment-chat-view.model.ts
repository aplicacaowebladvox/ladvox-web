import { AttachmentModel } from './attachment.model';

export interface TherapeuticPlanCommentChatViewModel {
  id: number;
  therapeuticPlanId: number;
  userId: string;
  userName: string;
  userProfileImage: AttachmentModel;
  createdDate: Date;
  textComment: string;
}
