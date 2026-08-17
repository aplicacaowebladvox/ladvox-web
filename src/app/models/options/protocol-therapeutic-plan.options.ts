import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseGridOptions } from '../../modules/shared/components/card-table/models/base-grid-options.model';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';

export interface ProtocolTherapeuticPlanOptions extends BaseGridOptions {
  id: number;
  therapeuticPlanId: number;
  patientId: number;
  protocolId: number;
  requestDateStarts: Date | null;
  requestDateEnds: Date | null;
  answeredDateStarts: Date | null;
  answeredDateEnds: Date | null;
}

export function FormOfProtocolTherapeuticPlanOptions(
  model?: ProtocolTherapeuticPlanOptions
): FormGroup {
  model = model || ({} as ProtocolTherapeuticPlanOptions);
  return new FormBuilder().group({
    id: [model.id],
    therapeuticPlanId: [model.therapeuticPlanId],
    patientId: [model.patientId],
    protocolId: [model.protocolId],
    requestDateStarts: [ConvertUtils.dateToFormControl(model.requestDateStarts)],
    requestDateEnds: [ConvertUtils.dateToFormControl(model.requestDateEnds)],
    answeredDateStarts: [ConvertUtils.dateToFormControl(model.answeredDateStarts)],
    answeredDateEnds: [ConvertUtils.dateToFormControl(model.answeredDateEnds)],
  });
}

export function ProtocolTherapeuticPlanOptionsOfForm(
  form: FormGroup
): ProtocolTherapeuticPlanOptions {
  let model = {} as ProtocolTherapeuticPlanOptions;

  model.id = form.getRawValue().id;
  model.therapeuticPlanId = form.getRawValue().therapeuticPlanId;
  model.patientId = form.getRawValue().patientId;
  model.protocolId = form.getRawValue().protocolId;
  model.requestDateStarts = ConvertUtils.stringToDate(form.getRawValue().requestDateStarts);
  model.requestDateEnds = ConvertUtils.stringToDate(form.getRawValue().requestDateEnds);
  model.answeredDateStarts = ConvertUtils.stringToDate(form.getRawValue().answeredDateStarts);
  model.answeredDateEnds = ConvertUtils.stringToDate(form.getRawValue().answeredDateEnds);

  return model;
}
