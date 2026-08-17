import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AccordionComponent } from '../../../../core/components/accordion/accordion.component';
import { CommonModule, Location, formatDate } from '@angular/common';
import { GridTableComponent } from '../../../../core/components/grid-table/grid-table.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProtocolCalculatorComponent } from '../../../../core/components/protocol-calculator/protocol-calculator.component';
import { ProtocolModel } from '../../../../models/protocol.model';
import { QuestionTabComponent } from './question-tab/question-tab.component';
import { AnswerTypeTabComponent } from './answer-type-tab/answer-type-tab.component';
import { GroupQuestionTabComponent } from './group-question-tab/group-question-tab.component';
import { ProtocolStore } from '../../../../core/stores/protocol.store';
import { ActivatedRoute, Router } from '@angular/router';
import { TabComponent, TabItem } from '../../../../core/components/tab/tab.component';
import { AnswerTypeProtocolModel } from '../../../../models/answer-type-protocol.model';
import { QuestionProtocolModel } from '../../../../models/question-protocol.model';
import { HasPermissionDirective } from '../../../../core/has-permission.directive';
import { AuthService } from '../../../authentication/services/auth.service';
import {
  FormOfProtocolSecondStepModel,
  ProtocolSecondStepModel,
  ProtocolSecondStepModelOfForm,
} from '../../../../models/protocol-second-step.model';
import { AnswerValueTypeEnum } from '../../../../models/enum/answer-value-type.enum';
import { ProtocolThirdStepModel } from '../../../../models/protocol-third-step.model';
import { ProtocolFirstStepModel } from '../../../../models/protocol-first-step.model';
import { QuestionGroupProtocolModel } from '../../../../models/question-group-protocol.model';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-protocols-questions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AnswerTypeTabComponent,
    QuestionTabComponent,
    GroupQuestionTabComponent,
    TabComponent,
  ],
  templateUrl: './protocols-questions.component.html',
  styleUrl: './protocols-questions.component.scss',
  providers: [ProtocolStore],
})
export class ProtocolsQuestionsComponent implements OnInit {
  _isLoad: boolean = false;
  get isLoad(): boolean {
    return (
      this._isLoad &&
      this.data &&
      this.tabItems &&
      this.tabItems.length > 0 &&
      this.tabItems.findIndex((a) => a.isActive) >= 0
    );
  }
  @Input()
  id?: number;
  data!: ProtocolSecondStepModel | ProtocolThirdStepModel;
  tabItems: TabItem[] = [];
  get answersType(): Array<AnswerTypeProtocolModel> {
    return (<ProtocolSecondStepModel>this.data).answersType;
  }
  get questions(): Array<QuestionProtocolModel> {
    return (<ProtocolThirdStepModel>this.data).questions;
  }
  get groups(): Array<QuestionGroupProtocolModel> {
    // return (<ProtocolThirdStepModel>this.data).questions;
    return [];
  }
  private _tab: 'tipos-resposta' | 'perguntas' | 'grupos' = 'tipos-resposta';

  private _editing: boolean | null = false;
  private _hasPermissionFormEdit: boolean = false;
  get editing(): boolean | null {
    return this._editing;
  }

