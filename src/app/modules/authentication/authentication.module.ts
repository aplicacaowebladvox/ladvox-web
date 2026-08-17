import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './views/login/login.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { ForgetPasswordComponent } from './views/forget-password/forget-password.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    LoginComponent,
  ],
})
export class AuthenticationModule {}
