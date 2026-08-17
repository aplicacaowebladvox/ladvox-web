export interface TherapeuticPlanBaseDataModel {
  id: number;
  medicalAppointmentId: number;
  medicalAppointmentRoom: string;
  medicalAppointmentWeekDay: string;
  medicalAppointmentHour: string;
  medicalAppointmentPatientId: number;
  medicalAppointmentPatientName: string;
  medicalAppointmentMedicalAppointmentPlanningId: number;
  medicalAppointmentMedicalAppointmentPlanningName: string;
}
