import { Query } from './../../../../../../../node_modules/@types/express-serve-static-core/index.d';
import { QuestionGroupProtocolModel } from './../../../../../models/question-group-protocol.model';
import { Component, Input, OnInit, output, ViewChild } from '@angular/core';
import { AccordionComponent } from '../../../../../core/components/accordion/accordion.component';
import { CommonModule } from '@angular/common';
import { BaseAccordionContainerConfig } from '../../../../../core/components/accordion/models/base-accordion-container.config';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as uuid from 'uuid';
import { BaseResultQuestionGroupProtocolModel } from '../../../../../models/base-result-question-group-protocol.model';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';
import { QuestionProtocolModel } from '../../../../../models/question-protocol.model';
import { reduceString } from '../../../../shared/utils/string.util';
import { ChipsModule } from 'primeng/chips';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {
  QuestionGroupProtocolFixedParamsEnum,
  QuestionGroupProtocolFixedParamsOption,
} from '../../../../../models/enum/question-group-protocol-fixed-params.enum';
import { ProtocolCalculatorComponent } from '../../../../../core/components/protocol-calculator/protocol-calculator.component';
import { AnswerTypeProtocolModel } from '../../../../../models/answer-type-protocol.model';

@Component({
  selector: 'app-group-question-tab',
  standalone: true,
  imports: [
    AccordionComponent,
    AutoCompleteModule,
    ChipsModule,
    CommonModule,
    ReactiveFormsModule,
    ToggleButtonModule,
    DragDropModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './group-question-tab.component.html',
  styleUrl: './group-question-tab.component.scss',
})
export class GroupQuestionTabComponent implements OnInit {
  @Input('groups')
  groups!: QuestionGroupProtocolModel[];
  @Input('questions')
  questions!: QuestionProtocolModel[];
  @Input('answersType')
  answersType!: AnswerTypeProtocolModel[];

  @ViewChild('groupAccordion')
  groupAccordion?: AccordionComponent;
  groupActions!: Array<BaseAccordionContainerConfig>;
  groupsFormGroup!: Array<FormGroup>;
  groupItemActions!: Array<BaseAccordionContainerConfig>;
  groupsBaseResultsActions!: Array<BaseAccordionContainerConfig>;
  groupsBaseResultsFormGroup!: Array<FormGroup[]>;
  groupsBaseResultsItemActions!: Array<BaseAccordionContainerConfig>;
  groupFixedParams!: string[];
  groupsFunctionsActions!: Array<BaseAccordionContainerConfig>;
  groupsFunctionsItemActions!: Array<BaseAccordionContainerConfig>;
  onClickBack = output<void>();
  onClickSave = output<QuestionGroupProtocolModel[] | null>();

  drop(
    event: CdkDragDrop<string[]>,
    groupQuestionFunctionResultFunciontonArray: string[],
    groupIndex: number,
    functionIndex: number
  ) {
    moveItemInArray(
      groupQuestionFunctionResultFunciontonArray,
      event.previousIndex,
      event.currentIndex
    );
    this._calculate(groupIndex, functionIndex);
  }

  reduceString = reduceString;
  ngOnInit(): void {
    if (!this.answersType || !this.questions || !this.groups) return;
    this._initGroupsBaseResultsFormGroup();
    this._initGroupsFormGroup();
    this._initGroupActions();
    this._initGroupItemActions();
    this._initGroupsBaseResultsActions();
    this._initGroupsBaseResultsItemActions();
    this._initGroupsFunctionsActions();
    this._initGroupsFunctionsItemActions();
  }
  onCheckGroupQuestion(event: any, question: QuestionProtocolModel) {
    console.log(event);
    console.log(question);
  }
  autoCompleteSearch(event: any, groupQuestionFunction: any) {
    if (!(<string>event.query) || (<string>event.query).length <= 0)
      groupQuestionFunction.suggestions = groupQuestionFunction.groupFixedParams;

    groupQuestionFunction.suggestions = [
      ...(<QuestionGroupProtocolFixedParamsOption[]>groupQuestionFunction.groupFixedParams).filter(
        (gfp) =>
          gfp.key.toLowerCase().includes(event.query.toLowerCase()) ||
          gfp.presentation.toLowerCase().includes(event.query.toLowerCase())
      ),
      {
        questionGroupProtocolModel:
          groupQuestionFunction.groupFixedParams[0].questionGroupProtocolModel,
        key: event.query,
        presentation: event.query,
      },
    ];
  }
  clickAddNewElementOnGroupQuestionFunction(
    groupQuestion: FormGroup,
    groupQuestionFunction: any,
    groupIndex: number,
    functionIndex: number
  ): void {
    const items: string[] = [];
    (<QuestionGroupProtocolFixedParamsOption[]>(
      groupQuestion.getRawValue().functionAddingField
    )).forEach((functionAddingField) =>
      items.push(...mountResultFunction(functionAddingField.key))
    );
    groupQuestionFunction.resultFunciontonArray = [
      ...groupQuestionFunction.resultFunciontonArray,
      ...items,
    ];
    groupQuestion.controls['functionAddingField'].setValue(null);
    this._calculate(groupIndex, functionIndex);
  }
  clickBack(): void {
    this.onClickBack.emit();
  }
  clickSaveAndNext(): void {
    this.groupsFormGroup.forEach((form, i) => {
      this.groups[i] = this.groups[i] || ({} as QuestionGroupProtocolModel);

      this.groups[i].key = form.getRawValue().key;
      this.groups[i].id = form.getRawValue().id;
      this.groups[i].name = form.getRawValue().name;
      this.groups[i].questions = form
        .getRawValue()
        .questions.filter((formControlQuestion: any) => formControlQuestion.checked.value)
        .map((formControlQuestion: any) => formControlQuestion.question);
      this.groups[i].baseResults = form.getRawValue().baseResults;
      this.groups[i].functions = form
        .getRawValue()
        .functions.map((formControlFunction: any) =>
          formControlFunction.resultFunciontonArray.join('')
        );
    });
    this.onClickSave.emit(this.groups);
  }

  values: Array<Array<number[] | null>> = [];
  _getValor(groupIndex: number, functionIndex: number): number[] | null {
    if (!this.values[groupIndex] || !this.values[groupIndex][functionIndex]) {
      this._calculate(groupIndex, functionIndex);
    }
    return !this.values[groupIndex] || !this.values[groupIndex][functionIndex]
      ? null
      : this.values[groupIndex][functionIndex];
  }

  private _calculate(groupIndex: number, functionIndex: number): void {
    if (
      !this.groupsFormGroup[groupIndex] ||
      !this.groupsFormGroup[groupIndex].getRawValue().functions[functionIndex]
    )
      return;
    let groupQuestion = this.groupsFormGroup[groupIndex];
    let groupQuestionFunction = groupQuestion.getRawValue().functions[functionIndex];
    let calulated = ProtocolCalculatorComponent.build(
      this.answersType,
      this.questions,
      this._mountGroup(groupQuestion, groupQuestionFunction),
      true
    ).calculate();
    this.values[groupIndex] = this.values[groupIndex] || [];
    if (!calulated) {
      this.values[groupIndex][functionIndex] = null;
    } else {
      this.values[groupIndex][functionIndex] = calulated.groups[0].sum;
    }
  }

  protected _reCalculate(groupIndex: number, event: ToggleButtonChangeEvent): void {
    console.log(event);
    if (!this.groupsFormGroup[groupIndex]) return;
    (<any[]>this.groupsFormGroup[groupIndex].getRawValue().functions).forEach(
      (f, functionIndex) => {
        this._calculate(groupIndex, functionIndex);
      }
    );
  }
  private _mountGroup(
    groupQuestion: FormGroup,
    groupQuestionFunction: any
  ): QuestionGroupProtocolModel {
    let g = {} as QuestionGroupProtocolModel;

    g.key = groupQuestion.getRawValue().key;
    g.name = groupQuestion.getRawValue().key;
    g.questions = groupQuestion
      .getRawValue()
      .questions.filter((formControlQuestion: any) => formControlQuestion.checked.value)
      .map((formControlQuestion: any) => formControlQuestion.question);
    g.functions = [groupQuestionFunction.resultFunciontonArray.join('')];

    return g;
  }
  clickAddNewGroupQuestion(): void {
    const newFormGroup = generateQuestionGroupProtocolModelFormGroup(undefined, this.questions);
    this.groupsFormGroup.push(newFormGroup);
    this.groupAccordion?.open();

    this.groupsBaseResultsFormGroup.push([]);
  }
  private _initGroupActions(): void {
    this.groupActions = [new NewQuestionGroupAccordionContainerConfig(this)];
  }
  private _initGroupsFormGroup(): void {
    this.groupsFormGroup = this.groupsFormGroup || [];
    this.groups.forEach((group, i) => {
      this.groupsFormGroup.push(generateQuestionGroupProtocolModelFormGroup(group, this.questions));
      this.groupsBaseResultsFormGroup[i] = [];
      (group.baseResults || []).forEach((baseResult: BaseResultQuestionGroupProtocolModel) =>
        this.groupsBaseResultsFormGroup[i].push(
          generateBaseResultQuestionGroupProtocolModelFormGroup(baseResult)
        )
      );
    });
  }
  private _initGroupItemActions(): void {
    this.groupItemActions = [new RemoveQuestionGroupAccordionContainerConfig(this)];
  }
  private _initGroupsBaseResultsActions(): void {
    this.groupsBaseResultsActions = [new NewBaseResultQuestionGroupAccordionContainerConfig(this)];
  }
  private _initGroupsBaseResultsItemActions(): void {
    this.groupsBaseResultsItemActions = [
      new RemoveBaseResultQuestionGroupAccordionContainerConfig(this),
    ];
  }
  private _initGroupsBaseResultsFormGroup(): void {
    this.groupsBaseResultsFormGroup = [];
  }
  private _initGroupsFunctionsActions(): void {
    this.groupsFunctionsActions = [
      new NewResultFunctionQuestionGroupAccordionContainerConfig(this),
    ];
  }
  private _initGroupsFunctionsItemActions(): void {
    this.groupsFunctionsItemActions = [
      new RemoveResultFunctionQuestionGroupAccordionContainerConfig(this),
    ];
  }
}

class NewQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: GroupQuestionTabComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-plus';
    this.tooltip = 'Novo';
  }
  public override click(line: any): void {
    const newFormGroup = generateQuestionGroupProtocolModelFormGroup();
    this.parent.groupsFormGroup.push(newFormGroup);
    this.parent.groupAccordion?.open();

    this.parent.groupsBaseResultsFormGroup.push([]);
  }
}

class RemoveQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: GroupQuestionTabComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-trash';
    this.tooltip = 'Remover';
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (this.parent.groupsFormGroup.length < index) return;
    this.parent.groupsFormGroup.splice(index, 1);
  }
}

class NewBaseResultQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: GroupQuestionTabComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-plus';
    this.tooltip = 'Novo';
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId.split('/*/BaseResult')[0]);
    const newFormGroup = generateBaseResultQuestionGroupProtocolModelFormGroup();
    this.parent.groupsBaseResultsFormGroup[index].push(newFormGroup);
  }
}

class RemoveBaseResultQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: GroupQuestionTabComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-trash';
    this.tooltip = 'Remover';
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let groupIndex = Number.parseInt(componentId.split('/*/')[0]);
    let aggregateGroupIndex = Number.parseInt(componentId.split('/*/')[1]);
    if ((!groupIndex && groupIndex != 0) || (!aggregateGroupIndex && aggregateGroupIndex != 0))
      return;
    if ((this.parent.groupsBaseResultsFormGroup.at(groupIndex) || []).length < aggregateGroupIndex)
      return;
    this.parent.groupsBaseResultsFormGroup.at(groupIndex)!.splice(aggregateGroupIndex, 1);
  }
}

class NewResultFunctionQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: GroupQuestionTabComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-plus';
    this.tooltip = 'Novo';
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId.split('/*/ResultFunction')[0]);
    const newFormGroup = generateFunctionFormControl({
      key: this.parent.groupsFormGroup[index].getRawValue().key,
      name: this.parent.groupsFormGroup[index].getRawValue().name,
      functions: [''],
    } as QuestionGroupProtocolModel);
    this.parent.groupsFormGroup[index].controls['functions'].setValue([
      ...this.parent.groupsFormGroup[index].getRawValue().functions,
      ...newFormGroup,
    ]);
  }
}

class RemoveResultFunctionQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: GroupQuestionTabComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-trash';
    this.tooltip = 'Remover';
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let groupIndex = Number.parseInt(componentId.split('/*/')[0]);
    let functionIndex = Number.parseInt(componentId.split('/*/')[1]);

    if ((!groupIndex && groupIndex != 0) || (!functionIndex && functionIndex != 0)) return;
    if (
      (this.parent.groupsFormGroup[groupIndex].getRawValue().functions.length || []).length <
      functionIndex
    )
      return;
    this.parent.groupsFormGroup[groupIndex].controls['functions'].setValue(
      (<any[]>this.parent.groupsFormGroup[groupIndex].getRawValue().functions).filter(
        (f, i) => i != functionIndex
      )
    );
  }
}

function generateFunctionFormControl(
  questionGroupProtocolModel?: QuestionGroupProtocolModel
): any[] {
  questionGroupProtocolModel = questionGroupProtocolModel || ({} as QuestionGroupProtocolModel);
  return (questionGroupProtocolModel.functions || []).map((resultFuncionton) => {
    let groupFixedParams =
      QuestionGroupProtocolFixedParamsEnum.mountQuestionGroupProtocolFixedParamsOption(
        questionGroupProtocolModel
      );
    let mountedFunctionResult = mountResultFunction(<string>resultFuncionton);
    mountResultFunction(<string>resultFuncionton).forEach((part, i) => {
      if (groupFixedParams.findIndex((gfp) => gfp.key == part) >= 0) {
        mountedFunctionResult[i] = groupFixedParams.find((gfp) => gfp.key == part)!.presentation;
      }
    });
    return {
      resultFuncionton: resultFuncionton,
      resultFunciontonArray: mountedFunctionResult,
      suggestions: groupFixedParams,
      groupFixedParams: groupFixedParams,
      resultFunciontonFormControl: new FormControl(resultFuncionton),
    };
  });
}

