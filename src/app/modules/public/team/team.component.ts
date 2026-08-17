import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { PublicHomeStore } from '../../../core/stores/public-home.store';
import { UserMemberLandingPageModel } from '../../../models/user-member-landing-page.model';
import { AlertService } from '../../../core/services/alert.provided.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ConvertUtils } from '../../shared/utils/convert.utils';
import { AvatarModule } from 'primeng/avatar';
import { alertApiError } from '../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, OrganizationChartModule, NgxSkeletonLoaderModule, AvatarModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  providers: [PublicHomeStore],
})
export class TeamComponent implements OnInit {
  constructor(
    private publicHomeStore: PublicHomeStore,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.publicHomeStore
      .getMembers()
      .pipe(alertApiError())
      .subscribe({
        next: (items) => (this.members = items),
      });
  }
  members!: UserMemberLandingPageModel[];
  userDisplayPapers(user: UserMemberLandingPageModel): string {
    return user.roles.join(', ');
  }
  randomImageSrc(): string {
    return `assets/images/usuario${Number.parseInt((Math.random() * 6).toFixed(0)) || 1}.png`;
  }
  initials(name?: string): string {
    return ConvertUtils.generateInitials(name);
  }
}
