import { ViewAnswerCardTableActionConfig } from './../../configs/therapeutic-plan-protocols-card-table.config';
import { ProtocolTherapeuticPlanStore } from './../../../../../core/stores/protocol-therapeutic-plan.store';
import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { SelectOptionModel } from '../../../../../core/models/select-option.model';
import { ProtocolStore } from '../../../../../core/stores/protocol.store';
import { AlertService } from '../../../../../core/services/alert.provided.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormOfProtocolTherapeuticPlanModel,
  ProtocolTherapeuticPlanModel,
  ProtocolTherapeuticPlanModelOfForm,
} from '../../../../../models/protocol-therapeutic-plan.model';
import { TherapeuticPlanProtocolsBaseCardTableConfig } from '../../configs/therapeutic-plan-protocols-card-table.config';
import { CardTableComponent } from '../../../../shared/components/card-table/card-table.component';
import { ActionCardTableComponent } from '../../../../shared/components/card-table/action-card-table.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
import { ProtocolTherapeuticPlanOptions } from '../../../../../models/options/protocol-therapeutic-plan.options';
import { HasPermissionDirective } from '../../../../../core/has-permission.directive';
import { BaseCardTableActionConfig } from '../../../../shared/components/card-table/config/base-card-table-action.config';
import { ProtocolTherapeuticPlanGrid } from '../../../../../models/grid/protocol-therapeutic-plan.grid';
import { alertApiError } from '../../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-therapeutic-plan-protocols',
  standalone: true,
  imports: [
    DropdownModule,
    CommonModule,
    ReactiveFormsModule,
    CardTableComponent,
    ActionCardTableComponent,
    HasPermissionDirective,
  ],
  templateUrl: './therapeutic-plan-protocols.component.html',
  styleUrl: './therapeutic-plan-protocols.component.scss',
  providers: [ProtocolStore, ProtocolTherapeuticPlanStore],
})
export class TherapeuticPlanProtocolsComponent implements OnInit {
  @Input()
  therapeuticPlanId!: number;
  @Input()
  editing!: boolean;

  form!: FormGroup;
  protocolSelectOptions!: SelectOptionModel<number, string>[];

  therapeuticPlanProtocolsBaseCardTableConfig!: TherapeuticPlanProtocolsBaseCardTableConfig;
  viewAnswerCardTableActionConfig!: ViewAnswerCardTableActionConfig;
  cancelRequestCardTableActionConfig!: CancelRequestCardTableActionConfig;

  constructor(
    private protocolStore: ProtocolStore,
    private alertService: AlertService,
    private protocolTherapeuticPlanStore: ProtocolTherapeuticPlanStore,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this._initForm();
    this._initSelectOptions();
    this._initGrid();
  }
  clickAdd(): void {
    this.protocolTherapeuticPlanStore
      .insert(ProtocolTherapeuticPlanModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: () => {
          this._initForm();
          this.refreshGrid();
        },
      });
    console.log(JSON.stringify(ProtocolTherapeuticPlanModelOfForm(this.form)));
  }
  refreshGrid(): void {
    this.therapeuticPlanProtocolsBaseCardTableConfig.refreshRegisters();
  }
  private _initForm(): void {
    this.form = FormOfProtocolTherapeuticPlanModel({
      therapeuticPlanId: this.therapeuticPlanId,
      requestDate: new Date(),
    } as ProtocolTherapeuticPlanModel);
  }
  private _initSelectOptions(): void {
    this.protocolStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (options) => {
          this.protocolSelectOptions = options;
        },
      });
  }
  private _initGrid(): void {
    this.therapeuticPlanProtocolsBaseCardTableConfig =
      new TherapeuticPlanProtocolsBaseCardTableConfig(
        this.protocolTherapeuticPlanStore,
        this.alertService
      );
    this.viewAnswerCardTableActionConfig = new ViewAnswerCardTableActionConfig(
      this.router,
      this.authService,
      'atendimento.plano-terapeutico.protocolo-repondido-view'
    );
    this.therapeuticPlanProtocolsBaseCardTableConfig.actualOptions = {
      therapeuticPlanId: this.therapeuticPlanId,
    } as ProtocolTherapeuticPlanOptions;
    this.cancelRequestCardTableActionConfig = new CancelRequestCardTableActionConfig(
      this.protocolTherapeuticPlanStore,
      this.authService,
      this
    );
    this.therapeuticPlanProtocolsBaseCardTableConfig.refreshRegisters();
  }
}

class CancelRequestCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private protocolTherapeuticPlanStore: ProtocolTherapeuticPlanStore,
    private authService: AuthService,
    private parent: TherapeuticPlanProtocolsComponent
  ) {
    super();
    this.iconClass = 'fa-solid fa-xmark';
    this.tooltip = 'Cancelar solicitação';
    this._hasPermission = this.authService.hasPermission(
      'atendimento.plano-terapeutico.form.novo-protocolo'
    );
  }
  private _hasPermission: boolean = false;
  override isVisible(line: ProtocolTherapeuticPlanGrid): boolean {
    return this._hasPermission && !line.answeredDate;
  }
  public override click(line: ProtocolTherapeuticPlanGrid): void {
    this.protocolTherapeuticPlanStore
      .delete(line.id)
      .pipe(alertApiError())
      .subscribe({
        next: () => this.parent.refreshGrid(),
      });
  }
}
