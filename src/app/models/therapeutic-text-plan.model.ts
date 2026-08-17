import { FormBuilder, FormGroup } from '@angular/forms';

export interface TherapeuticTextPlanModel {
  currentUserEditorId: string;
  therapeuticTextPlan: string;
}

export function FormOfTherapeuticTextPlanModel(model?: TherapeuticTextPlanModel): FormGroup {
  model = model || ({} as TherapeuticTextPlanModel);
  return new FormBuilder().group({
    currentUserEditorId: [model.currentUserEditorId],
    therapeuticTextPlan: [model.therapeuticTextPlan],
  });
}

export function TherapeuticTextPlanModelOfForm(form: FormGroup): TherapeuticTextPlanModel {
  let model = {} as TherapeuticTextPlanModel;

  model.currentUserEditorId = form.getRawValue().currentUserEditorId;
  model.therapeuticTextPlan = form.getRawValue().therapeuticTextPlan;

  return model;
}
