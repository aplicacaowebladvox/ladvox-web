import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ProtocolStore } from '../../../../core/stores/protocol.store';
import { AuthService } from '../../../authentication/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { FormOfProtocolFirstStepModel } from '../../../../models/protocol-first-step.model';
import {
  FormOfProtocolSecondStepModel,
  ProtocolSecondStepModelOfForm,
} from '../../../../models/protocol-second-step.model';
import { AccordionComponent } from '../../../../core/components/accordion/accordion.component';
import { BaseAccordionContainerConfig } from '../../../../core/components/accordion/models/base-accordion-container.config';
import {
  AcceptedValueAnswerTypeProtocolModel,
  AcceptedValueAnswerTypeProtocolModelOfForm,
  FormOfAcceptedValueAnswerTypeProtocolModel,
} from '../../../../models/accepted-value-answer-type-protocol.model';
import { FormOfAnswerTypeProtocolModel } from '../../../../models/answer-type-protocol.model';
import { SplitterModule } from 'primeng/splitter';
import { OrderListModule } from 'primeng/orderlist';
import { HasPermissionsDirective } from '../../../../core/has-permissions.directive';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';

@Component({
  selector: 'app-protocols-answer-type-form',
  standalone: true,
  imports: [
    AccordionComponent,
    CommonModule,
    ReactiveFormsModule,
    HasPermissionDirective,
    SplitterModule,
    OrderListModule,
    LoadingComponent,
    TabComponent,
  ],
  templateUrl: './protocols-answer-type-form.component.html',
  styleUrl: './protocols-answer-type-form.component.scss',
  providers: [ProtocolStore],
})
export class ProtocolsAnswerTypeFormComponent implements OnInit {
  @Input()
  id!: number;
  form!: FormGroup;
  isLoading: boolean = false;
  get answersTypeForm(): FormGroup[] {
    return this.form.getRawValue().answersTypeForm || [];
  }
  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  private _hasPermissionFormNew: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }

  tabItems!: TabItem[];
  answerTypeActions?: Array<BaseAccordionContainerConfig>;

  AcceptedValueAnswerTypeProtocolModelOfForm = AcceptedValueAnswerTypeProtocolModelOfForm;
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
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit && !this._hasPermissionFormNew)
          this.location.back();
        this._getProtocol();
      },
    });
  }
  clickBack() {
    this.router.navigate(['protocolos', 'form', this.id], {
      queryParams: { editing: this.editing },
    });
  }
  clickAddNewAnswerType(): void {
    this.form.getRawValue().answersTypeForm.push(FormOfAnswerTypeProtocolModel());
  }
  clickAddAcceptedValue(answerTypeFormIndex: number): void {
    this.answersTypeForm[answerTypeFormIndex].controls['acceptableValuesForm'].setValue([
      ...this.answersTypeForm[answerTypeFormIndex].getRawValue().acceptableValuesForm,
      this.answersTypeForm[answerTypeFormIndex].getRawValue().edittingAcceptableValueForm,
    ]);
    this.answersTypeForm[answerTypeFormIndex].controls['edittingAcceptableValueForm'].setValue(
      FormOfAcceptedValueAnswerTypeProtocolModel()
    );
  }
  clickSave(): void {
    this.isLoading = true;
    this.protocolStore
      .updateSecondStep(this.id!, ProtocolSecondStepModelOfForm(this.form))
      .pipe(
        finalize(() => (this.isLoading = false)),
        alertApiError()
      )
      .subscribe({
        next: () => {
          this.clickContinue();
        },
      });
  }
  clickContinue(): void {
    this.router.navigate(['protocolos', 'form', this.id, 'perguntas'], {
      queryParams: {
        editing: this.editing,
      },
    });
  }
  clickEditOrderListItem(answerTypeFormIndex: number, acceptableValueForm: FormGroup): void {
    this.answersTypeForm[answerTypeFormIndex].controls['edittingAcceptableValueForm'].setValue(
      acceptableValueForm
    );
    this.answersTypeForm[answerTypeFormIndex].controls['acceptableValuesForm'].setValue(
      this.answersTypeForm[answerTypeFormIndex]
        .getRawValue()
        .acceptableValuesForm.filter(
          (parentForm: FormGroup) =>
            !(parentForm.getRawValue().key == acceptableValueForm.getRawValue().key)
        )
    );
  }
  clickRemoveOrderListItem(answerTypeFormIndex: number, acceptableValueForm: FormGroup): void {
    this.answersTypeForm[answerTypeFormIndex].controls['acceptableValuesForm'].setValue(
      this.answersTypeForm[answerTypeFormIndex]
        .getRawValue()
        .acceptableValuesForm.filter(
          (parentForm: FormGroup) =>
            !(parentForm.getRawValue().key == acceptableValueForm.getRawValue().key)
        )
    );
  }
  onTabChange(tabItem: TabItem): void {
    if (tabItem.displayName == 'Tipos de resposta') return;
    this.alertService.showConfirm({
      message:
        'Ao sair da página todas as alterções não salvas previamente serão perdidas, tem certeza que deseja executa-la?',
      callbackConfirmFn: () => {
        switch (tabItem.displayName) {
          case 'Perguntas':
            this.router.navigate(['protocolos', 'form', this.id, 'perguntas'], {
              queryParams: {
                editing: this.editing,
              },
            });
            return;
          case 'Grupos':
            this.router.navigate(['protocolos', 'form', this.id, 'grupos'], {
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
        this.tabItems.forEach(
          (tabItem) => (tabItem.isActive = tabItem.displayName == 'Tipos de resposta')
        ),
    });
  }
  private _getProtocol(): void {
    if (this.id) {
      this.isLoading = true;
      this.protocolStore
        .getSecondStep(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (data) => {
            this.form = FormOfProtocolSecondStepModel(data);
            if (
              (data.answersType || []).length > 0 &&
              this.editing &&
              !this._hasPermissionFormEdit
            ) {
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
  private _loadPage(): void {
    this._initAnswerTypeActions();
    this._initTabs();
  }
  private _initAnswerTypeActions(): void {
    this.answerTypeActions = [];
    this.answerTypeActions.push(new RemoveBaseAccordionContainerConfig(this));
    this.answerTypeActions.push(new MoveUpAnswersTypeFormGroupAccordionContainerConfig(this));
    this.answerTypeActions.push(new MoveDownAnswersTypeFormGroupAccordionContainerConfig(this));
  }
  private _validateAcceptedValueAnswerTypeProtocolModel(
    edittingModel: AcceptedValueAnswerTypeProtocolModel,
    answerTypeProtocolIndex: number
  ): boolean {
    if (!edittingModel) {
      return false;
    }
    let errors = [];
    if (!edittingModel.value) {
      errors.push('Valor não informado');
    }
    if (edittingModel.presentation && edittingModel.value == edittingModel.presentation) {
      errors.push('Valor e Apresentação deve ser diferente do Valor');
    }
    if (
      (<FormGroup[]>(
        this.answersTypeForm[answerTypeProtocolIndex].getRawValue().acceptableValuesForm
      )).findIndex((fg) => {
        return (
          fg.getRawValue().value == edittingModel.value ||
          fg.getRawValue().presentation == edittingModel.presentation
        );
      })
    ) {
      errors.push('Valor ou Apresentação já cadastrado');
    }

    return errors.length == 0;
  }

  private _changeFormControlStatus(f: any, enable: boolean = false): void {
    Object.keys(f.controls).forEach((controlKey) => {
      if (f.get(controlKey)?.value instanceof Array) {
        for (let item of f.get(controlKey)?.value) {
          this._changeFormControlStatus(item, enable);
        }
      } else if (f.get(controlKey)?.value instanceof FormGroup) {
        enable ? f.enable() : f.disable();
        this._changeFormControlStatus(f.get(controlKey)?.value, enable);
      } else if (f.get(controlKey)?.value instanceof FormControl) {
        if (enable) {
          f.get(controlKey)?.enable();
        } else {
          f.get(controlKey)?.disable();
        }
      }
    });
  }
  private _initTabs(): void {
    this.tabItems = [
      {
        isDisabled: false,
        displayName: 'Tipos de resposta',
        isActive: true,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: !this.form.getRawValue().nextStepIsEnable,
        displayName: 'Perguntas',
        isActive: false,
        titleSize: undefined,
        breakSize: undefined,
      },
      {
        isDisabled: !this.form.getRawValue().nextStepIsEnable,
        displayName: 'Grupos',
        isActive: false,
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

class RemoveBaseAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsAnswerTypeFormComponent) {
    super();
    this.position = 3;
    this.iconClass = 'fa-solid fa-trash';
    this.tooltip = 'Remover';
  }
  override isVisible(line: any): boolean {
    return this.parent.editing == true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (this.parent.answersTypeForm.length < index) return;
    this.parent.answersTypeForm.splice(index, 1);
    this.parent.answersTypeForm.forEach((answerTypeForm, i) => {
      answerTypeForm.controls['sequence'].setValue(i + 1);
    });
  }
}

class MoveUpAnswersTypeFormGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsAnswerTypeFormComponent) {
    super();
    this.position = 1;
    this.iconClass = 'fa-solid fa-angles-up';
    this.tooltip = 'Subir';
  }
  override isVisible(componentId: string): boolean {
    if (this.parent.editing != true) return false;
    if (!componentId) return false;
    let index = Number.parseInt(componentId);
    if (this.parent.answersTypeForm.length < index || index == 0) return false;
    return true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (this.parent.answersTypeForm.length < index || index == 0) return;
    let hold = this.parent.answersTypeForm[index - 1];
    this.parent.answersTypeForm[index - 1] = this.parent.answersTypeForm[index];
    this.parent.answersTypeForm[index] = hold;
    this.parent.answersTypeForm[index - 1].controls['sequence'].setValue(index);
    this.parent.answersTypeForm[index].controls['sequence'].setValue(index + 1);
  }
}

class MoveDownAnswersTypeFormGroupAccordionContainerConfig extends BaseAccordionContainerConfig {
  constructor(private parent: ProtocolsAnswerTypeFormComponent) {
    super();
    this.position = 2;
    this.iconClass = 'fa-solid fa-angles-down';
    this.tooltip = 'Descer';
  }
  override isVisible(componentId: string): boolean {
    if (this.parent.editing != true) return false;
    if (!componentId) return false;
    let index = Number.parseInt(componentId);
    if (!this.parent.answersTypeForm[index + 1]) return false;
    return true;
  }
  public override click(componentId: string): void {
    if (!componentId) return;
    let index = Number.parseInt(componentId);
    if (
      this.parent.answersTypeForm.length < index ||
      this.parent.answersTypeForm.length < index + 1
    )
      return;
    let hold = this.parent.answersTypeForm[index + 1];
    this.parent.answersTypeForm[index + 1] = this.parent.answersTypeForm[index];
    this.parent.answersTypeForm[index] = hold;
    this.parent.answersTypeForm[index + 1].controls['sequence'].setValue(index + 2);
    this.parent.answersTypeForm[index].controls['sequence'].setValue(index + 1);
  }
}
