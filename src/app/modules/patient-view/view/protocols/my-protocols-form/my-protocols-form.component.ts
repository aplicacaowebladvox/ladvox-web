import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProtocolTherapeuticPlanStore } from '../../../../../core/stores/protocol-therapeutic-plan.store';
import { ProtocolTherapeuticPlanModel } from '../../../../../models/protocol-therapeutic-plan.model';
import { ConvertUtils } from '../../../../shared/utils/convert.utils';
import { ProtocolStore } from '../../../../../core/stores/protocol.store';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert.provided.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { MyProtocolModel } from '../../../../../models/my-protocol.model';
import { QuestionProtocolModel } from '../../../../../models/question-protocol.model';
import { AnswerTypeProtocolModel } from '../../../../../models/answer-type-protocol.model';
import * as uuid from 'uuid';
import { AnswerQuestionProtocolModel } from '../../../../../models/answer-question-protocol.model';
import { NotHasRoleDirective } from '../../../../../core/not-has-role.directive';
import { ProtocolResultComponent } from '../../../../../core/components/protocol-result/protocol-result.component';
import { alertApiError } from '../../../../../core/operators/api-alert-error.operator';
import { HasRoleDirective } from '../../../../../core/has-role.directive';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-my-protocols-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NotHasRoleDirective,
    ProtocolResultComponent,
    HasRoleDirective,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './my-protocols-form.component.html',
  styleUrl: './my-protocols-form.component.scss',
  providers: [ProtocolTherapeuticPlanStore, ProtocolStore],
})
export class MyProtocolsFormComponent implements OnInit {
  @Input()
  protocolTherapeuticPlanId?: number;

  @Input('protocolId')
  protocolId?: number;

