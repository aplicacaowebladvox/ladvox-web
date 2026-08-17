import { AuthService } from './../../../../authentication/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HasPermissionDirective } from '../../../../../core/has-permission.directive';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { TherapeuticPlanStore } from '../../../../../core/stores/therapeutic-plan.store';
import {
  FormOfTherapeuticTextPlanModel,
  TherapeuticTextPlanModelOfForm,
} from '../../../../../models/therapeutic-text-plan.model';
import { AlertService } from '../../../../../core/services/alert.provided.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-therapeutic-plan-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorModule, NgxSkeletonLoaderModule],
  templateUrl: './therapeutic-plan-text.component.html',
  styleUrl: './therapeutic-plan-text.component.scss',
})
export class TherapeuticPlanTextComponent implements OnInit {
  @Input()
  therapeuticPlanId!: number;
  @Input()
  editing!: boolean;

  form!: FormGroup;
  userId?: string = undefined;
  userName?: string = undefined;
  constructor(
    private therapeuticPlanStore: TherapeuticPlanStore,
    private alertService: AlertService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.userName = this.authService.getUser()?.name;
    this.userId = this.authService.getUser()?.sub;
    this._initForm();
  }
  clickSave(): void {
    this.therapeuticPlanStore
      .updateTherapeuticTextPlan(this.therapeuticPlanId, TherapeuticTextPlanModelOfForm(this.form))
      .pipe(alertApiError())
      .subscribe({
        next: () => {
          this.alertService.showSuccess({ message: 'Texto atualizado com sucesso' });
        },
      });
  }
  private _initForm(): void {
    this.therapeuticPlanStore
      .getTherapeuticTextPlan(this.therapeuticPlanId)
      .pipe(alertApiError())
      .subscribe({
        next: (model) => {
          this.form = FormOfTherapeuticTextPlanModel(model);
        },
      });
  }
}
