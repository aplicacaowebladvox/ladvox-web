import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectOptionExtraAttributeModel } from '../../../../core/models/select-option.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { EducationStore } from '../../../../core/stores/education.store';
import { GenderStore } from '../../../../core/stores/gender.store';
import { PatientStore } from '../../../../core/stores/patient.store';
import { AuthService } from '../../../authentication/services/auth.service';
import { ConvertUtils } from '../../../shared/utils/convert.utils';
import { UserStore } from '../../../../core/stores/user.store';
import { DropdownModule } from 'primeng/dropdown';
import { FormOfUserMyDataModel } from '../../../../models/user-my-data.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AvatarModule } from 'primeng/avatar';
import { ProfileImageUpdaterComponent } from '../../../../core/components/profile-image-updater/profile-image-updater.component';
import { PatientModelOfForm } from '../../../../models/patient.model';
import { UserModel, UserModelOfForm } from '../../../../models/user.model';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-user-data-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DropdownModule,
    NgxMaskDirective,
    ProfileImageUpdaterComponent,
  ],
  templateUrl: './user-data-form.component.html',
  styleUrl: './user-data-form.component.scss',
  providers: [PatientStore, UserStore, GenderStore, EducationStore, provideNgxMask()],
})
export class UserDataFormComponent implements OnInit {
  form!: FormGroup;

  genderSelectOptions!: SelectOptionExtraAttributeModel<number, string, boolean>[];
  educationSelectOptions!: SelectOptionExtraAttributeModel<number, string, boolean>[];
  age(birthDate: string): string {
    let birthDateAsDate = ConvertUtils.stringToDate(birthDate);
    if (!birthDateAsDate) return '';
    return ConvertUtils.age(birthDateAsDate);
  }
  get initials(): string {
    if (!this.form || !this.form.getRawValue() || !this.form.getRawValue().name) return 'U';
    let name = this.form.getRawValue().name;
    let parts: string[] = name.split();
    if (parts.length > 1) {
      return parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1);
    }
    return parts[0].substring(0, 2);
  }
  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userStore: UserStore,
    private patientStore: PatientStore,
    private genderStore: GenderStore,
    private educationStore: EducationStore,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this._loadPage();
  }
  clickBack(): void {}
  clickSave(): void {
    if (this.form.getRawValue().id) {
      this.patientStore
        .update(this.form.getRawValue().id, PatientModelOfForm(this.form))
        .pipe(alertApiError())
        .subscribe({
          next: () => {
            this.router.navigate(['home']);
          },
        });
    } else {
      this.userStore.updateBaseData(this.form.getRawValue().userId, {
        id: this.form.getRawValue().userId,
        name: this.form.getRawValue().name,
        document: this.form.getRawValue().document,
        birthDate: ConvertUtils.stringToDate(this.form.getRawValue().birthDate),
      } as UserModel);
    }
  }
  private _loadPage(): void {
    this._getMyData();
    this._initGenderSelectOptions();
    this._initEducationSelectOptions();
  }
  private _getMyData(): void {
    this.userStore
      .getMyData()
      .pipe(alertApiError())
      .subscribe({
        next: (data) => {
          this.form = FormOfUserMyDataModel(data);
          this._changeFormControlStatus(this.form, true);
          this._selectGender();
          this._selectEducation();
        },
      });
  }
  private _initGenderSelectOptions(): void {
    this.genderStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (options) => {
          this.genderSelectOptions = options;
          this._selectGender();
        },
      });
  }
  private _initEducationSelectOptions(): void {
    this.educationStore
      .getSelectOptions()
      .pipe(alertApiError())
      .subscribe({
        next: (options) => {
          this.educationSelectOptions = options;
          this._selectEducation();
        },
      });
  }
  private _selectGender(): void {
    if (!this.form || !this.genderSelectOptions) return;
    this.form.controls['genderSelected'].setValue(
      this.genderSelectOptions.find(
        (o) => o.id == (this.form.getRawValue().genderSelected || { id: undefined }).id
      )
    );
  }
  private _selectEducation(): void {
    if (!this.form || !this.educationSelectOptions) return;
    this.form.controls['educationSelected'].setValue(
      this.educationSelectOptions.find(
        (o) => o.id == (this.form.getRawValue().educationSelected || { id: undefined }).id
      )
    );
  }
  private _changeFormControlStatus(f: FormGroup, enable: boolean = false): void {
    enable ? f.enable() : f.disable();
    enable ? f.getRawValue().addressForm.enable() : f.getRawValue().addressForm.disable();
    f.controls['document'].disable();
  }
}