  protocolTherapeuticPlan!: ProtocolTherapeuticPlanModel;
  protocol!: MyProtocolModel;
  public ConvertUtils = ConvertUtils;
  private _editing: boolean | null = null;
  get isReady(): boolean {
    return !!this.protocol && !!this.protocolTherapeuticPlan;
  }
  get isEditing(): boolean {
    return this.protocolTherapeuticPlan && !this.protocolTherapeuticPlan.answeredDate;
  }
  constructor(
    private authService: AuthService,
    private protocolTherapeuticPlanStore: ProtocolTherapeuticPlanStore,
    private protocolStore: ProtocolStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
      },
    });
    this._initProtocolTherapeuticPlan();
  }
  clickBack(): void {
    if (this.protocolId) {
      this.router.navigate(['protocolos', 'form', this.protocolId, 'grupos'], {
        queryParams: {
          editing: this._editing,
        },
      });
    } else {
      if (this.isEditing)
        this.alertService.showConfirm({
          message:
            'Ao sair da página todas as alterções não salvas previamente seão perdidas, tem certeza que deseja executa-la?',
          title: 'Sair sem salvar',
          callbackConfirmFn: () => {
            this.router.navigate(['home']);
          },
        });
      else {
        if (this.authService.hasRole('Paciente')) this.router.navigate(['home']);
        else
          this.router.navigate(
            ['plano-terapeutico', this.protocolTherapeuticPlan.therapeuticPlanId],
            {
              queryParams: {
                editing: this._editing,
                tabIndex: 0,
              },
            }
          );
      }
    }
  }
  clickSave(): void {
    if (!this.protocolTherapeuticPlanId) {
      return;
    }
    if (
      this.protocolTherapeuticPlan.answers.length == 0 ||
      this.protocol.questions.length * this.protocol.answersType.length !=
        this.protocolTherapeuticPlan.answers.length ||
      this.protocolTherapeuticPlan.answers.some((a) => a.answer == null)
    ) {
      this.alertService.showError({
        message: 'Responda todas as perguntas para calcular o resultado.',
      });
    } else {
      this.alertService.showConfirm({
        message: 'Ao enviar as resposta não será possível editá-las, está certo das suas respostas?',
        callbackConfirmFn: () => {
          this.protocolTherapeuticPlanStore
            .saveAnswers(this.protocolTherapeuticPlanId!, this.protocolTherapeuticPlan)
            .pipe(alertApiError())
            .subscribe({
              next: () => {
                this.router.navigate(['home']);
              },
            });
        },
      });
    }
  }
  protocolResultAnswers?: AnswerQuestionProtocolModel[];
  loadingCalculate: boolean = false;
  clickCalculate(): void {
    if (!!this.protocolResultAnswers) {
      if (
        this.protocolResultAnswers.length == 0 ||
        this.protocol.questions.length * this.protocol.answersType.length !=
          this.protocolResultAnswers.length ||
        this.protocolResultAnswers.some((a) => a.answer == null)
      ) {
        this.alertService.showError({
          message: 'Responda todas as perguntas para calcular o resultado.',
        });
      } else {
        this.loadingCalculate = true;
        this.protocolResultAnswers = undefined;
        setTimeout(() => {
          this.protocolResultAnswers = this.protocolTherapeuticPlan.answers;
          this.loadingCalculate = false;
        }, 1000);
      }
    } else {
      this.protocolResultAnswers = this.protocolTherapeuticPlan.answers;
    }
  }
  clickSelect(
    question: QuestionProtocolModel,
    answerType: AnswerTypeProtocolModel,
    value: string | number
  ): void {
    let index = this.protocolTherapeuticPlan.answers.findIndex(
      (answer) => answer.answerTypeId == answerType.id && answer.questionId == question.id
    );
    if (index < 0) {
      this.protocolTherapeuticPlan.answers.push({
        key: uuid.v7(),
        answerTypeId: answerType.id,
        answer: value,
        answerValueType: answerType.answerValueType,
        questionId: question.id,
      } as AnswerQuestionProtocolModel);
    } else {
      this.protocolTherapeuticPlan.answers[index].answer = value;
    }
  }
  isSelected(
    question: QuestionProtocolModel,
    answerType: AnswerTypeProtocolModel,
    value: string | number
  ): boolean {
    return (
      this.protocolTherapeuticPlan.answers.findIndex(
        (answer) =>
          answer.answerTypeId == answerType.id &&
          answer.questionId == question.id &&
          answer.answer == value
      ) >= 0
    );
  }
  value(question: QuestionProtocolModel, answerType: AnswerTypeProtocolModel): number | null {
    let index = this.protocolTherapeuticPlan.answers.findIndex(
      (a) => a.questionId == question.id && a.answerTypeId == answerType.id
    );
    if (index < 0) {
      this.protocolTherapeuticPlan.answers.push({
        key: uuid.v7(),
        answerTypeId: answerType.id,
        answer: 0,
        answerValueType: answerType.answerValueType,
        questionId: question.id,
      } as AnswerQuestionProtocolModel);
      return 0;
    }
    return <number>this.protocolTherapeuticPlan.answers[index].answer;
  }
  changeValue(
    question: QuestionProtocolModel,
    answerType: AnswerTypeProtocolModel,
    value: number
  ): void {
    let index = this.protocolTherapeuticPlan.answers.findIndex(
      (a) => a.questionId == question.id && a.answerTypeId == answerType.id
    );
    if (index < 0) {
      this.protocolTherapeuticPlan.answers.push({
        key: uuid.v7(),
        answerTypeId: answerType.id,
        answer: value,
        answerValueType: answerType.answerValueType,
        questionId: question.id,
      } as AnswerQuestionProtocolModel);
    } else {
      this.protocolTherapeuticPlan.answers[index].answer = value;
    }
  }
  someAnswerTypeHasName(protocol: MyProtocolModel): boolean {
    return protocol.answersType.some((at) => at.name && at.name.length > 0);
  }
  private _initProtocolTherapeuticPlan(): void {
    if (!!this.protocolTherapeuticPlanId) {
      this.protocolTherapeuticPlanStore
        .getById(this.protocolTherapeuticPlanId)
        .pipe(alertApiError())
        .subscribe({
          next: (model) => {
            this.protocolTherapeuticPlan = model;
            this._initProtocolModel();
          },
        });
    } else if (this.protocolId) {
      const _protocolTherapeuticPlan = {} as ProtocolTherapeuticPlanModel;
      _protocolTherapeuticPlan.protocolId = this.protocolId;
      _protocolTherapeuticPlan.requestDate = new Date();
      _protocolTherapeuticPlan.answers = [];
      this.protocolTherapeuticPlan = _protocolTherapeuticPlan;
      this._initProtocolModel();
    }
  }
  private _initProtocolModel(): void {
    this.protocolStore
      .getMyProtocolData(this.protocolTherapeuticPlan.protocolId)
      .pipe(alertApiError())
      .subscribe({
        next: (model) => (this.protocol = model),
      });
  }
}
