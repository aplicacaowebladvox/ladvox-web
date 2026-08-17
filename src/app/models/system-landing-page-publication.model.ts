import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface SystemLandingPagePublicationModel {
  id: number;
  title: string;
  url: string;
  urlDisplay: string;
  bibliographicReference: string;
  publicationAbstract: string;
}

export function FormOfSystemLandingPagePublicationModel(
  model?: SystemLandingPagePublicationModel
): FormGroup {
  model = model || ({} as SystemLandingPagePublicationModel);

  return new FormBuilder().group({
    id: [model.id],
    title: [model.title, Validators.compose([Validators.required, Validators.maxLength(255)])],
    url: [model.url, Validators.compose([Validators.required, Validators.maxLength(255)])],
    urlDisplay: [
      model.urlDisplay,
      Validators.compose([Validators.required, Validators.maxLength(255)]),
    ],
    bibliographicReference: [
      model.bibliographicReference,
      Validators.compose([Validators.required, Validators.maxLength(255)]),
    ],
    publicationAbstract: [model.publicationAbstract],
  });
}

export function SystemLandingPagePublicationModelOfForm(
  form: FormGroup
): SystemLandingPagePublicationModel {
  let model = {} as SystemLandingPagePublicationModel;

  model.id = form.getRawValue().id;
  model.title = form.getRawValue().title;
  model.url = form.getRawValue().url;
  model.urlDisplay = form.getRawValue().urlDisplay;
  model.bibliographicReference = form.getRawValue().bibliographicReference;
  model.publicationAbstract = form.getRawValue().publicationAbstract;

  return model;
}
