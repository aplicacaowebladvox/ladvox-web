import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../modules/authentication/services/auth.service';

@Directive({
  selector: '[hasPermissions]',
  standalone: true,
})
export class HasPermissionsDirective {
  /**
   * How to use:
   * @example <div *hasPermissions="['some-permission', 'other-permission']">
   *
   */
  @Input()
  set hasPermissions(permissions: string[]) {
    if (this.authService.hasRoles(permissions)) {
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
