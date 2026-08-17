import { AuthService } from './../../../authentication/services/auth.service';
import { TherapeuticPlanStore } from './../../../../core/stores/therapeutic-plan.store';
import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditorModule } from 'primeng/editor';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormOfTherapeuticPlanModel,
  TherapeuticPlanModel,
} from '../../../../models/therapeutic-plan.model';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';
import { DropdownModule } from 'primeng/dropdown';
import { ProtocolMock } from '../../../../models/protocols.mock';
import { ProtocolModel } from '../../../../models/protocol.model';
import {
  TherapeuticPlanProtocolsBaseCardTableConfig,
  ViewAnswerCardTableActionConfig,
} from '../configs/therapeutic-plan-protocols-card-table.config';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { ProtocolTherapeuticPlanStore } from '../../../../core/stores/protocol-therapeutic-plan.store';
import { SplitterModule } from 'primeng/splitter';
import { TherapeuticPlanProtocolsComponent } from '../form/therapeutic-plan-protocols/therapeutic-plan-protocols.component';
import { TherapeuticPlanTextComponent } from '../form/therapeutic-plan-text/therapeutic-plan-text.component';
import { TherapeuticPlanAttachmentsComponent } from '../form/therapeutic-plan-attachments/therapeutic-plan-attachments.component';
import { TherapeuticPlanHistoryComponent } from '../form/therapeutic-plan-history/therapeutic-plan-history.component';
import { TherapeuticPlanCommmentsComponent } from '../form/therapeutic-plan-comments/therapeutic-plan-comments.component';
import { TherapeuticPlanBaseDataModel } from '../../../../models/therapeutic-plan-base-data.model';
import { LoadingComponent } from '../../../../core/components/loading/loading.component';
import { NgxSkeletonLoaderComponent, NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-therapeutic-plan-form',
  standalone: true,
  imports: [
    TherapeuticPlanProtocolsComponent,
    TherapeuticPlanTextComponent,
    TherapeuticPlanAttachmentsComponent,
    TherapeuticPlanCommmentsComponent,
    CommonModule,
    EditorModule,
    TabComponent,
    ReactiveFormsModule,
    DropdownModule,
    SplitterModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './therapeutic-plan-form.component.html',
  styleUrl: './therapeutic-plan-form.component.scss',
  providers: [TherapeuticPlanStore, ProtocolTherapeuticPlanStore],
})
export class TherapeuticPlanFormComponent implements OnInit {
  @Input()
  id?: number;
  medicalAppointmentId?: number;
  tabIndex: number = 0;
  tabs!: TabItem[];
  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }
  therapeuticPlanModel!: TherapeuticPlanBaseDataModel;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private therapeuticPlanStore: TherapeuticPlanStore,
    private protocolTherapeuticPlanStore: ProtocolTherapeuticPlanStore,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this._hasPermissionFormEdit = this.authService.hasPermission(
      'atendimento.plano-terapeutico.form'
    );
    this.activatedRoute.queryParams.pipe(alertApiError()).subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        this.tabIndex = params['tabIndex'] == undefined ? 0 : Number.parseInt(params['tabIndex']);
        this.medicalAppointmentId =
          params['medicalAppointmentId'] == undefined
            ? undefined
            : Number.parseInt(params['medicalAppointmentId']);
        if (this.editing && !this._hasPermissionFormEdit) this.location.back();
        this._loadPage();
      },
    });
  }
  clickBack(): void {
    this.router.navigate(['plano-terapeutico']);
  }
  onTabChange(tab: TabItem): void {
    const url = this.router
      .createUrlTree([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          editing: this.editing,
          tabIndex: this.tabs.findIndex((t) => t.displayName == tab.displayName),
        },
      })
      .toString();

    this.location.go(url);
  }
  // canShow(item: string): boolean {
  //   switch (item) {
  //     case 'buttonCreate':
  //       return !this.id;
  //     case 'buttonEvolution':
  //     case 'buttonAnamnesis':
  //     case 'buttonSave':
  //     case 'buttonQuestions':
  //       return !!this.id;
  //   }
  //   return false;
  // }

  // clickCreate(): void {
  //   this.router.navigate(['pacientes', Number.parseInt((Math.random() * 10).toFixed(0))]);
  // this.protocolStore.insert(this._makeProtocolFromForm()).subscribe({
  //   next: (id) => this.router.navigate([id], { relativeTo: this.activatedRoute }),
  //   error: (err) => this.alertService.showError({ message: err.error.detail }),
  // });
  // }
  // clickEvolution(): void {
  //   this.router.navigate(['evolucao'], { relativeTo: this.activatedRoute });
  // }

  // clickAnamnesis(): void {
  //   this.router.navigate(['anamnese'], { relativeTo: this.activatedRoute });
  // }
  // clickSave(): void {
  // if (this.id) {
  //   this.protocolStore.update(this._makeProtocolFromForm());
  // } else {
  //   this.protocolStore.insert(this._makeProtocolFromForm());
  // }
  // }

  // private _initGrid(): void {
  //   this.therapeuticPlanProtocolsBaseCardTableConfig =
  //     new TherapeuticPlanProtocolsBaseCardTableConfig(
  //       this.protocolTherapeuticPlanStore,
  //       this.alertService
  //     );
  //   if (this.id) this.therapeuticPlanProtocolsBaseCardTableConfig.actualOptions.id = this.id;
  //   this.therapeuticPlanProtocolsBaseCardTableConfig.refreshRegisters();
  // }
  // private _initForm(): void {
  //   this.form = FormOfTherapeuticPlanModel(this.model);
  //   this.protocolAddForm = new FormBuilder().group({
  //     protocolId: [undefined],
  //     requestDate: [new Date()],
  //   });
  //   this._initGrid();

  //   this.therapeuticsTextPlanTabs = (<FormGroup[]>(
  //     this.form.getRawValue().therapeuticsTextPlanForms
  //   )).map((therapeuticTextPlanForm) => {
  //     return {
  //       isDisabled: false,
  //       displayName: therapeuticTextPlanForm.getRawValue().user.name,
  //       isActive: false,
  //       titleSize: 6,
  //       breakSize: 25,
  //     };
  //   });
  // }
  private _loadPage(): void {
    if (!this.id && !this.medicalAppointmentId) this.location.back();
    else if (!this.id && this.medicalAppointmentId) {
      this.therapeuticPlanStore.findOrGenerate(this.medicalAppointmentId).subscribe({
        next: (model) =>
          this.router.navigate(['plano-terapeutico', model.id], {
            queryParams: {
              editing: this.editing,
            },
          }),
        error: (err) =>
          this.alertService.showError({
            message: err.error.detail,
            callbackFn: () => this.router.navigate(['plano-terapeutico']),
          }),
      });
    } else {
      this.therapeuticPlanStore
        .getTherapeuticPlanBaseData(this.id!)
        .pipe(alertApiError())
        .subscribe({
          next: (data) => {
            this.therapeuticPlanModel = data;
            this._initTabs();
          },
        });
    }
  }
  private _initTabs(): void {
    this.tabIndex = this.tabIndex >= 0 && this.tabIndex <= 4 ? this.tabIndex : 0;
    this.tabs = [
      {
        isDisabled: false,
        displayName: 'Protocolos',
        isActive: this.tabIndex == 0,
        titleSize: 4,
        breakSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Texto',
        isActive: this.tabIndex == 1,
        titleSize: 4,
        breakSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Anexos',
        isActive: this.tabIndex == 2,
        titleSize: 4,
        breakSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Comentários',
        isActive: this.tabIndex == 3,
        titleSize: 4,
        breakSize: undefined,
      },
    ];
  }
}
