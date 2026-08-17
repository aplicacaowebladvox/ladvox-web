import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, output, ViewChild } from '@angular/core';
import { AccordionComponent } from '../../../../../core/components/accordion/accordion.component';
import { BaseAccordionContainerConfig } from '../../../../../core/components/accordion/models/base-accordion-container.config';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AcceptedValueAnswerTypeProtocolModel } from '../../../../../models/accepted-value-answer-type-protocol.model';
import { DropdownModule } from 'primeng/dropdown';
import { SplitterModule } from 'primeng/splitter';
import { OrderListModule } from 'primeng/orderlist';
import { AnswerValueTypeEnum } from '../../../../../models/enum/answer-value-type.enum';
import { AnswerTypeProtocolModel } from '../../../../../models/answer-type-protocol.model';
import * as uuid from 'uuid';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { sequence } from '@angular/animations';

@Component({
  selector: 'app-answer-type-tab',
  standalone: true,
  imports: [
    AccordionComponent,
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    SplitterModule,
    OrderListModule,
    FontAwesomeModule,
  ],
  templateUrl: './answer-type-tab.component.html',
  styleUrl: './answer-type-tab.component.scss',
})
export class AnswerTypeTabComponent implements OnInit {
  @Input('answersType')
  answersType!: AnswerTypeProtocolModel[];
  onClickBack = output<void>();
  onClickSave = output<AnswerTypeProtocolModel[] | null>();

  @ViewChild('answersTypeAccordion')
  answersTypeAccordion?: AccordionComponent;
  answersTypeActions?: Array<BaseAccordionContainerConfig>;
  answersTypeFormGroup!: FormGroup[];
  answerTypeItemActions?: Array<BaseAccordionContainerConfig>;
  answerValueTypeItems: Array<AnswerValueTypeEnum> = [AnswerValueTypeEnum.NUMERIC];
  constructor() {
    console.log('AnswerTypeTabComponent.constructor');
  }
  ngOnInit(): void {
    console.log('AnswerTypeTabComponent.ngOnInit');
    if (!this.answersType) return;
    this._initAnswersTypeFormGroup();
    this._initAnswersTypeActions();
    this._initAnswerTypeItemActions();
  }
  clickAddNewAnswerType(): void {
    const newFormGroup = generateNewAnswerTypeFOrmGroup({
      sequence: this.answersTypeFormGroup.length + 1,
    } as AnswerTypeProtocolModel);
    this.answersTypeFormGroup.push(newFormGroup);
    this.answersTypeAccordion?.open();
  }
  canShow(field: string, index?: number): boolean {
    switch (field) {
      case 'formDivUseRangeAnswer':
        return (
          !(index == undefined || index == null || index < 0) &&
          this.answersTypeFormGroup[index].getRawValue().answerValueType ==
            AnswerValueTypeEnum.NUMERIC
        );
      case 'pSplitterAcceptedValueForm':
        return (
          !(index == undefined || index == null || index < 0) &&
          (!this.answersTypeFormGroup[index].getRawValue().useRangeAnswer ||
            (this.answersTypeFormGroup[index].getRawValue().useRangeAnswer &&
              this.answersTypeFormGroup[index].getRawValue().acceptableValues.length < 2))
        );
    }
    return false;
  }
  clickAddAcceptedValue(answersTypeFormGroupIndex: number): void {
    let editingAcceptableValueValue =
      this.answersTypeFormGroup[answersTypeFormGroupIndex].getRawValue()
        .editingAcceptableValueValue;
    let editingAcceptableValuePresentation =
      this.answersTypeFormGroup[answersTypeFormGroupIndex].getRawValue()
        .editingAcceptableValuePresentation;
    const item = {
      key: uuid.v7(),
      value: editingAcceptableValueValue,
      presentation: editingAcceptableValuePresentation,
    } as AcceptedValueAnswerTypeProtocolModel;
    this.answersTypeFormGroup[answersTypeFormGroupIndex].controls['acceptableValues'].setValue([
      ...this.answersTypeFormGroup[answersTypeFormGroupIndex].getRawValue().acceptableValues,
      item,
    ]);
    this.answersTypeFormGroup[answersTypeFormGroupIndex].controls[
      'editingAcceptableValueValue'
    ].setValue(null);
    this.answersTypeFormGroup[answersTypeFormGroupIndex].controls[
      'editingAcceptableValuePresentation'
    ].setValue(null);
  }

