import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from './user.model';
import { ConvertUtils } from '../modules/shared/utils/convert.utils';
import { CustomValidators } from '../modules/shared/validators/custom.validator';

export interface RequestAppointmentModel {
  id: number;
  name: string;
  email: string;
  phone1: string;
  phone2: string;
  problemDescription: string;
  createdDate: Date | null;
  conclusionDate: Date | null;
  userOfConclusionId?: string;
  userOfConclusionName?: string;
}

export function FormOfRequestAppointmentModel(model?: RequestAppointmentModel): FormGroup {
  model = model || ({} as RequestAppointmentModel);

  return new FormBuilder().group({
    id: [model.id],
    name: [model.name, Validators.compose([Validators.required, Validators.maxLength(120)])],
    email: [model.email, Validators.compose([Validators.required, CustomValidators.mail])],
    phone1: [model.phone1, Validators.compose([Validators.required, CustomValidators.phone])],
    phone2: [model.phone2, Validators.compose([CustomValidators.phone])],
    problemDescription: [model.problemDescription],
    createdDate: [ConvertUtils.dateToFormControl(model.createdDate, true)],
    conclusionDate: [ConvertUtils.dateToFormControl(model.conclusionDate, true)],
    userOfConclusionId: [model.userOfConclusionId],
    userOfConclusionName: [model.userOfConclusionName],
  });
}

export function RequestAppointmentModelOfForm(form: FormGroup): RequestAppointmentModel {
  let model = {} as RequestAppointmentModel;

  model.id = form.getRawValue().id;
  model.name = form.getRawValue().name;
  model.email = form.getRawValue().email;
  model.phone1 = form.getRawValue().phone1;
  model.phone2 = form.getRawValue().phone2;
  model.problemDescription = form.getRawValue().problemDescription;
  model.createdDate = ConvertUtils.stringToDate(form.getRawValue().createdDate, true);
  model.conclusionDate = ConvertUtils.stringToDate(form.getRawValue().conclusionDate, true);
  model.userOfConclusionId = form.getRawValue().userOfConclusionId;
  model.userOfConclusionName = form.getRawValue().userOfConclusionName;
  return model;
}
