import { AuthService } from './../../modules/authentication/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConvertUtils } from '../../modules/shared/utils/convert.utils';
import { SystemConfigStore } from '../../core/stores/system-config.store';
import { FastActionModel } from '../../core/models/fast-action.model';
import { MenuItem } from '../../core/components/menu-item/menu-item.interface';
import { CommonModule } from '@angular/common';
import { NextSessionModel } from '../../core/models/next-session.model';
import { AlertService } from '../../core/services/alert.provided.service';
import { WeekdayEnum } from '../../models/enum/weekday.enum';
import { HasPermissionDirective } from '../../core/has-permission.directive';
import { NotHasRoleDirective } from '../../core/not-has-role.directive';
import { HasRoleDirective } from '../../core/has-role.directive';
import { AvatarModule } from 'primeng/avatar';
import { UserNotificationStore } from '../../core/stores/user-notifications.store';
import { TooltipModule } from 'primeng/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NotHasRoleDirective,
    AvatarModule,
    TooltipModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [SystemConfigStore, UserNotificationStore],
})
export class HomeComponent implements OnInit {
  fastActions!: FastActionModel;
  nextSession!: NextSessionModel;
  notifications!: any[];
  userName?: string = undefined;
  get flatFastActions(): MenuItem[] {
    return [...(this.fastActions.fixedActions || []), ...(this.fastActions.suggestedActions || [])];
  }
  greetings?: string;
  private _generateGreetings(): void {
    this.greetings = ConvertUtils.generateGreetings(this.userName);
  }
  get now(): string {
    return ConvertUtils.dateToString(new Date())!;
  }
  constructor(
    private router: Router,
    private systemConfigStore: SystemConfigStore,
    private userNotificationStore: UserNotificationStore,
    private alertService: AlertService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.userName = this.authService.getUser()?.name;
    if (this.authService.getUser()?.roles.some((r) => r != 'Paciente')) {
      this._findAllFastActions();
      this._findNotifications();
      this._findNextSessions();
      this._generateGreetings();
    } else {
      this.router.navigate(['paciente', 'meus-protocolos']);
    }
  }
  clickFastAction(action: MenuItem): void {
    if (!action.path) return;
    if (action.path.startsWith('http') || action.path.startsWith('www')) {
      window.open(action.path, '_blank');
    } else {
      if (action.openInNewTab) {
        const url = this.router.serializeUrl(this.router.createUrlTree([action.path]));
        window.open(url, '_blank');
      } else {
        this.router.navigate([action.path]);
      }
    }
  }
  redirectTo(path: string): void {
    this.router.navigate([path]);
  }
  displayName(weekday: string): string | undefined {
    return WeekdayEnum.getDisplayName(weekday);
  }
  refreshNotifications(): void {
    this._findNotifications();
  }
  refreshNextSessions(): void {
    this._findNextSessions();
  }
  markNotificationAsRead(id: number): void {
    this.userNotificationStore
      .markAsRead(id)
      .pipe(alertApiError())
      .subscribe({
        next: () => this._findNotifications(),
      });
  }
  deleteNotification(id: number): void {
    this.alertService.showConfirm({
      message: 'Esta aação é irreversivel, tem certeza que deseja executa-la?',
      title: 'Excluir notificação',
      callbackConfirmFn: () => {
        this.userNotificationStore
          .delete(id)
          .pipe(alertApiError())
          .subscribe({
            next: () => this._findNotifications(),
          });
      },
    });
  }
  private _findAllFastActions(): void {
    this.systemConfigStore
      .fastActions()
      .pipe(alertApiError())
      .subscribe({
        next: (fa) => {
          this.fastActions = fa;
        },
      });
  }
  private _findNextSessions(): void {
    this.systemConfigStore
      .getNextSessions()
      .pipe(alertApiError())
      .subscribe({
        next: (nextSession) => (this.nextSession = nextSession),
      });
  }
  private _findNotifications(): void {
    this.userNotificationStore
      .findNotifications()
      .pipe(alertApiError())
      .subscribe({
        next: (_notifications) => (this.notifications = _notifications),
      });
  }
}
