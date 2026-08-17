import { SearchReturn } from './../../../../core/models/search-return.model';
import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { BaseCardTableConfig } from '../../../shared/components/card-table/config/base-card-table.config';
import { ColumnCardTableConfig } from '../../../shared/components/card-table/config/column-card-table.config';
import { dateToString } from '../../../shared/utils/date.util';
import { CardTableComponent } from '../../../shared/components/card-table/card-table.component';
import { BaseCardTableActionConfig } from '../../../shared/components/card-table/config/base-card-table-action.config';
import { ActionCardTableComponent } from '../../../shared/components/card-table/action-card-table.component';
import {
  AnamnesisPatientOptions,
  AnamnesisPatientOptionsOfForm,
  FormOfAnamnesisPatientOptions,
} from '../../../../models/options/anamnesis-patient.options';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnamnesisPatientStore } from '../../../../core/stores/anamnesis-patient.store';
import { DropdownModule } from 'primeng/dropdown';
import { SelectOptionModel } from '../../../../core/models/select-option.model';
import { UserStore } from '../../../../core/stores/user.store';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AuthService } from '../../../authentication/services/auth.service';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { PatientStore } from '../../../../core/stores/patient.store';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-patients-anamnesis',
  standalone: true,
  imports: [
    ActionCardTableComponent,
    CommonModule,
    EditorModule,
    FileUploadModule,
    CardTableComponent,
    DropdownModule,
    HasPermissionDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './patients-anamnesis.component.html',
  styleUrl: './patients-anamnesis.component.scss',
  providers: [AnamnesisPatientStore, UserStore, PatientStore],
})
export class PatientsAnamnesisComponent implements OnInit {
  @Input()
  private id!: number;
  patientName!: string;
  form!: FormGroup;
  anamnesisCardTable!: AnamnesisCardTableConfig;
  editCardTableActionConfig!: EditCardTableActionConfig;
  viewCardTableActionConfig!: ViewCardTableActionConfig;
  therapistsSelectOptions!: SelectOptionModel<string, string>[];
  constructor(
    private location: Location,
    private patientStore: PatientStore,
    private anamnesiPatientStore: AnamnesisPatientStore,
    private userStore: UserStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._loadPage();
  }

  clickBack(): void {
    this.location.back();
  }

  clickClean(): void {
    this.form.controls['therapistId'].setValue(null);
    this.form.controls['createdDateStarts'].setValue(null);
    this.form.controls['createdDateEnds'].setValue(null);
    this.anamnesisCardTable.clear();
  }
  clickFilter(): void {
    this.anamnesisCardTable.actualOptions = AnamnesisPatientOptionsOfForm(this.form);
    this.anamnesisCardTable.refreshRegisters();
  }

  clickAddNew(): void {
    this.router.navigate(['form'], {
      relativeTo: this.activatedRoute,
      queryParams: { patientName: this.patientName },
    });
  }
  private _loadPage(): void {
    this.form = FormOfAnamnesisPatientOptions({ patientId: this.id } as AnamnesisPatientOptions);
    this.patientStore
      .getSelectOptions(this.id)
      .pipe(alertApiError())
      .subscribe({
        next: (options) => {
          if (options && options.length > 0) this.patientName = options[0].name;
        },
      });
    this._initGrid();
    this._initSelectOptions();
  }
  private _initGrid(): void {
    this.anamnesisCardTable = new AnamnesisCardTableConfig(
      this.anamnesiPatientStore,
      this.alertService
    );
    this.editCardTableActionConfig = new EditCardTableActionConfig(
      this.router,
      this.activatedRoute,
      this.authService
    );
    this.viewCardTableActionConfig = new ViewCardTableActionConfig(
      this.router,
      this.activatedRoute
    );
    this.anamnesisCardTable.actualOptions = AnamnesisPatientOptionsOfForm(this.form);
    this.anamnesisCardTable.refreshRegisters();
  }
  private _initSelectOptions(): void {
    this.userStore
      .getSelectOptions(true)
      .pipe(alertApiError())
      .subscribe({
        next: (options) => (this.therapistsSelectOptions = options),
      });
  }
}

class AnamnesisCardTableConfig extends BaseCardTableConfig {
  constructor(
    private store: AnamnesisPatientStore,
    private alertService: AlertService
  ) {
    super();
    this.columns = this._mountColumns();
  }
  set actualOptions(op: AnamnesisPatientOptions) {
    (<AnamnesisPatientOptions>this.options).page = 1;
    (<AnamnesisPatientOptions>this.options).id = op.id;
    (<AnamnesisPatientOptions>this.options).patientId = op.patientId;
    (<AnamnesisPatientOptions>this.options).therapistId = op.therapistId;
    (<AnamnesisPatientOptions>this.options).createdDateStarts = op.createdDateStarts;
    (<AnamnesisPatientOptions>this.options).createdDateEnds = op.createdDateEnds;
  }
  public override refreshRegisters(): void {
    this.store
      .search(<AnamnesisPatientOptions>this.options)
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
        title: 'Terapeuta',
        field: 'therapistName',
        sortable: true,
        width: 90,
      },
      {
        title: 'Data de criação',
        field: 'createdDate',
        sortable: true,
        convert: (value: Date) => dateToString(value, false),
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
    this._hasPermission = this.authService.hasPermission('paciente.anamnese.form.edit');
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
