import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ProtocolStore } from '../../../../core/stores/protocol.store';
import { AuthService } from '../../../authentication/services/auth.service';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { SplitterModule } from 'primeng/splitter';
import { OrderListModule } from 'primeng/orderlist';
import {
  FormOfProtocolThirdStepModel,
  ProtocolThirdStepModelOfForm,
} from '../../../../models/protocol-third-step.model';
import { FormOfQuestionProtocolModel } from '../../../../models/question-protocol.model';
import { HasPermissionsDirective } from '../../../../core/has-permissions.directive';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { finalize } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';

@Component({
  selector: 'app-protocols-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HasPermissionDirective,
    SplitterModule,
    OrderListModule,
    LoadingComponent,
    TabComponent,
  ],
  templateUrl: './protocols-question-form.component.html',
  styleUrl: './protocols-question-form.component.scss',
  providers: [ProtocolStore],
})
export class ProtocolsQuestionFormComponent implements OnInit {
  @Input()
  id!: number;
  form!: FormGroup;
  isLoading: boolean = false;
  get questionsForm(): FormGroup[] {
    return this.form.getRawValue().questionsForm || [];
  }
  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
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
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit) this.location.back();
        this._getProtocol();
      },
    });
  }

  clickBack() {
    this.router.navigate(['protocolos', 'form', this.id, 'tipos-respostas'], {
      queryParams: { editing: this.editing },
    });
  }
  clickSave(): void {
    this.isLoading = true;
    this.protocolStore
      .updateThirdStep(this.id!, ProtocolThirdStepModelOfForm(this.form))
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
    this.router.navigate(['protocolos', 'form', this.id, 'grupos'], {
      queryParams: {
        editing: this.editing,
      },
    });
  }
  clickAddQuestion(): void {
    this.form
      .getRawValue()
      .edittingQuestionProtocolForm.controls['sequence'].setValue(this.questionsForm.length + 1);
    this.form.controls['questionsForm'].setValue([
      ...this.form.getRawValue().questionsForm,
      this.form.getRawValue().edittingQuestionProtocolForm,
    ]);
    this.form.controls['edittingQuestionProtocolForm'].setValue(FormOfQuestionProtocolModel());
  }
  onChangeQuestionOrder(): void {
    this.form.controls['questionsForm'].setValue(
      (<FormGroup[]>this.form.getRawValue().questionsForm).map((questionForm, i) => {
        questionForm.controls['sequence'].setValue(i + 1);
        return questionForm;
      })
    );
  }
  clickEditQuestionOrderListItem(questionForm: FormGroup) {
    this.form.controls['edittingQuestionProtocolForm'].setValue(questionForm);
    this.clickRemoveQuestionOrderListItem(questionForm);
    // this.form.controls['questionsForm'].setValue(
    //   this.form
    //     .getRawValue()
    //     .questionsForm.filter(
    //       (inQuestionForm: FormGroup) =>
    //         !(inQuestionForm.getRawValue().key == questionForm.getRawValue().key)
    //     )
    //     .map((inQuestionForm: FormGroup, i: number) => {
    //       inQuestionForm.controls['sequence'].setValue(i + 1);
    //       return inQuestionForm;
    //     })
    // );
  }
  clickRemoveQuestionOrderListItem(questionForm: FormGroup) {
    this.form.controls['questionsForm'].setValue(
      this.form
        .getRawValue()
        .questionsForm.filter(
          (inQuestionForm: FormGroup) =>
            !(inQuestionForm.getRawValue().key == questionForm.getRawValue().key)
        )
        .map((inQuestionForm: FormGroup, i: number) => {
          inQuestionForm.controls['sequence'].setValue(i + 1);
          return inQuestionForm;
        })
    );
  }
  onTabChange(tabItem: TabItem): void {
    if (tabItem.displayName == 'Perguntas') return;
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
        this.tabItems.forEach((tabItem) => (tabItem.isActive = tabItem.displayName == 'Perguntas')),
    });
  }
  private _getProtocol(): void {
    if (this.id) {
      this.isLoading = true;
      this.protocolStore
        .getThirdStep(this.id)
        .pipe(
          finalize(() => (this.isLoading = false)),
          alertApiError()
        )
        .subscribe({
          next: (data) => {
            this.form = FormOfProtocolThirdStepModel(data);
            this._initTabs();
          },
        });
    } else {
      this.router.navigate(['protocolos']);
    }
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
        isActive: true,
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
