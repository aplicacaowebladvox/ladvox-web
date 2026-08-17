import { FormBuilder, FormGroup } from '@angular/forms';

export interface SystemLandingPageArticleModel {
  id: number;
  article: string;
  title: string;
}

export function FormOfSystemLandingPageArticleModel(
  model?: SystemLandingPageArticleModel
): FormGroup {
  model = model || ({} as SystemLandingPageArticleModel);

  return new FormBuilder().group({
    id: [model.id],
    article: [model.article],
    title: [model.title],
  });
}

export function SystemLandingPageArticleModelOfForm(
  form: FormGroup
): SystemLandingPageArticleModel {
  let model = {} as SystemLandingPageArticleModel;

  model.id = form.getRawValue().id;
  model.article = form.getRawValue().article;
  model.title = form.getRawValue().title;

  return model;
}
