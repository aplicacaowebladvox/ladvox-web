import { Component, OnInit } from '@angular/core';
import { SystemLandingPageProjectModel } from '../../../models/system-landing-page-project.model';
import { PublicHomeStore } from '../../../core/stores/public-home.store';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  providers: [PublicHomeStore],
})
export class ProjectsComponent implements OnInit {
  projects!: SystemLandingPageProjectModel[];
  constructor(private publicHomeStore: PublicHomeStore) {}
  ngOnInit(): void {
    this.publicHomeStore
      .getProjects()
      .pipe(alertApiError())
      .subscribe({
        next: (items) => (this.projects = items),
      });
  }
}
