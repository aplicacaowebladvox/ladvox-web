  export interface AttachmentModel {
  id: number;
  createdDate: Date;

  name: string;
  bytesSize: number;
  type: string;
  lastModifiedDate: Date;
  base64: string;

  file: any;
  referecedByEntityId: number | string;
}
