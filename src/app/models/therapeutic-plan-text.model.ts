import { FormBuilder, FormGroup } from '@angular/forms';
import { UserModel } from './user.model';

export interface TherapeuticPlanTextModel {
  id: number;
  userId: number;
  user: UserModel;
  text: string;
}

export function FormOfTherapeuticPlanTextModel(model?: TherapeuticPlanTextModel): FormGroup {
  model = model || ({} as TherapeuticPlanTextModel);
  return new FormBuilder().group({
    id: [model.id],
    userId: [model.user.id],
    user: [model.user],
    text: [model.text],
  });
}

export function TherapeuticPlanTextModelOfForm(form: FormGroup): TherapeuticPlanTextModel {
  let model = {} as TherapeuticPlanTextModel;

  model.id = form.getRawValue().id;
  model.userId = form.getRawValue().userId;
  model.user = form.getRawValue().user;
  model.text = form.getRawValue().text;

  return model;
}
