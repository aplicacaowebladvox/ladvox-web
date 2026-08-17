import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectOptionModel } from '../../../../../core/models/select-option.model';
import {
  FormOfMyProtocolsOptions,
  MyProtocolsOptions,
  MyProtocolsOptionsOfForm,
} from '../../../../../models/options/my-protocols.options';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseCardTableConfig } from '../../../../shared/components/card-table/config/base-card-table.config';
import { CardTableComponent } from '../../../../shared/components/card-table/card-table.component';
import { ActionCardTableComponent } from '../../../../shared/components/card-table/action-card-table.component';
import { BaseFilterGridOptions } from '../../../../shared/components/card-table/models/base-filter-grid-options.model';
import { ProtocolTherapeuticPlanStore } from '../../../../../core/stores/protocol-therapeutic-plan.store';
import { AlertService } from '../../../../../core/services/alert.provided.service';
import { SearchReturn } from '../../../../../core/models/search-return.model';
import { ConvertUtils } from '../../../../shared/utils/convert.utils';
import { ColumnCardTableConfig } from '../../../../shared/components/card-table/config/column-card-table.config';
import { BaseCardTableActionConfig } from '../../../../shared/components/card-table/config/base-card-table-action.config';
import { AuthService } from '../../../../authentication/services/auth.service';
import { alertApiError } from '../../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-my-protocols-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DropdownModule,
    CardTableComponent,
    ActionCardTableComponent,
  ],
  templateUrl: './my-protocols-list.component.html',
  styleUrl: './my-protocols-list.component.scss',
  providers: [ProtocolTherapeuticPlanStore],
})
export class MyProtocolsListComponent implements OnInit {
  form!: FormGroup;
  orderBySelectOptions!: SelectOptionModel<string, string>[];
  showAs: 'list' | 'card' = 'card';
  myProtocolsCardTableConfig!: MyProtocolsCardTableConfig;
  viewAnswerCardTableActionConfig!: ViewAnswerCardTableActionConfig;
  answerCardTableActionConfig!: AnswerCardTableActionConfig;
  protocols!: any[];
  greetings?: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private protocolTherapeuticPlanStore: ProtocolTherapeuticPlanStore,
    private alertService: AlertService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this._initSelectOptions();
    this._initGrid();
    this._initForm();
    this.greetings = ConvertUtils.generateGreetings(this.authService.getUser()?.name);
  }
  goHome(): void {
    this.router.navigate(['home']);
  }
  clickFilter(): void {
    this.myProtocolsCardTableConfig.actualOptions = MyProtocolsOptionsOfForm(this.form);
    this.myProtocolsCardTableConfig.refreshRegisters();
  }
  private _initForm(): void {
    this.form = FormOfMyProtocolsOptions();
    this.form.valueChanges.subscribe({
      next: () => this.clickFilter(),
    });
    this.clickFilter();
  }
  private _initSelectOptions(): void {
    this.orderBySelectOptions = [
      {
        id: 'requestDate_asc',
        name: 'Mais antigos primeiro',
      },
      {
        id: 'requestDate_desc',
        name: 'Mais recentes primeiro',
      },
    ] as SelectOptionModel<string, string>[];
  }
  private _initGrid(): void {
    this.myProtocolsCardTableConfig = new MyProtocolsCardTableConfig(
      this.protocolTherapeuticPlanStore,
      this.alertService
    );
    this.viewAnswerCardTableActionConfig = new ViewAnswerCardTableActionConfig(
      this.router,
      this.activatedRoute
    );
    this.answerCardTableActionConfig = new AnswerCardTableActionConfig(
      this.router,
      this.activatedRoute
    );
  }
}

class MyProtocolsCardTableConfig extends BaseCardTableConfig {
  get actualOptions(): MyProtocolsOptions {
    return <MyProtocolsOptions>this.options;
  }
  set actualOptions(op: MyProtocolsOptions) {
    op.page = this.options.page;
    op.pageSize = this.options.pageSize;
    if (op.orderBy == 'requestDate_desc') {
      op.orderByFilters = [
        {
          field: 'requestDate',
          typeOrder: 'desc',
          orderPriority: 1,
        },
      ] as BaseFilterGridOptions[];
    } else {
      op.orderByFilters = [
        {
          field: 'requestDate',
          typeOrder: 'asc',
          orderPriority: 1,
        },
      ] as BaseFilterGridOptions[];
    }
    this.options = <MyProtocolsOptions>op;
  }
  constructor(
    private store: ProtocolTherapeuticPlanStore,
    private alertService: AlertService
  ) {
    super();
    this.showActionsAsModalForSelect = true;
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.store
      .searchMyProtocols(this.actualOptions)
      .pipe(alertApiError())
      .subscribe({
        next: (searchReturn: SearchReturn) => {
          this.totalRegisters = searchReturn.totalRegisters;
          this.registers = searchReturn.registers;
        },
      });
  }

  private _mountColumns(): ColumnCardTableConfig[] {
    return [
      {
        title: 'Protocolo',
        field: 'protocolName',
        sortable: false,
        convertByLine: (line) => line.protocolAbbreviation + ': ' + line.protocolName,
        width: 100,
      },
      {
        title: 'Solicitado',
        field: 'requestDate',
        sortable: false,
        convert: (value: Date) => ConvertUtils.dateToFormatedString(value),
        width: 50,
      },
      {
        title: 'Data de resposta',
        field: 'answeredDate',
        sortable: false,
        convert: (value: Date) => ConvertUtils.dateToFormatedString(value) || 'Aguardando resposta',
        width: 25,
      },
    ] as ColumnCardTableConfig[];
  }
}

class ViewAnswerCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.iconClass = 'fa-solid fa-eye';
    this.tooltip = 'Checar respostas';
    this.customClass = 'x-large';
  }
  override isVisible(line: any): boolean {
    return !!line.answeredDate;
  }
  public override click(line: any): void {
    this.router.navigate([line.id], {
      relativeTo: this.activatedRoute,
      queryParams: {
        editing: false,
      },
    });
  }
}

class AnswerCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.iconClass = 'fa-solid fa-comment-medical';
    this.tooltip = 'Responder';
    this.customClass = 'x-large';
  }
  override isVisible(line: any): boolean {
    return !line.answeredDate;
  }
  public override click(line: any): void {
    this.router.navigate([line.id], {
      relativeTo: this.activatedRoute,
      queryParams: {
        editing: true,
      },
    });
  }
}
