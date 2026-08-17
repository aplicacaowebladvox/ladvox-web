import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../modules/authentication/services/auth.service';

@Directive({
  selector: '[notHasRole]',
  standalone: true,
})
export class NotHasRoleDirective {
  /**
   * How to use:
   * @example <div *notHasRole="'some-role'">
   *
   */
  @Input()
  set notHasRole(role: string) {
    if (!this.authService.hasRole(role)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private authService: AuthService
  ) {}
}
