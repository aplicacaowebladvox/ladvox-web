import { SystemConfigStore } from './../../stores/system-config.store';
import { AuthService } from './../../../modules/authentication/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../menu-item/menu-item.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ChooseableUserRoleModel } from '../../../modules/authentication/models/chooseable-user-role.model';
import { SidebarObjectModel } from '../../models/sidebar-object.model';
import { ConvertUtils } from '../../../modules/shared/utils/convert.utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AvatarModule, CommonModule, MenuItemComponent, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [SystemConfigStore],
})
export class SidebarComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  dataFooterSidebar!: DataFooterSidebar;
  data!: SidebarObjectModel;
  menu!: MenuItem[];
  // = [
  // {
  //   iconClass: 'fa-solid fa-toolbox',
  //   name: 'Configurações do sistema',
  //   description: null,
  //   isOpenned: false,
  //   subMenus: [
  //     {
  //       iconClass: 'fa-solid fa-list-ul',
  //       name: 'Contatos',
  //       path: '/configuracoes/contatos',
  //     },
  //     {
  //       iconClass: 'fa-solid fa-list-ul',
  //       name: 'Redes sociais',
  //       path: '/configuracoes/redes-sociais',
  //     },
  //     {
  //       iconClass: 'fa-solid fa-list-ul',
  //       name: 'Projetos',
  //       path: '/configuracoes/projetos',
  //     },
  //     {
  //       iconClass: 'fa-solid fa-list-ul',
  //       name: 'Publicações',
  //       path: '/configuracoes/publicacoes',
  //     },
  //   ] as MenuItem[],
  // },
  // {
  //   iconClass: 'fa-solid fa-users',
  //   name: 'Controle de acesso',
  //   description: 'Usuários do sistema',
  //   isOpenned: false,
  //   subMenus: [
  //     {
  //       iconClass: 'fa-solid fa-list-ul',
  //       name: 'Usuários',
  //       path: '/controle-acesso/usuario',
  //     },
  //     {
  //       iconClass: 'fa-solid fa-list-ul',
  //       name: 'Papéis',
  //       path: '/controle-acesso/papel',
  //     },
  //   ] as MenuItem[],
  // },
  // {
  //   iconClass: 'fa-solid fa-file-invoice',
  //   name: 'Protocolos',
  //   description: null,
  //   isOpenned: false,
  //   subMenus: [
  //     {
  //       iconClass: 'fa-solid fa-list-ul',
  //       name: 'Lista',
  //       path: '/protocolos',
  //     },
  //     {
  //       iconClass: 'fa-solid fa-circle-plus',
  //       name: 'Novo',
  //       path: '/protocolos/form',
  //     },
  //   ] as MenuItem[],
  // },
  // {
  //   iconClass: 'fa-solid fa-hospital-user',
  //   name: 'Paciente',
  //   description: null,
  //   isOpenned: false,
  //   subMenus: [
  //     {
  //       iconClass: 'fa-solid fa-list-ul',
  //       name: 'Lista',
  //       path: '/pacientes',
  //     },
  //     {
  //       iconClass: 'fa-solid fa-circle-plus',
  //       name: 'Novo',
  //       path: '/pacientes/form',
  //     },
  //   ] as MenuItem[],
  // },
  // {
  //   iconClass: 'fa-solid fa-stethoscope',
  //   name: 'Atendimento',
  //   description: null,
  //   isOpenned: false,
  //   subMenus: [
  //     {
  //       iconClass: 'fa-solid fa-notes-medical',
  //       name: 'Plano Terapeutico',
  //       path: '/plano-terapeutico',
  //     },
  //     {
  //       iconClass: 'fa-solid fa-list-ul',
  //       name: 'Planejamento de atendimentos',
  //       path: '/atendimento',
  //     },
  //     {
  //       iconClass: 'fa-solid fa-circle-plus',
  //       name: 'Novo Planejamento',
  //       path: '/atendimento/form',
  //     },
  //   ] as MenuItem[],
  // },
  // {
  //   iconClass: 'fa-solid fa-comment-dots',
  //   name: 'Solicitações',
  //   description: null,
  //   isOpenned: false,
  //   path: '/solicitacoes-atendimento',
  // },
  // ] as MenuItem[];
  isCollapsed: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.data = SidebarObjectModel.getFromLocalStorage();
    this._initMenu();
    this._initFooterSidebar();
  }
  goHome(): void {
    if (location.pathname != '/home') {
      this.router.navigate(['home']);
    }
  }
  collapse(newValue: boolean): void {
    this.isCollapsed = newValue;
  }
  logout(): void {
    Swal.fire({
      title: 'Você tem certeza que quer deslogar do sistema?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, sair!',
    }).then((result) => {
      if (result.isConfirmed) {
        SidebarObjectModel.cleanFromLocalStorage();
        localStorage.removeItem('menu');
        this.authService.logout();
        // this.router.navigate(['/']);
      }
    });
  }
  private _initMenu() {
    this.menu = this.data.menuResponse.items || [];
  }

  private _initFooterSidebar() {
    this.dataFooterSidebar = {
      imageProfile: this.data.userProfileImage,
      userNameInitials: ConvertUtils.generateInitials(this.data.userName),
      userName: this.data.userName,
      userRoleName: this.data.viewMode.roleName,
      chooseableUserRoleModel: this.data.viewMode,
    } as DataFooterSidebar;
  }
}

interface DataFooterSidebar {
  imageProfile: string;
  userNameInitials: string;
  userName: string;
  userRoleName: string;
  chooseableUserRoleModel: ChooseableUserRoleModel;
}
