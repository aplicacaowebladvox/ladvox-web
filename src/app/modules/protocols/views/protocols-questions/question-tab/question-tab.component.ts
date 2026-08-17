import { sequence } from '@angular/animations';
import { v7 } from './../../../../../../../node_modules/@types/uuid/index.d';
import { Component, Input, OnInit, output } from '@angular/core';
import { AccordionComponent } from '../../../../../core/components/accordion/accordion.component';
import { SplitterModule } from 'primeng/splitter';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionProtocolModel } from '../../../../../models/question-protocol.model';
import { OrderListModule } from 'primeng/orderlist';
import { CommonModule } from '@angular/common';
import * as uuid from 'uuid';

@Component({
  selector: 'app-question-tab',
  standalone: true,
  imports: [AccordionComponent, CommonModule, SplitterModule, ReactiveFormsModule, OrderListModule],
  templateUrl: './question-tab.component.html',
  styleUrl: './question-tab.component.scss',
})
export class QuestionTabComponent implements OnInit {
  @Input('questions')
  questions!: QuestionProtocolModel[];
  questionsFormGroup!: FormGroup;
  onClickBack = output<void>();
  onClickSave = output<QuestionProtocolModel[] | null>();
  ngOnInit(): void {
    if (!this.questions) return;
    this._initQuestionsFormGroup();
  }
  clickAddQuestion(): void {
    const item = {
      key: uuid.v7(),
      sequence: this.questionsFormGroup.getRawValue().questions.length + 1,
      question: this.questionsFormGroup.getRawValue().question,
      abbreviation: this.questionsFormGroup.getRawValue().abbreviation,
    } as QuestionProtocolModel;

    this.questionsFormGroup.controls['questions'].setValue([
      ...this.questionsFormGroup.getRawValue().questions,
      item,
    ]);
    this.questionsFormGroup.controls['question'].setValue(null);
    this.questionsFormGroup.controls['abbreviation'].setValue(null);
  }
  clickRemoveQuestionOrderListItem(item: QuestionProtocolModel) {
    this.questionsFormGroup.controls['questions'].setValue(
      this.questionsFormGroup
        .getRawValue()
        .questions.filter((question: QuestionProtocolModel) => !(question.key == item.key))
        .map((question: QuestionProtocolModel, i: number) => {
          question.sequence = i + 1;
          return question;
        })
    );
  }
  onChangeQuestionOrder(): void {
    this.questionsFormGroup.controls['questions'].setValue(
      (<QuestionProtocolModel[]>this.questionsFormGroup.getRawValue().questions).map(
        (question, i) => {
          question.sequence = i + 1;
          return question;
        }
      )
    );
  }
  clickBack(): void {
    this.onClickBack.emit();
  }
  clickSaveAndNext(): void {
    this.questions = this.questionsFormGroup.getRawValue().questions;
    this.onClickSave.emit(this.questions);
  }
  private _initQuestionsFormGroup(): void {
    const formBuilder = new FormBuilder();
    this.questionsFormGroup = formBuilder.group({
      key: [uuid.v7()],
      id: [null, []],
      sequence: [null],
      question: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(255),
        ]),
      ],
      abbreviation: [null],
      questions: [[...this.questions]],
    });
  }
}