function generateQuestionGroupProtocolModelFormGroup(
  questionGroupProtocolModel?: QuestionGroupProtocolModel,
  questionsProtocolModel: QuestionProtocolModel[] = []
): FormGroup {
  questionGroupProtocolModel = questionGroupProtocolModel || ({} as QuestionGroupProtocolModel);
  const questionsPresent = (questionGroupProtocolModel.questions || []).map(
    (question) => question.key
  );
  const formBuilder = new FormBuilder();

  let questionsFormControl: any[] = questionsProtocolModel.map((question) => {
    return {
      question: question,
      checked: new FormControl(questionsPresent.includes(question.key)),
    };
  });
  let functionsFormControl: any[] = (questionGroupProtocolModel.functions || []).map(
    (resultFuncionton) => {
      let groupFixedParams =
        QuestionGroupProtocolFixedParamsEnum.mountQuestionGroupProtocolFixedParamsOption(
          questionGroupProtocolModel
        );
      let mountedFunctionResult = mountResultFunction(<string>resultFuncionton);
      mountResultFunction(<string>resultFuncionton).forEach((part, i) => {
        if (groupFixedParams.findIndex((gfp) => gfp.key == part) >= 0) {
          mountedFunctionResult[i] = groupFixedParams.find((gfp) => gfp.key == part)!.presentation;
        }
      });
      return {
        resultFuncionton: resultFuncionton,
        resultFunciontonArray: mountedFunctionResult,
        suggestions: groupFixedParams,
        groupFixedParams: groupFixedParams,
        resultFunciontonFormControl: new FormControl(resultFuncionton),
      };
    }
  );

  let newFormGroup = formBuilder.group({
    key: [questionGroupProtocolModel.key || uuid.v7(), null],
    id: [questionGroupProtocolModel.id],
    name: [
      questionGroupProtocolModel.name,
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255),
      ]),
    ],
    questions: [questionsFormControl || [], Validators.required],
    baseResults: [questionGroupProtocolModel.baseResults || []],
    functions: [functionsFormControl || []],
    functionAddingField: [null],
    resultFunctionName: [null],
  });

  return newFormGroup;
}

function generateBaseResultQuestionGroupProtocolModelFormGroup(
  baseResultQuestionGroupProtocolModel?: BaseResultQuestionGroupProtocolModel
): FormGroup {
  baseResultQuestionGroupProtocolModel =
    baseResultQuestionGroupProtocolModel || ({} as BaseResultQuestionGroupProtocolModel);
  const formBuilder = new FormBuilder();
  const newFormGroup = formBuilder.group({
    key: [baseResultQuestionGroupProtocolModel.key || uuid.v7(), null],
    name: [
      baseResultQuestionGroupProtocolModel.name,
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255),
      ]),
    ],
    isRange: [baseResultQuestionGroupProtocolModel.isRange || false],
    initialValue: [baseResultQuestionGroupProtocolModel.initialValue],
    finalValue: [baseResultQuestionGroupProtocolModel.finalValue],
    answerType: [baseResultQuestionGroupProtocolModel.answerType, Validators.required],
  });
  return newFormGroup;
}

function mountResultFunction(rFunciuon?: string): string[] {
  if (rFunciuon == undefined || rFunciuon == null) return [];
  const resultArray = [];
  const opp = ['+', '-', '*', '/', '%', '^', '(', '{', '[', ')', '}', ']'];
  let el = '';
  for (let v of rFunciuon.trim().split('')) {
    if (opp.includes(v)) {
      if (el.length > 0) {
        resultArray.push(el);
      }
      resultArray.push(v);
      el = '';
    } else {
      el += v;
    }
  }
  if (el.length > 0) resultArray.push(el);
  return resultArray;
}
