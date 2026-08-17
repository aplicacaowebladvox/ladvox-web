export interface SelectOptionModel<ID, NAME> {
  id: ID;
  name: NAME;
}

export interface SelectOptionExtraAttributeModel<ID, NAME, EXTRA> {
  id: ID;
  name: NAME;
  extraAttribute: EXTRA;
}
