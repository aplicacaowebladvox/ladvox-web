import { Component, OnInit } from '@angular/core';
import { PublicHomeStore } from '../../../core/stores/public-home.store';
import { SystemLandingPagePublicationModel } from '../../../models/system-landing-page-publication.model';
import { CommonModule } from '@angular/common';
import { isLink } from '../../shared/utils/string.util';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss',
  providers: [PublicHomeStore],
})
export class PublicationsComponent implements OnInit {
  publications!: SystemLandingPagePublicationModel[];
  constructor(private publicHomeStore: PublicHomeStore) {}
  isLink = isLink;
  ngOnInit(): void {
    this.publicHomeStore
      .getPublications()
      .pipe(alertApiError())
      .subscribe({
        next: (items) => (this.publications = items),
      });
  }
}
