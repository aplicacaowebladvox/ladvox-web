import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./views/login/login.component";
import { ChangePasswordComponent } from "./views/change-password/change-password.component";
import { ForgetPasswordComponent } from "./views/forget-password/forget-password.component";
import { ChoosePaperComponent } from "./views/choose-paper/choose-paper.component";

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  }, {
    path: 'alterar-senha',
    component: ChangePasswordComponent,
  }, {
    path: 'esqueci-senha',
    component: ForgetPasswordComponent,
  }, {
    path: 'escolher-papel',
    component: ChoosePaperComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
