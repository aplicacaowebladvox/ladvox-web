import { AttachmentModel } from './attachment.model';

export interface TherapeuticPlanAttachmentModel {
  id: number;
  therapeuticPlanId: number;
  attachment: AttachmentModel;
}