  @ViewChild('appAnswerTypeTab')
  answerTypeTabComponent?: AnswerTypeTabComponent;
  @ViewChild('appQuestionTab')
  questionTabComponent?: QuestionTabComponent;
  @ViewChild('appGroupQuestionTab')
  groupQuestionTabComponent?: GroupQuestionTabComponent;
  constructor(
    private router: Router,
    private protocolStore: ProtocolStore,
    private location: Location,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    console.log('ProtocolsQuestionsComponent.ngOnInit');
    this._hasPermissionFormEdit = this.authService.hasPermission('protocolo.protocolo.form.edit');
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        this._editing = params['editing'] == undefined ? null : params['editing'] == 'true';
        if (this.editing && !this._hasPermissionFormEdit) this.location.back();

        if (params['tab'] == undefined ? null : params['tab']) {
          this._tab = params['tab'];
        }
        this._loadPage();
      },
    });
  }
  clickSave(): void {
    this.protocolStore
      .updateQuestions(this.id!, this.getModelFromTab(), this.getStepFromTab())
      .pipe(alertApiError())
      .subscribe({
        next: () => {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
              editing: this.editing,
              tab: this.getNextTabFromTab(),
            },
          });
        },
      });
  }
  onClickBack(index: number): void {
    if (this._tab == 'tipos-resposta') {
      this.router.navigate(['protocolos', 'form', this.id], {
        queryParams: { editing: this.editing },
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          editing: this.editing,
          tab: this.getPreviousTabFromTab(),
        },
      });
      // this.tabItems[index - 1].isActive = true;
      // this.tabItems[index].isActive = false;
    }
  }
  onClickSave(index: number, event?: QuestionProtocolModel[] | null) {
    this.clickSave();
    // if (index == 0) {
    //   console.log(this.protocol.answersType);
    //   //save answersType
    //   this.tabItems[0].isActive = false;
    //   this.tabItems[0].isDisabled = false;
    //   this.tabItems[1].isActive = true;
    //   this.tabItems[1].isDisabled = false;
    // } else if (index == 1) {
    //   this.protocol.questions = event || [];
    //   //save questions
    //   this.tabItems[1].isActive = false;
    //   this.tabItems[2].isActive = true;
    //   this.tabItems[2].isDisabled = false;
    // } else {
    //   console.log(this.protocol.groups);
    //   //save groups
    //   this.tabItems[2].isActive = false;
    //   this.tabItems[0].isActive = true;
    //   this.router.navigate(['protocolos']);
    // }
  }
  onTabChange(tabChanged: TabItem): void {
    this.router.navigate(['protocolos', 'form', this.id, 'perguntas'], {
      queryParams: {
        editing: this.editing,
        tab: ['tipos-resposta', 'perguntas', 'grupos'].at(
          ['Tipos de respostas', 'Perguntas', 'Grupos'].findIndex(
            (t) => t == tabChanged.displayName
          )
        ),
      },
    });
  }
  private _loadPage(): void {
    console.log('ProtocolsQuestionsComponent._loadPage');
    if (this.id) {
      this.protocolStore
        .get(this.id, this.getStepFromTab())
        .pipe(alertApiError())
        .subscribe({
          next: (data) => {
            this.data = this.mapDataToType(data);
            this._initTabs();
          },
        });
    } else {
      this.router.navigate(['protocolos']);
    }
  }
  private _initTabs(): void {
    console.log('ProtocolsQuestionsComponent._initTabs');
    this.tabItems = [
      {
        isDisabled: this._isTabDisabled('tipos-resposta'),
        displayName: 'Tipos de respostas',
        isActive: this._tab == 'tipos-resposta',
        breakSize: undefined,
        titleSize: undefined,
      },
      {
        isActive: this._tab == 'perguntas',
        isDisabled: this._isTabDisabled('perguntas'),
        displayName: 'Perguntas',
        breakSize: undefined,
        titleSize: undefined,
      },
      {
        isActive: this._tab == 'grupos',
        isDisabled: this._isTabDisabled('grupos'),
        displayName: 'Grupos',
        breakSize: undefined,
        titleSize: undefined,
      },
    ];
    if (this._tab == 'tipos-resposta' && this.answerTypeTabComponent) {
      this.answerTypeTabComponent.answersType = this.answersType;
      this.answerTypeTabComponent.ngOnInit();
    } else if (this._tab == 'perguntas' && this.questionTabComponent) {
      this.questionTabComponent.questions = this.questions;
      this.questionTabComponent.ngOnInit();
    } else if (this._tab == 'grupos' && this.groupQuestionTabComponent) {
      this.groupQuestionTabComponent.answersType = this.answersType;
      this.groupQuestionTabComponent.questions = this.questions;
      this.groupQuestionTabComponent.groups = this.groups;
      this.groupQuestionTabComponent.ngOnInit();
    }
    this._isLoad = true;
  }
  private _isTabDisabled(tab: string): boolean {
    if (this._tab == tab) {
      return false;
    } else if (this.getNextTabFromTab() == tab) {
      return !this.data.nextStepIsEnable;
    } else if (this.getPreviousTabFromTab() == tab) {
      return false;
    }
    return true;
  }
  // private _initForm(): void {
  //   const formValues: any = {} as FormValues;
  //   Object.keys(formValues).forEach((key) => {
  //     formValues[key] = localStorage.getItem('ProtocolsQuestionsComponent#form.' + key);
  //   });
  //   let tempProtocol = <ProtocolModel>formValues.protocol || ({} as ProtocolModel);

  //   this.protocol.answersType = tempProtocol.answersType || this.protocol.answersType || [];
  //   this.protocol.questions = tempProtocol.questions || this.protocol.questions || [];
  //   this.protocol.groups = tempProtocol.groups || this.protocol.groups || [];
  // }
  private getModelFromTab(): ProtocolSecondStepModel | ProtocolThirdStepModel {
    switch (this._tab) {
      case 'grupos':
      case 'perguntas':
        return <ProtocolThirdStepModel>(<any>this.data);
      case 'tipos-resposta':
      default:
        let holdData = <ProtocolSecondStepModel>(<any>this.data);
        holdData.answersType.forEach((at) => {
          if (typeof at.answerValueType == 'object') {
            at.answerValueType = <string>(<AnswerValueTypeEnum>at.answerValueType).id;
          }
        });
        return holdData;
    }
  }
  private mapDataToType(data: any): ProtocolSecondStepModel | ProtocolThirdStepModel {
    switch (this._tab) {
      case 'grupos':
      case 'perguntas':
        return <ProtocolThirdStepModel>(<any>data);
      case 'tipos-resposta':
      default:
        return <ProtocolSecondStepModel>(<any>data);
    }
  }
  private getStepFromTab(): number {
    switch (this._tab) {
      case 'grupos':
        return 4;
      case 'perguntas':
        return 3;
      case 'tipos-resposta':
      default:
        return 2;
    }
  }
  private getNextTabFromTab(): 'tipos-resposta' | 'perguntas' | 'grupos' {
    switch (this._tab) {
      case 'grupos':
        return 'grupos';
      case 'perguntas':
        return 'grupos';
      case 'tipos-resposta':
        return 'perguntas';
      default:
        return 'tipos-resposta';
    }
  }
  private getPreviousTabFromTab(): 'tipos-resposta' | 'perguntas' | 'grupos' {
    switch (this._tab) {
      case 'grupos':
        return 'perguntas';
      case 'perguntas':
        return 'tipos-resposta';
      case 'tipos-resposta':
        return 'tipos-resposta';
      default:
        return 'tipos-resposta';
    }
  }
}
