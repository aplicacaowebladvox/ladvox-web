import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolStore } from '../../../../core/stores/protocol.store';
import { AuthService } from '../../../authentication/services/auth.service';
import { AccordionComponent } from '../../../../core/components/accordion/accordion.component';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipsModule } from 'primeng/chips';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  FormOfProtocolFourthStepModel,
  ProtocolFourthStepModelOfForm,
} from '../../../../models/protocol-fourth-step.model';
import { BaseAccordionContainerConfig } from '../../../../core/components/accordion/models/base-accordion-container.config';
import {
  FormOfQuestionGroupProtocolModel,
  QuestionGroupProtocolModel,
  QuestionGroupProtocolModelOfForm,
} from '../../../../models/question-group-protocol.model';
import { reduceString } from '../../../shared/utils/string.util';
import { FormOfBaseResultQuestionGroupProtocolModel } from '../../../../models/base-result-question-group-protocol.model';
import {
  FormOfFunctionCalculatorModel,
  FunctionCalculatorModel,
  FunctionCalculatorModelOfForm,
} from '../../../../models/function-calculator.model';
import {
  QuestionGroupProtocolFixedParamsEnum,
  QuestionGroupProtocolFixedParamsOption,
} from '../../../../models/enum/question-group-protocol-fixed-params.enum';
import { ConvertUtils } from '../../../shared/utils/convert.utils';
import { DropdownModule } from 'primeng/dropdown';
import { QuestionProtocolModel } from '../../../../models/question-protocol.model';
import { BasicCalculator } from '../../../../core/components/protocol-calculator/calc/basic-calculator.class';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';
import { SelectOptionModel } from '../../../../core/models/select-option.model';

@Component({
  selector: 'app-protocols-group-form',
  standalone: true,
  imports: [
    AccordionComponent,
    AutoCompleteModule,
    ChipsModule,
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    CdkDropList,
    CdkDrag,
    DropdownModule,
    ToggleButtonModule,
    HasPermissionDirective,
    NgxSkeletonLoaderModule,
    TabComponent,
  ],
  templateUrl: './protocols-group-form.component.html',
  styleUrl: './protocols-group-form.component.scss',
  providers: [ProtocolStore],
})
export class ProtocolsGroupFormComponent implements OnInit {
  @Input()
  id!: number;
  form!: FormGroup;
  loaded: boolean = false;
  get groupsForm(): FormGroup[] {
    return this.form.getRawValue().groupsForm || [];
  }
  get groupKeyToName(): any {
    let ret = {};
    this.groupsForm.forEach((g) => {
      (<any>ret)['@' + g.getRawValue().key] = g.getRawValue().name;
      (<any>ret)['@' + ConvertUtils.uuidV7WithoutOpperators(g.getRawValue().key)] =
        g.getRawValue().name;
    });
    return ret;
  }

  groupFormActions!: BaseAccordionContainerConfig[];
  groupsBaseResultsActions!: Array<BaseAccordionContainerConfig>;
  groupsBaseResultsItemActions!: Array<BaseAccordionContainerConfig>;
  groupsFunctionsActions!: Array<BaseAccordionContainerConfig>;
  groupsFunctionsItemActions!: Array<BaseAccordionContainerConfig>;

