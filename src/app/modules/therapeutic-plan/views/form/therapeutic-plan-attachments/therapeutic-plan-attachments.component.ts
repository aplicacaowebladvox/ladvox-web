import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploadComponent } from '../../../../../core/components/file-upload/file-upload.component';
import { TherapeuticPlanAttachmentStore } from '../../../../../core/stores/therapeutic-plan-attachment.store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-therapeutic-plan-attachments',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, NgxSkeletonLoaderModule],
  templateUrl: './therapeutic-plan-attachments.component.html',
  styleUrl: './therapeutic-plan-attachments.component.scss',
  providers: [TherapeuticPlanAttachmentStore],
})
export class TherapeuticPlanAttachmentsComponent implements OnInit {
  @Input()
  therapeuticPlanId!: number;
  @Input()
  editing!: boolean;
  attachmentStore = this.therapeuticPlanAttachmentStore;
  constructor(private therapeuticPlanAttachmentStore: TherapeuticPlanAttachmentStore) {}
  ngOnInit(): void {}
}
