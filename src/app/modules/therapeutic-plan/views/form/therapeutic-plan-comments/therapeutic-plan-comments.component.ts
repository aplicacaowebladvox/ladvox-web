import { TherapeuticPlanCommentChatViewModel } from './../../../../../models/therapeutic-plan-comment-chat-view.model';
import { Component, Input, OnInit } from '@angular/core';
import { TherapeuticPlanCommentStore } from '../../../../../core/stores/therapeutic-plan-comment.store';
import { AlertService } from '../../../../../core/services/alert.provided.service';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../authentication/services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvertUtils } from '../../../../shared/utils/convert.utils';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-therapeutic-plan-comments',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, AvatarModule, NgxSkeletonLoaderModule],
  templateUrl: './therapeutic-plan-comments.component.html',
  styleUrl: './therapeutic-plan-comments.component.scss',
  providers: [TherapeuticPlanCommentStore],
})
export class TherapeuticPlanCommmentsComponent implements OnInit {
  @Input()
  therapeuticPlanId!: number;
  @Input()
  editing!: boolean;

  comments!: TherapeuticPlanCommentChatViewModel[];
  userId?: string = undefined;
  textComment: string = '';
  dateToString = ConvertUtils.dateToString;
  constructor(
    private therapeuticPlanCommentStore: TherapeuticPlanCommentStore,
    private alertService: AlertService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.userId = this.authService.getUser()?.sub;
    this._initComments();
  }
  clickSend(): void {
    this.therapeuticPlanCommentStore
      .newComment(this.therapeuticPlanId, this.textComment)
      .pipe(alertApiError())
      .subscribe({
        next: () => {
          this.textComment = '';
          this._initComments();
        },
      });
  }
  private _initComments(): void {
    this.therapeuticPlanCommentStore
      .findAllByTherapeuticPlanId(this.therapeuticPlanId)
      .pipe(alertApiError())
      .subscribe({
        next: (list) => {
          this.comments = list;
        },
      });
  }
}