  calculatedValue: Array<Array<number | null>> = [];
  resultFunctionTypeAvailables: Array<SelectOptionModel<string, string>> = [
    { id: 'EQUATION', name: 'Equação' },
    { id: 'RIGHT_AND_WRONG', name: 'Certo e errado' },
  ];

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  private _hasPermissionFormNew: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  reduceString = reduceString;
  getPresentation = QuestionGroupProtocolFixedParamsEnum.getPresentation;
  tabItems!: TabItem[];
  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private protocolStore: ProtocolStore,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission('protocolo.protocolo.form.edit');
    this._hasPermissionFormNew = this.authService.hasPermission('protocolo.protocolo.form.new');
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit && !this._hasPermissionFormNew)
          this.location.back();
        this._getProtocol();
      },
    });
  }
  clickBack() {
    this.router.navigate(['protocolos', 'form', this.id, 'perguntas'], {
      queryParams: { editing: this.editing },
    });
  }
  clickAddNewGroupQuestion(): void {
    this.form.controls['groupsForm'].setValue([
      ...this.groupsForm,
      FormOfQuestionGroupProtocolModel({
        questions: this.form.getRawValue().questions,
      } as QuestionGroupProtocolModel),
    ]);
  }
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
    groupQuestionFunctionResultFunciontonArray.forEach((a, i) => this._calculate(groupIndex, i));
  }
  changeType(groupFormIndex: number, functionFormIndex: number) {
    this._calculate(groupFormIndex, functionFormIndex);
  }
  clickFinalize(): void {
    if (this.calculatedValue.findIndex((c) => c.findIndex((v) => !v) >= 0) >= 0) {
      this.alertService.showError({
        message: 'Há funções de resultado inválidas, favor corrigi-las',
      });
      return;
    }
    this.protocolStore
      .updateFourthStep(this.id!, ProtocolFourthStepModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: () => {
          this.alertService.showSuccess({
            message: 'Grupos salvos',
            title: 'Sucesso',
          });
        },
      });
  }
  clickBackToList(): void {
    this.router.navigate(['protocolos']);
  }
  getValor(groupFormIndex: number, functionFormIndex: number): number | null {
    if (
      !this.calculatedValue[groupFormIndex] ||
      !this.calculatedValue[groupFormIndex][functionFormIndex]
    ) {
      this._calculate(groupFormIndex, functionFormIndex);
    }
    return !this.calculatedValue[groupFormIndex] ||
      !this.calculatedValue[groupFormIndex][functionFormIndex]
      ? null
      : this.calculatedValue[groupFormIndex][functionFormIndex];
  }
  resultHasError(groupFormIndex: number): boolean {
    if (this.groupsForm.length <= groupFormIndex) return true;
    if (this.calculatedValue.length <= groupFormIndex) return true;
    return this.calculatedValue[groupFormIndex].some((v) => v == null);
  }
  private _getProtocol(): void {
    if (this.id) {
      this.protocolStore
        .getFourthStep(this.id)
        .pipe(alertApiError())
        .subscribe({
          next: (data) => {
            this.form = FormOfProtocolFourthStepModel(data);
            if ((data.groups || []).length > 0 && this.editing && !this._hasPermissionFormEdit) {
              this.location.back();
            }
            this._changeFormControlStatus(this.form, !!this.editing);
            this._loadPage();
          },
        });
    } else {
      this.router.navigate(['protocolos']);
    }
  }
  private get allFixedFunctionSuggestions(): QuestionGroupProtocolFixedParamsOption[] {
    return this.groupsForm
      .map((g) =>
        QuestionGroupProtocolFixedParamsEnum.mountQuestionGroupProtocolFixedParamsOption(
          <QuestionGroupProtocolModel>g.getRawValue()
        )
      )
      .reduce((a, b) => a.concat(b), []);
  }
  autoCompleteSearch(event: any, groupForm: FormGroup) {
    if (!(<string>event.query) || (<string>event.query).length <= 0)
      groupForm.controls['functionSuggestions'].setValue(this.allFixedFunctionSuggestions);

    groupForm.controls['functionSuggestions'].setValue([
      ...(<QuestionGroupProtocolFixedParamsOption[]>this.allFixedFunctionSuggestions).filter(
        (gfp) =>
          gfp.key.toLowerCase().includes(event.query.toLowerCase()) ||
          gfp.presentation.toLowerCase().includes(event.query.toLowerCase())
      ),
      {
        questionGroupProtocolModel: QuestionGroupProtocolModelOfForm(groupForm),
        key: event.query,
        presentation: event.query,
      },
    ]);
  }
  clickAddNewElementOnGroupQuestionFunction(
    groupForm: FormGroup,
    functionForm: FormGroup,
    groupFormIndex: number,
    functionFormIndex: number
  ): void {
    const items: string[] = [];
    (<QuestionGroupProtocolFixedParamsOption[]>(
      functionForm.getRawValue().functionAddingField
    )).forEach((functionAddingField) =>
      items.push(...ConvertUtils.generateArrayFunction(functionAddingField.key))
    );
    functionForm.controls['functionArray'].setValue([
      ...functionForm.getRawValue().functionArray,
      ...items,
    ]);
    functionForm.controls['functionAddingField'].setValue(null);
    this._calculate(groupFormIndex, functionFormIndex);
  }
  reCalculate(groupFormIndex: number): void {
    if (!this.groupsForm[groupFormIndex]) return;
    (<any[]>this.groupsForm[groupFormIndex].getRawValue().functionsForm).forEach(
      (f, functionFormIndex) => {
        this._calculate(groupFormIndex, functionFormIndex);
      }
    );
  }
  onTabChange(tabItem: TabItem): void {
    if (tabItem.displayName == 'Grupos') return;
    this.alertService.showConfirm({
      message:
        'Ao sair da página todas as alterções não salvas previamente serão perdidas, tem certeza que deseja executa-la?',
      callbackConfirmFn: () => {
        switch (tabItem.displayName) {
          case 'Tipos de resposta':
            this.router.navigate(['protocolos', 'form', this.id, 'tipos-respostas'], {
              queryParams: {
                editing: this.editing,
              },
            });
            return;
          case 'Perguntas':
            this.router.navigate(['protocolos', 'form', this.id, 'perguntas'], {
              queryParams: {
                editing: this.editing,
              },
            });
            return;
          case 'Visualizar':
            this.router.navigate(['protocolos', 'form', this.id, 'visualizacao'], {
              queryParams: {
                editing: this.editing,
              },
            });
            return;
        }
      },
      callbackCancelFn: () =>
        this.tabItems.forEach((tabItem) => (tabItem.isActive = tabItem.displayName == 'Grupos')),
    });
  }
  private _loadPage(): void {
    this._initGroupFormActions();
    this._initGroupsBaseResultsActions();
    this._initGroupsBaseResultsItemActions();
    this._initGroupsFunctionsActions();
    this._initGroupsFunctionsItemActions();
    this._initTabs();
  }
  private _calculate(groupFormIndex: number, functionFormIndex: number): void {
    if (
      !this.groupsForm[groupFormIndex] ||
      !this.groupsForm[groupFormIndex].getRawValue().functionsForm[functionFormIndex]
    )
      return;
    let groupForm = this.groupsForm[groupFormIndex];
    let functionForm = groupForm.getRawValue().functionsForm[functionFormIndex];
    let questionGroupModel = this._moutQuestionGroupProtocolModel(groupForm, functionForm);
    if (
      !!groupForm &&
      !!functionForm &&
      FunctionCalculatorModelOfForm(functionForm).type == 'RIGHT_AND_WRONG'
    ) {
      if (!this.calculatedValue) this.calculatedValue = [];
      if (this.calculatedValue.length <= groupFormIndex) this.calculatedValue[groupFormIndex] = [];
      this.calculatedValue[groupFormIndex][functionFormIndex] = questionGroupModel.questions.length;
      return;
    }
    let functionReplaced = (<FunctionCalculatorModel>(
      questionGroupModel.functions[functionFormIndex]
    )).functionText.replace(
      /@[^#]+#(groupSum|groupQuestionsLength|groupMaxSum)/g,
      (Math.random() * (this.form.getRawValue().questions.length || 1)).toFixed(0)
    );
    let v: number | null = null;
    try {
      v = Number.parseFloat(BasicCalculator.solve(functionReplaced));
    } catch (error) {}
    if (!this.calculatedValue) this.calculatedValue = [];
    if (this.calculatedValue.length <= groupFormIndex) this.calculatedValue[groupFormIndex] = [];
    if (this.calculatedValue[groupFormIndex].length <= functionFormIndex)
      this.calculatedValue[groupFormIndex][functionFormIndex] = null;
    if (v == null || v == undefined) {
      this.calculatedValue[groupFormIndex][functionFormIndex] = null;
    } else {
      this.calculatedValue[groupFormIndex][functionFormIndex] = v;
    }
  }
  private _moutQuestionGroupProtocolModel(
    groupForm: FormGroup,
    functionForm: FormGroup
  ): QuestionGroupProtocolModel {
    let model = QuestionGroupProtocolModelOfForm(groupForm);
    model.questions = (<QuestionProtocolModel[]>this.form.getRawValue().questions).filter((q) =>
      model.questionsIds.includes(q.id)
    );
    model.functions = [FunctionCalculatorModelOfForm(functionForm)];
    return model;
  }
  private _initGroupFormActions(): void {
    this.groupFormActions = [
      new RemoveQuestionGroupAccordionContainerConfig(this),
      new MoveUpQuestionGroupAccordionContainerConfig(this),
      new MoveDownQuestionGroupAccordionContainerConfig(this),
    ];
  }
  private _initGroupsBaseResultsActions(): void {
    this.groupsBaseResultsActions = [new NewBaseResultQuestionGroupAccordionContainerConfig(this)];
  }
  private _initGroupsBaseResultsItemActions(): void {
    this.groupsBaseResultsItemActions = [
      new RemoveBaseResultQuestionGroupAccordionContainerConfig(this),
    ];
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
  private _changeFormControlStatus(f: FormGroup, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
    (<FormGroup[]>f.getRawValue().groupsForm).forEach((gf) => {
      enable ? gf.enable() : gf.disable();
      (<any[]>gf.getRawValue().questionsForm).forEach((qf) => {
        enable ? (<FormControl>qf.checked).enable() : (<FormControl>qf.checked).disable();
      });
      (<FormGroup[]>gf.getRawValue().baseResultsForm).forEach((brf) => {
        enable ? brf.enable() : brf.disable();
      });
      (<FormGroup[]>gf.getRawValue().functionsForm).forEach((ff) => {
        enable ? ff.enable() : ff.disable();
      });
    });
  }
  private _initTabs(): void {
    this.tabItems = [
      {
        isDisabled: false,
        displayName: 'Tipos de resposta',
        isActive: false,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Perguntas',
        isActive: false,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Grupos',
        isActive: true,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: !this.form.getRawValue().nextStepIsEnable,
        displayName: 'Visualizar',
        isActive: false,
        titleSize: undefined,
        breakSize: undefined,
      },
    ];
  }
}
class RemoveQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsGroupFormComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-trash';
    this.tooltip = 'Remover';
  }
  override isVisible(line: any): boolean {
    return this.parent.editing == true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (this.parent.groupsForm.length < index) return;
    this.parent.form.controls['groupsForm'].setValue(this.parent.groupsForm.splice(index, 1));
  }
}
class MoveUpQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsGroupFormComponent) {
    super();
    this.position = 1;
    this.iconClass = 'fa-solid fa-angles-up';
    this.tooltip = 'Subir';
  }
  override isVisible(componentId: string): boolean {
    if (this.parent.editing != true) return false;
    if (!componentId) return false;
    let index = Number.parseInt(componentId);
    if (this.parent.groupsForm.length < index || index == 0) return false;
    return true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (this.parent.groupsForm.length < index) return;
    let groups = this.parent.groupsForm;
    let hold = groups[index - 1];
    groups[index - 1] = groups[index];
    groups[index] = hold;
    groups[index - 1].controls['orderView'].setValue(index);
    groups[index].controls['orderView'].setValue(index + 1);
    this.parent.form.controls['groupsForm'].setValue(groups);
  }
}
class MoveDownQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsGroupFormComponent) {
    super();
    this.position = 1;
    this.iconClass = 'fa-solid fa-angles-down';
    this.tooltip = 'Descer';
  }
  override isVisible(componentId: string): boolean {
    if (this.parent.editing != true) return false;
    if (!componentId) return false;
    let index = Number.parseInt(componentId);
    if (!this.parent.groupsForm[index + 1]) return false;
    return true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (this.parent.groupsForm.length < index) return;
    let groups = this.parent.groupsForm;
    let hold = groups[index + 1];
    groups[index + 1] = groups[index];
    groups[index] = hold;
    groups[index + 1].controls['orderView'].setValue(index + 2);
    groups[index].controls['orderView'].setValue(index + 1);
    this.parent.form.controls['groupsForm'].setValue(groups);
  }
}
class NewBaseResultQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsGroupFormComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-plus';
    this.tooltip = 'Novo';
  }
  override isVisible(line: any): boolean {
    return this.parent.editing == true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId.split('/*/BaseResult')[0]);
    this.parent.groupsForm[index].controls['baseResultsForm'].setValue([
      ...this.parent.groupsForm[index].getRawValue().baseResultsForm,
      FormOfBaseResultQuestionGroupProtocolModel(),
    ]);
  }
}
class RemoveBaseResultQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsGroupFormComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-trash';
    this.tooltip = 'Remover';
  }
  override isVisible(line: any): boolean {
    return this.parent.editing == true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let groupFormIndex = Number.parseInt(componentId.split('/*/')[0]);
    let baseResultFormIndex = Number.parseInt(componentId.split('/*/')[1]);
    if (
      (!groupFormIndex && groupFormIndex != 0) ||
      (!baseResultFormIndex && baseResultFormIndex != 0)
    )
      return;
    this.parent.groupsForm[groupFormIndex].controls['baseResultsForm'].setValue([
      ...(<FormGroup[]>this.parent.groupsForm[groupFormIndex].getRawValue().baseResultsForm).filter(
        (bf, i) => i != baseResultFormIndex
      ),
    ]);
  }
}
class NewResultFunctionQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsGroupFormComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-plus';
    this.tooltip = 'Novo';
  }
  override isVisible(componentId: string): boolean {
    if (!componentId || !this.parent.editing) return false;
    let groupFormIndex = Number.parseInt(componentId.split('/*/ResultFunction')[0]);
    return (
      (<FormGroup[]>this.parent.groupsForm[groupFormIndex].getRawValue().functionsForm).length < 1
    );
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let groupFormIndex = Number.parseInt(componentId.split('/*/ResultFunction')[0]);
    this.parent.groupsForm[groupFormIndex].controls['functionsForm'].setValue([
      ...this.parent.groupsForm[groupFormIndex].getRawValue().functionsForm,
      FormOfFunctionCalculatorModel(),
    ]);
  }
}
class RemoveResultFunctionQuestionGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsGroupFormComponent) {
    super();
    this.position = 0;
    this.iconClass = 'fa-solid fa-trash';
    this.tooltip = 'Remover';
  }
  override isVisible(line: any): boolean {
    return this.parent.editing == true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let groupFormIndex = Number.parseInt(componentId.split('/*/')[0]);
    let functionFormIndex = Number.parseInt(componentId.split('/*/')[1]);

    this.parent.groupsForm[groupFormIndex].controls['functionsForm'].setValue([
      ...(<FormGroup[]>this.parent.groupsForm[groupFormIndex].getRawValue().functionsForm).filter(
        (ff, i) => i != functionFormIndex
      ),
    ]);
  }
}
