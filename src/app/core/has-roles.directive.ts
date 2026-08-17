import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../modules/authentication/services/auth.service';

@Directive({
  selector: '[hasRoles]',
})
export class HasRolesDirective {
  /**
   * How to use:
   * @example <div *hasRoles="['some-role', 'other-role']">
   *
   */
  @Input()
  set hasRoles(roles: string[]) {
    if (this.authService.hasRoles(roles)) {
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
