import { error } from 'console';
import { ProtocolStore } from '../../../../core/stores/protocol.store';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  TherapeuticPlanProtocolsBaseCardTableConfig,
  ViewAnswerCardTableActionConfig,
} from '../../../therapeutic-plan/views/configs/therapeutic-plan-protocols-card-table.config';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { TabComponent } from '../../../../core/components/tab/tab.component';
import { TherapeuticPlanStore } from '../../../../core/stores/therapeutic-plan.store';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import {
  FormOfProtocolTherapeuticPlanOptions,
  ProtocolTherapeuticPlanOptions,
  ProtocolTherapeuticPlanOptionsOfForm,
} from '../../../../models/options/protocol-therapeutic-plan.options';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { SelectOptionModel } from '../../../../core/models/select-option.model';
import { PatientStore } from '../../../../core/stores/patient.store';
import { PrimeNGConfig } from 'primeng/api';
import { translationConfig } from '../../../../config/primeng-translation.config';
import { AuthService } from '../../../authentication/services/auth.service';
import { ProtocolTherapeuticPlanStore } from '../../../../core/stores/protocol-therapeutic-plan.store';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-patients-evolution',
  standalone: true,
  imports: [
    ActionCardTableComponent,
    CommonModule,
    EditorModule,
    CardTableComponent,
    ReactiveFormsModule,
    DropdownModule,
  ],
  templateUrl: './patients-protocol-history.component.html',
  styleUrl: './patients-protocol-history.component.scss',
  providers: [TherapeuticPlanStore, ProtocolStore, PatientStore, ProtocolTherapeuticPlanStore],
})
export class PatientsEvolutionComponent implements OnInit {
  @Input()
  id!: number;
  patientName!: string;
  form!: FormGroup;

  protocolsSelectOptions!: SelectOptionModel<number, string>[];

  therapeuticPlanProtocolsBaseCardTableConfig!: TherapeuticPlanProtocolsBaseCardTableConfig;
  viewAnswerCardTableActionConfig: ViewAnswerCardTableActionConfig =
    new ViewAnswerCardTableActionConfig(
      this.router,
      this.authService,
      'paciente.historico-protocolo.resposta.view'
    );
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private therapeuticPlanStore: TherapeuticPlanStore,
    private protocolStore: ProtocolStore,
    private patientStore: PatientStore,
    private alertService: AlertService,
    private authService: AuthService,
    private protocolTherapeuticPlanStore: ProtocolTherapeuticPlanStore
  ) {}
  ngOnInit(): void {
    this.patientStore
      .getSelectOptions(this.id)
      .pipe(alertApiError())
      .subscribe({
        next: (options) => {
          if (options && options.length > 0) this.patientName = options[0].name;
        },
      });
    this._initForm();
    this._initSelectOptions();
    this._initGrid();
  }
  clickBack(): void {
    this.router.navigate(['pacientes', this.id]);
  }
  clickClean(): void {
    this._initForm();
  }
  clickFilter(): void {
    this.therapeuticPlanProtocolsBaseCardTableConfig.actualOptions =
      ProtocolTherapeuticPlanOptionsOfForm(this.form);
    this.therapeuticPlanProtocolsBaseCardTableConfig.refreshRegisters();
  }
  private _initForm(): void {
    this.form = FormOfProtocolTherapeuticPlanOptions({
      patientId: this.id,
    } as ProtocolTherapeuticPlanOptions);
  }
  private _initGrid(): void {
    this.therapeuticPlanProtocolsBaseCardTableConfig =
      new TherapeuticPlanProtocolsBaseCardTableConfig(
        this.protocolTherapeuticPlanStore,
        this.alertService
      );
    this.therapeuticPlanProtocolsBaseCardTableConfig.actualOptions =
      ProtocolTherapeuticPlanOptionsOfForm(this.form);
    this.therapeuticPlanProtocolsBaseCardTableConfig.refreshRegisters();
  }
  private _initSelectOptions(): void {
    this.protocolStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (items) => (this.protocolsSelectOptions = items),
      });
  }
}
