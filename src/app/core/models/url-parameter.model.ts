export class UrlParameterModel {
  constructor(
    public key: string,
    public value: Object
  ) {}
}

export class UrlParameterBuilder {
  private urlParams: UrlParameterModel[];
  constructor() {
    this.urlParams = [];
  }

  add(key: string, value: Object): UrlParameterBuilder {
    this.urlParams.push(new UrlParameterModel(key, value));
    return this;
  }

  build(): UrlParameterModel[] {
    return this.urlParams;
  }
}
