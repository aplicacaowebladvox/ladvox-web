import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { UserStore } from '../../../../core/stores/user.store';
import { ChooseableUserRoleModel } from '../../models/chooseable-user-role.model';
import { CommonModule } from '@angular/common';
import { SystemConfigStore } from '../../../../core/stores/system-config.store';
import { SidebarObjectModel } from '../../../../core/models/sidebar-object.model';
import { AlertService } from '../../../../core/services/alert.provided.service';
import { AttachmentModel } from '../../../../models/attachment.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-choose-paper',
  standalone: true,
  imports: [BadgeModule, CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './choose-paper.component.html',
  styleUrl: './choose-paper.component.scss',
  providers: [UserStore, SystemConfigStore],
})
export class ChoosePaperComponent implements OnInit {
  _userName?: string;
  _userProfileImage?: AttachmentModel;
  chooseablesUserRoleModel!: ChooseableUserRoleModel[];
  constructor(
    private router: Router,
    private userStore: UserStore,
    private authService: AuthService,
    private systemConfigStore: SystemConfigStore,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this._userName = this.authService.getUser()?.name;
    this.userStore
      .mountChooseableRole()
      .pipe(alertApiError())
      .subscribe({
        next: (chooseablesUserRoleModel) => {
          this.chooseablesUserRoleModel = chooseablesUserRoleModel;
        },
      });
    this.userStore
      .getProfileImage()
      .pipe(alertApiError())
      .subscribe({ next: (model) => (this._userProfileImage = model) });
  }

  clickChoose(choice: ChooseableUserRoleModel): void {
    choice.password = localStorage.getItem('temp')!;
    this.authService.chooseViewMode(choice).subscribe({
      next: () => {
        this.systemConfigStore.getMenu(choice).subscribe({
          next: (menuResponseModel) => {
            SidebarObjectModel.setOnLocalStorage({
              userProfileImage: this._userProfileImage?.base64,
              menuResponse: menuResponseModel,
              userName: this.authService.getUser()?.name ?? 'U',
              viewMode: choice,
            } as SidebarObjectModel);
            localStorage.setItem('menu', JSON.stringify(menuResponseModel));
            localStorage.removeItem('temp');
            this.router.navigate(['home']);
          },
          error: (err) => {
            this.alertService.showError({ message: err.error.detail });
            localStorage.removeItem('temp');
          },
        });
      },
      error: (err) => {
        this.alertService.showError({ message: err.error.detail });
        localStorage.removeItem('temp');
      },
    });
  }

  back(): void {
    this.authService.logout();
  }
}
