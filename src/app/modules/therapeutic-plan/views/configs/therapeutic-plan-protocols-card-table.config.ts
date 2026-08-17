import { AuthService } from './../../../authentication/services/auth.service';
import { Router } from '@angular/router';
import { SearchReturn } from '../../../../core/models/search-return.model';
import { TherapeuticPlanStore } from '../../../../core/stores/therapeutic-plan.store';
import { ProtocolTherapeuticPlanGrid } from '../../../../models/grid/protocol-therapeutic-plan.grid';
import { ProtocolTherapeuticPlanOptions } from '../../../../models/options/protocol-therapeutic-plan.options';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import { ConvertUtils } from '../../../shared/utils/convert.utils';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { ProtocolTherapeuticPlanStore } from '../../../../core/stores/protocol-therapeutic-plan.store';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

export class TherapeuticPlanProtocolsBaseCardTableConfig extends BaseCardTableConfig {
  get actualOptions(): ProtocolTherapeuticPlanOptions {
    return <ProtocolTherapeuticPlanOptions>this.options;
  }
  set actualOptions(op: ProtocolTherapeuticPlanOptions) {
    op.page = this.options.page;
    op.pageSize = this.options.pageSize;
    op.orderByFilters = this.options.orderByFilters;
    this.options = <ProtocolTherapeuticPlanOptions>op;
  }
  constructor(
    private store: ProtocolTherapeuticPlanStore,
    private alertService: AlertService,
    private showResultDescription: boolean = false
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.store
      .search(this.actualOptions)
      .pipe(alertApiError())
      .subscribe({
        next: (searchReturn: SearchReturn) => {
          this.totalRegisters = searchReturn.totalRegisters;
          this.registers = searchReturn.registers;
        },
      });
  }

  private _mountColumns(): ColumnCardTableConfig[] {
    let columns = [
      {
        title: 'Protocolo',
        field: 'protocolDescription',
        sortable: false,
        width: 50,
      },
      {
        title: 'Data solicitação',
        field: 'requestDate',
        sortable: true,
        convert: (value: Date) => ConvertUtils.dateToFormatedString(value),
        width: 25,
      },
      {
        title: 'Data de resposta',
        field: 'answeredDate',
        sortable: true,
        convert: (value: Date) => ConvertUtils.dateToFormatedString(value) || 'N/A',
        width: 25,
      },
    ] as ColumnCardTableConfig[];
    if (this.showResultDescription)
      columns.push({
        title: 'Resultado',
        field: 'resultsDescription',
        sortable: true,
        width: 100,
      } as ColumnCardTableConfig);
    return columns;
  }
}

export class ViewAnswerCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private router: Router,
    private authService: AuthService,
    permission: string
  ) {
    super();
    this.iconClass = 'fa-solid fa-comment-medical';
    this.tooltip = 'Respostas';
    this._hasPermission = this.authService.hasPermission(permission);
  }
  private _hasPermission: boolean = false;
  override isVisible(line: ProtocolTherapeuticPlanGrid): boolean {
    return this._hasPermission && !!line.answeredDate;
  }
  public override click(line: ProtocolTherapeuticPlanGrid): void {
    this.router.navigate(['plano-terapeutico', line.therapeuticPlanId, 'protocolo', line.id]);
  }
}
