export interface MedicalAppointmentPlanningGrid {
  id: number;
  name: string;
  initialValidity: Date;
  finalValidity: Date | null;
  finalValidityEnds: Date | null;
}
