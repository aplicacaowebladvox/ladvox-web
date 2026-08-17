import { SystemConfigStore } from './../../stores/system-config.store';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from './menu-item.interface';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TooltipModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  providers: [SystemConfigStore],
})
export class MenuItemComponent {
  constructor(
    private router: Router,
    private systemConfigStore: SystemConfigStore
  ) {}
  faQuestionCircle = faQuestionCircle;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  @Input()
  item!: MenuItem;
  @Input()
  index!: number;
  @Input()
  collapsed!: boolean;
  @Input()
  innerClass: string = '';

  handleClick(): void {
    this.item.isOpenned = !this.item.isOpenned;
    this.item.subMenus?.forEach((item) => {
      item.isOpenned = false;
    });
    if (!this.item.path) return;

    this.systemConfigStore.performedAction(this.item.id).subscribe({
      next: () => console.log('Action performed'),
      error: (error) => console.log(error),
    });

    if (this.item.path.startsWith('http') || this.item.path.startsWith('www')) {
      window.open(this.item.path, '_blank');
    } else {
      if (this.item.openInNewTab) {
        const url = this.router.serializeUrl(this.router.createUrlTree([this.item.path]));
        window.open(url, '_blank');
      } else {
        this.router.navigate([this.item.path]);
      }
    }
  }
}
