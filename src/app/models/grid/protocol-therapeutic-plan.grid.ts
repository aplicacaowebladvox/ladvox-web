export interface ProtocolTherapeuticPlanGrid {
  id: number;
  therapeuticPlanId: number;
  protocolId: number;
  protocolDescription: string;
  patientId: number;
  requestDate: Date;
  answeredDate: Date;
  resultsDescription: string[];
}
