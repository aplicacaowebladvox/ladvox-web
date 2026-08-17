export interface RequestAppointmentGrid {
  id: number;
  name: string;
  email: string;
  phone1: string;
  phone2: string;
  createdDate: Date;
  conclusionDate: Date;
  userOfConclusionId?: number;
  userOfConclusionName?: string;
}