  clickRemoveOrderListItem(
    answerTypeIndex: number,
    acceptedValueAnswerTypeProtocolModel: AcceptedValueAnswerTypeProtocolModel
  ) {
    this.answersTypeFormGroup[answerTypeIndex].controls['acceptableValues'].setValue(
      this.answersTypeFormGroup[answerTypeIndex]
        .getRawValue()
        .acceptableValues.filter(
          (acceptableValue: AcceptedValueAnswerTypeProtocolModel) =>
            !(acceptableValue.key == acceptedValueAnswerTypeProtocolModel.key)
        )
    );
  }
  clickBack(): void {
    this.onClickBack.emit();
  }
  clickSaveAndNext(): void {
    this.answersTypeFormGroup.forEach((form, formIndex) => {
      this.answersType[formIndex] = this.answersType[formIndex] || ({} as AnswerTypeProtocolModel);
      this.answersType[formIndex].key = form.getRawValue().key;
      this.answersType[formIndex].id = form.getRawValue().id;
      this.answersType[formIndex].sequence = form.getRawValue().sequence;
      this.answersType[formIndex].name = form.getRawValue().name;
      this.answersType[formIndex].acceptableValues = form.getRawValue().acceptableValues;
      this.answersType[formIndex].useRangeAnswer = form.getRawValue().useRangeAnswer;
      this.answersType[formIndex].answerValueType = form.getRawValue().answerValueType;
    });
    if (this.answersTypeFormGroup.length != this.answersType.length) {
      this.answersType.splice(
        this.answersTypeFormGroup.length - 1,
        this.answersType.length - this.answersTypeFormGroup.length
      );
    }
    this.onClickSave.emit(this.answersType);
  }
  private _initAnswersTypeFormGroup(): void {
    this.answersTypeFormGroup = [];
    this.answersType.forEach((answerType) => {
      this.answersTypeFormGroup.push(generateNewAnswerTypeFOrmGroup(answerType));
    });
    this.answersTypeFormGroup.forEach((form, i) => {
      form.valueChanges.subscribe((value) => {
        this.answersType[i].key = value.key || this.answersType[i].key;
        this.answersType[i].id = value.id || this.answersType[i].id;
        this.answersType[i].sequence = value.sequence || this.answersType[i].sequence;
        this.answersType[i].name = value.name || this.answersType[i].name;
        this.answersType[i].acceptableValues =
          <AcceptedValueAnswerTypeProtocolModel[]>value.acceptableValues ||
          this.answersType[i].acceptableValues;
        this.answersType[i].useRangeAnswer = [undefined, null].includes(value.useRangeAnswer)
          ? this.answersType[i].useRangeAnswer == true
          : value.useRangeAnswer;
        this.answersType[i].answerValueType =
          value.answerValueType || this.answersType[i].answerValueType;
      });
    });
  }
  private _initAnswersTypeActions(): void {
    if (!this.answersTypeActions) this.answersTypeActions = [];
    this.answersTypeActions.push(new NewBaseAccordionContainerConfig(this));
  }
  private _initAnswerTypeItemActions(): void {
    this.answerTypeItemActions = [];
    this.answerTypeItemActions.push(new RemoveBaseAccordionContainerConfig(this));
    this.answerTypeItemActions.push(new MoveUpAnswersTypeFormGroupAccordionContainerConfig(this));
    this.answerTypeItemActions.push(new MoveDownAnswersTypeFormGroupAccordionContainerConfig(this));
  }
}

class NewBaseAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: AnswerTypeTabComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-plus';
    this.tooltip = 'Novo';
  }
  public override click(line: any): void {
    const newFormGroup = generateNewAnswerTypeFOrmGroup({
      sequence: this.parent.answersTypeFormGroup.length + 1,
    } as AnswerTypeProtocolModel);
    this.parent.answersTypeFormGroup.push(newFormGroup);
    this.parent.answersTypeAccordion?.open();
  }
}

class RemoveBaseAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: AnswerTypeTabComponent) {
    super();
    this.position = 3;
    this.iconClass = 'fa-solid fa-trash';
    this.tooltip = 'Remover';
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (this.parent.answersTypeFormGroup.length < index) return;
    this.parent.answersTypeFormGroup.splice(index, 1);
    this.parent.answersTypeFormGroup.forEach((anserTypeFormGroup, i) => {
      anserTypeFormGroup.controls['sequence'].setValue(i + 1);
    });
  }
}

function generateNewAnswerTypeFOrmGroup(
  answerTypeProtocolModel?: AnswerTypeProtocolModel
): FormGroup {
  const formBuilder = new FormBuilder();
  if (!answerTypeProtocolModel) answerTypeProtocolModel = {} as AnswerTypeProtocolModel;
  const newFormGroup = formBuilder.group({
    key: [answerTypeProtocolModel.key || uuid.v7(), []],
    id: [answerTypeProtocolModel.id, []],
    sequence: [answerTypeProtocolModel.sequence, Validators.required],
    name: [
      answerTypeProtocolModel.name,
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255),
      ]),
    ],
    answerValueType: [AnswerValueTypeEnum.NUMERIC, Validators.required],
    useRangeAnswer: [answerTypeProtocolModel.useRangeAnswer == true],
    editingAcceptableValueValue: [null],
    editingAcceptableValuePresentation: [null],
    acceptableValues: [
      (answerTypeProtocolModel.acceptableValues || []) as AcceptedValueAnswerTypeProtocolModel[],
    ],
  });

  newFormGroup.valueChanges.subscribe((value: any) => {
    Object.keys(newFormGroup.controls).forEach((control) => {
      localStorage.setItem(
        'ProtocolsFormComponent#form.' + newFormGroup.getRawValue().key + control,
        value['control']
      );
    });
  });
  return newFormGroup;
}

class MoveUpAnswersTypeFormGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: AnswerTypeTabComponent) {
    super();
    this.position = 1;
    this.iconClass = 'fa-solid fa-angles-up';
    this.tooltip = 'Subir';
  }
  override isVisible(componentId: string): boolean {
    if (!componentId) return false;
    let index = Number.parseInt(componentId);
    if (this.parent.answersTypeFormGroup.length < index || index == 0) return false;
    return true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (this.parent.answersTypeFormGroup.length < index || index == 0) return;
    let hold = this.parent.answersTypeFormGroup[index - 1];
    this.parent.answersTypeFormGroup[index - 1] = this.parent.answersTypeFormGroup[index];
    this.parent.answersTypeFormGroup[index] = hold;
    this.parent.answersTypeFormGroup[index - 1].controls['sequence'].setValue(index);
    this.parent.answersTypeFormGroup[index].controls['sequence'].setValue(index + 1);
  }
}

class MoveDownAnswersTypeFormGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: AnswerTypeTabComponent) {
    super();
    this.position = 2;
    this.iconClass = 'fa-solid fa-angles-down';
    this.tooltip = 'Descer';
  }
  override isVisible(componentId: string): boolean {
    if (!componentId) return false;
    let index = Number.parseInt(componentId);
    if (!this.parent.answersTypeFormGroup[index + 1]) return false;
    return true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (
      this.parent.answersTypeFormGroup.length < index ||
      this.parent.answersTypeFormGroup.length < index + 1
    )
      return;
    let hold = this.parent.answersTypeFormGroup[index + 1];
    this.parent.answersTypeFormGroup[index + 1] = this.parent.answersTypeFormGroup[index];
    this.parent.answersTypeFormGroup[index] = hold;
    this.parent.answersTypeFormGroup[index + 1].controls['sequence'].setValue(index + 2);
    this.parent.answersTypeFormGroup[index].controls['sequence'].setValue(index + 1);
  }
}
