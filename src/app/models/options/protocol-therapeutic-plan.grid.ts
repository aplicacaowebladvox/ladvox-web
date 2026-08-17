
export interface ProtocolTherapeuticPlanGrid {
  id: number;
  protocolId: number;
  protocolDescription: string
  patientId: number;
  requestDate: Date;
  answeredDate: Date;
  resultsDescription: string[];
}
