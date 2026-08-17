import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MedicalAppointmentPlanningMock } from '../../../../mocks/medical-appointment-planning/medical-appointment-planning.mock';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormOfMedicalAppointmentPlanningModel,
  MedicalAppointmentPlanningModel,
} from '../../../../models/medical-appointment-planning.model';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';
import {
  FormOfTeamMedicalAppointmentPlanningModel,
  TeamMedicalAppointmentPlanningModel,
  TeamMedicalAppointmentPlanningModelOfForm,
} from '../../../../models/team-medical-appointment-planning.model';
import { FormOfMedicalAppointmentModel } from '../../../../models/medical-appointment.model';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserModel } from '../../../../models/user.model';
import { UserModelMock } from '../../../../mocks/user/user.mock';
import { PatientModel } from '../../../../models/patient.model';
import { PatientModelMock } from '../../../../mocks/patient/patient.mock';
import { WeekdayEnum } from '../../../../models/enum/weekday.enum';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-medical-appointment-planning-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TabComponent, DropdownModule, MultiSelectModule],
  templateUrl: './medical-appointment-planning-form.component.html',
  styleUrl: './medical-appointment-planning-form.component.scss',
})
export class MedicalAppointmentPlanningFormComponent implements OnInit {
  @Input()
  id?: number;
  form!: FormGroup;
  medicalAppointmentPlanning!: MedicalAppointmentPlanningModel;
  tabItems!: TabItem[];
  therapistsAvailables?: UserModel[];
  teamsAvailablesSelectOptions?: TeamMedicalAppointmentPlanningModel[];
  patientsAvailablesSelecOptions?: PatientModel[];
  weekdaySelectOptions?: WeekdayEnum[] = WeekdayEnum.getAll();
  constructor(
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    if (this.id) {
      MedicalAppointmentPlanningMock.getById(this.id)
        .pipe(alertApiError())
        .subscribe({
          next: (medicalAppointmentPlanning: MedicalAppointmentPlanningModel) => {
            this.medicalAppointmentPlanning = medicalAppointmentPlanning;
            this._initForm();
          },
        });
    } else {
      this.medicalAppointmentPlanning = {} as MedicalAppointmentPlanningModel;
      this._initForm();
    }
  }

  canShow(field: string): boolean {
    switch (field) {
      case 'buttonSave':
        return !!this.id;
      case 'buttonCreate':
        return !this.id;
      case 'buttonAddTeam':
        return this.tabItems && this.tabItems.length > 1 && this.tabItems[1].isActive == true;
      case 'buttonAddMedicalAppointment':
        return this.tabItems && this.tabItems.length > 2 && this.tabItems[2].isActive == true;
    }
    return true;
  }
  clickBack(): void {}
  clickSave(): void {}
  clickCreate(): void {}
  clickAddTeam(): void {
    this.form.controls['teamsForms'].setValue([
      ...this.form.getRawValue().teamsForms,
      FormOfTeamMedicalAppointmentPlanningModel(),
    ]);
    this.refreshTeamsAvailablesSelectOptions();
  }
  clickRemoveTeam(teamFormIndex: number): void {
    this.form.controls['teamsForms'].setValue([
      ...(<FormGroup[]>this.form.getRawValue().teamsForms).filter((tf, i) => i != teamFormIndex),
    ]);
    this.refreshTeamsAvailablesSelectOptions();
  }
  clickAddMedicalAppointment(): void {
    this.form.controls['medicalAppointmentForms'].setValue([
      ...this.form.getRawValue().medicalAppointmentForms,
      FormOfMedicalAppointmentModel(),
    ]);
  }
  clickRemoveMedicalAppointment(medicalAppointmentFormIndex: number): void {
    this.form.controls['medicalAppointmentForms'].setValue([
      ...(<FormGroup[]>this.form.getRawValue().medicalAppointmentForms).filter(
        (tf, i) => i != medicalAppointmentFormIndex
      ),
    ]);
  }

  private _initForm(): void {
    this.form = FormOfMedicalAppointmentPlanningModel(this.medicalAppointmentPlanning);
    // this.form = new FormBuilder().group({
    //   id: [this.medicalAppointmentPlanning.id],
    //   name: [this.medicalAppointmentPlanning.name],
    //   validityRange: [
    //     [
    //       this.medicalAppointmentPlanning.initialValidity,
    //       this.medicalAppointmentPlanning.finalValidity,
    //     ],
    //   ],
    //   teamsForms: [
    //     (this.medicalAppointmentPlanning.teams || []).map((t) =>
    //       FormOfTeamMedicalAppointmentPlanningModel(t)
    //     ),
    //   ],
    //   teams: [this.medicalAppointmentPlanning.teams],
    //   medicalAppointmentForms: [
    //     (this.medicalAppointmentPlanning.medicalAppointment || []).map((ma) =>
    //       FormOfMedicalAppointmentModel(ma)
    //     ),
    //   ],
    //   medicalAppointment: [this.medicalAppointmentPlanning.medicalAppointment || []],
    // });
    this.tabItems = [
      {
        isDisabled: false,
        displayName: 'Dados base',
        isActive: true,
        breakSize: undefined,
        titleSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Equipes',
        isActive: false,
        breakSize: undefined,
        titleSize: undefined,
      },
      {
        isDisabled: false,
        displayName: 'Pacientes',
        isActive: false,
        breakSize: undefined,
        titleSize: undefined,
      },
    ];
    (<FormGroup[]>this.form.getRawValue().teamsForms).forEach((teamForm) => {
      teamForm.valueChanges.pipe(alertApiError()).subscribe({
        next: (value) => {
          this.refreshTeamsAvailablesSelectOptions();
        },
      });
    });
    this.therapistsAvailables = UserModelMock.getAll();
    this.refreshTeamsAvailablesSelectOptions();
    this.patientsAvailablesSelecOptions = PatientModelMock.getAll();
  }
  refreshTeamsAvailablesSelectOptions(): void {
    this.teamsAvailablesSelectOptions = (<FormGroup[]>this.form.getRawValue().teamsForms).map(
      (fg) => TeamMedicalAppointmentPlanningModelOfForm(fg)
    );
  }
}
