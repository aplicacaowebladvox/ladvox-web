import { AnamnesisPatientModel } from './anamnesis-patient.model';
import { AttachmentModel } from './attachment.model';

export interface AnamnesisPatientAttachmentModel {
  id: number;
  anamnesisPatientId: number;
  attachment: AttachmentModel;
}
