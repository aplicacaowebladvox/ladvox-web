import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import { dateToString, stringToDate } from '../../../shared/utils/date.util';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { ConvertUtils } from '../../../shared/utils/convert.utils';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchReturn } from '../../../../core/models/search-return.model';
import { PatientStore } from '../../../../core/stores/patient.store';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AuthService } from '../../../authentication/services/auth.service';
import {
  FormOfPatientOptionsModel,
  PatientOptionsModel,
  PatientOptionsModelOfForm,
} from '../../../../models/options/patient.options';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    ActionCardTableComponent,
    CardTableComponent,
    HasPermissionDirective,
  ],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.scss',
  providers: [provideNgxMask(), PatientStore],
})
export class PatientsListComponent implements OnInit {
  form!: FormGroup;
  cardTableModel!: PatientBaseCardTableConfig;
  editCardTableActionConfig: EditCardTableActionConfig = new EditCardTableActionConfig(
    this.router,
    this.activatedRoute,
    this.authService
  );
  anamnesisCardTableActionConfig: AnamnesisCardTableActionConfig =
    new AnamnesisCardTableActionConfig(this.router, this.activatedRoute, this.authService);
  viewCardTableActionConfig: ViewCardTableActionConfig = new ViewCardTableActionConfig(
    this.router,
    this.activatedRoute
  );
  protocolCardTableActionConfig: ProtocolCardTableActionConfig = new ProtocolCardTableActionConfig(
    this.router
  );
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private patientStore: PatientStore,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._initTable();
    this._initForm();
  }
  clickClean(): void {
    this._initForm();
    this.cardTableModel.clear();
  }
  clickFilter(): void {
    this.cardTableModel.actualOptions = PatientOptionsModelOfForm(this.form);
    this.cardTableModel.refreshRegisters();
  }
  clickAddNew(): void {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute });
  }

  private _initTable(): void {
    this.cardTableModel = new PatientBaseCardTableConfig(this.patientStore, this.alertService);
  }

  private _initForm(): void {
    this.form = FormOfPatientOptionsModel();
  }
}

class PatientBaseCardTableConfig extends BaseCardTableConfig {
  get actualOptions(): PatientOptionsModel {
    return <PatientOptionsModel>this.options;
  }
  set actualOptions(op: PatientOptionsModel) {
    (<PatientOptionsModel>this.options).page = 1;
    (<PatientOptionsModel>this.options).id = op.id;
    (<PatientOptionsModel>this.options).name = op.name;
    (<PatientOptionsModel>this.options).document = op.document;
    (<PatientOptionsModel>this.options).ageStarts = op.ageStarts;
    (<PatientOptionsModel>this.options).ageEnds = op.ageEnds;
  }
  constructor(
    private patientStore: PatientStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  public override refreshRegisters(): void {
    this.patientStore
      .search(this.options)
      .pipe(alertApiError())
      .subscribe({
        next: (searchReturn: SearchReturn) => {
          this.registers = searchReturn.registers;
          this.totalRegisters = searchReturn.totalRegisters;
        },
      });
  }

  private _mountColumns(): ColumnCardTableConfig[] {
    return [
      {
        title: 'Nome',
        field: 'name',
        sortable: true,
        width: 65,
      },
      {
        title: 'Documento',
        field: 'document',
        sortable: true,
        convert: (value: string) => {
          if (!value) return '';
          if (value.length == 11)
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
          if (value.length == 14)
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
          else return value;
        },
        width: 15,
      },
      {
        title: 'Data de nascimento',
        field: 'birthDate',
        sortable: true,
        convert: (value: Date) => dateToString(value, false),
        width: 10,
      },
      {
        title: 'Idade',
        field: 'age',
        sortable: true,
        width: 10,
      },
    ] as ColumnCardTableConfig[];
  }
}

class EditCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    super();
    this.iconClass = 'fa-solid fa-pencil';
    this.tooltip = 'Editar';
    this._hasPermission = this.authService.hasPermission('paciente.paciente.form.edit');
  }
  private _hasPermission: boolean = false;
  override isVisible(line: any): boolean {
    return this._hasPermission;
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

class AnamnesisCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    super();
    this.iconClass = 'fa-solid fa-comments';
    this.tooltip = 'Anamnese';
    this._hasPermission = this.authService.hasPermission('paciente.anamnese.view');
  }
  private _hasPermission: boolean = false;
  override isVisible(line: any): boolean {
    return this._hasPermission;
  }
  public override click(line: any): void {
    this.router.navigate([line.id, 'anamnese'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        patientName: line.name,
      },
    });
  }
}

class ViewCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.iconClass = 'fa-solid fa-eye';
    this.tooltip = 'Visualizar';
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

class ProtocolCardTableActionConfig extends BaseCardTableActionConfig {
  constructor(private router: Router) {
    super();
    this.iconClass = 'fa-solid fa-file-invoice';
    this.tooltip = 'Plano terapêutico';
  }
  public override click(line: any): void {
    this.router.navigate(['plano-terapeutico'], {
      queryParams: {
        editing: false,
        pacienteId: line.id,
      },
    });
  }
}
