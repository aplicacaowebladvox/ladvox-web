import { LocalStorageService } from 'angular-2-local-storage';
import { computed, DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { AuthStore } from '../stores/auth.store';
import { LoginUserModel } from '../models/login-user.model';
import { TokenResponseModel } from '../models/token-response.model';
import { AuthUserModel } from '../models/auth-user.model';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, tap } from 'rxjs';
import { AlertService } from '../../../core/services/alert.provided.service';
import { HttpBackend, HttpClient, HttpContext, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthInputRefreshTokenInterface } from '../models/auth-input-refresh-token.interface';
import { USE_AUTH_CONTEXT } from '../../../core/services/request.provided.service';
import { ChooseableUserRoleModel } from '../models/chooseable-user-role.model';
import { ChangePasswordModel } from '../models/change-password.model';

const AUTH_API = 'auth';
const CHECK_TOKEN = 'check-token';
export const CHECK_TOKEN_PATH = `/${AUTH_API}/${CHECK_TOKEN}`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alertService = inject(AlertService);
  private readonly CONTEXT = { context: new HttpContext().set(USE_AUTH_CONTEXT, false) };
  private readonly AUTHENTICATED_CONTEXT = {
    context: new HttpContext().set(USE_AUTH_CONTEXT, true),
  };

  private TOKEN_EXPIRY_THRESHOLD_MILIS: number = 150000;
  private REFRESH_TOKEN_EXPIRY_THRESHOLD_MILIS: number = 900000;
  private _viewMode: ChooseableUserRoleModel | null = null;
  get viewMode(): ChooseableUserRoleModel {
    if (!this._viewMode) this.logout();
    return this._viewMode ?? ({} as ChooseableUserRoleModel);
  }

  set viewMode(viewMode: ChooseableUserRoleModel) {
    this._viewMode = viewMode;
  }

  getAuthUrl(action: string) {
    return `${environment.config.apiUrl}auth/${action}`;
  }

  get user(): WritableSignal<AuthUserModel | null> {
    const token = localStorage.getItem('token');
    return signal(token ? this.jwtHelper.decodeToken(token) : null);
  }

  getUser(): AuthUserModel | null {
    return computed(() => this.user())();
  }
  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  login(body: LoginUserModel): Observable<TokenResponseModel> {
    return this.http.post<TokenResponseModel>(this.getAuthUrl('token'), body, this.CONTEXT).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.alertService.showError({ message: 'Credenciais inválidas' });
        }
        return of();
      }),
      tap((data) => {
        this.storeTokens(data);
        this.scheduleTokenRefresh(data.refresh_token);
      })
    );
  }
  chooseViewMode(viewMode: ChooseableUserRoleModel): Observable<TokenResponseModel> {
    return this.http
      .post<TokenResponseModel>(
        this.getAuthUrl('view-mode-token'),
        viewMode,
        this.AUTHENTICATED_CONTEXT
      )
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            // Handle invalid credentials
            console.log('Invalid credentials');
          }
          return of();
        }),
        tap((data) => {
          this.storeTokens(data);
          this.scheduleTokenRefresh(data.refresh_token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.clear();
    // if you don't have any backend route to invalidate the refresh token
    // then just remove localStorage items and redirect to login route
    this.router.navigate(['/']);
    // const refresh_token = localStorage.getItem('refresh_token');
    // this.http
    //   .post<LoginResponse>(
    //     `${environment.apiUrl}/token/invalidate`,
    //     { refresh_token },
    //     this.CONTEXT
    //   )
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(() => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('refresh_token');
    //     this.router.navigate(['/login']);
    //   });
  }
  refreshToken(): Observable<TokenResponseModel | null> {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      return of();
    }

    return this.http
      .post<TokenResponseModel>(
        this.getAuthUrl('refresh-token'),
        { refreshToken: refresh_token } as AuthInputRefreshTokenInterface,
        this.CONTEXT
      )
      .pipe(
        catchError(() => {
          this.alertService.showError({
            message: 'Tempo esgotado da sessão',
            callbackFn: () => {
              this.router.navigate(['auth']);
            },
          });
          return of();
        }),
        tap((data) => {
          this.storeTokens(data);
          this.TOKEN_EXPIRY_THRESHOLD_MILIS = data.expires_in;
          this.REFRESH_TOKEN_EXPIRY_THRESHOLD_MILIS = data.refresh_expires_in;
          this.scheduleTokenRefresh(data.refresh_token);
        })
      );
  }
  storeTokens(data: TokenResponseModel): void {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
  }
  scheduleTokenRefresh(token: string): void {
    console.log(`scheduleTokenRefresh called at ${new Date()}`);

    const expirationTime = this.jwtHelper.getTokenExpirationDate(token)?.getTime();
    const refreshTime = expirationTime
      ? expirationTime - this.REFRESH_TOKEN_EXPIRY_THRESHOLD_MILIS
      : Date.now();
    const refreshInterval = refreshTime - Date.now();

    if (refreshInterval > 0) {
      setTimeout(() => {
        this.refreshToken().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
      }, refreshInterval);
    }
  }
  hasRole(role?: string): boolean {
    if (!role) return false;
    return computed(() => this.user()?.roles?.includes(role) ?? false)();
  }
  hasRoles(roles?: string[]): boolean {
    if (!roles?.length) {
      return false;
    }
    return roles.some((role) => this.hasRole(role));
  }
  hasPermission(permission?: string): boolean {
    if (!permission) return false;
    return computed(() => this.user()?.permissions?.includes(permission) ?? false)();
  }
  hasPermissions(permissions?: string[]): boolean {
    if (!permissions?.length) {
      return false;
    }
    return permissions.some((permission) => this.hasPermission(permission));
  }
  checkToken(): Observable<TokenResponseModel> {
    return this.http.get<TokenResponseModel>(
      this.getAuthUrl('check-token'),
      this.AUTHENTICATED_CONTEXT
    );
  }
  changePassword(changePassword: ChangePasswordModel): Observable<void> {
    return this.http.post<void>(this.getAuthUrl('change-password'), changePassword, this.CONTEXT);
  }
}
