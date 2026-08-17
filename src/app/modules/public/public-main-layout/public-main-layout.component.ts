import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { SystemContactModel } from '../../../models/system-contact.model';
import { SystemSocialMediaModel } from '../../../models/system-landing-page-social-media.model';
import { PublicHomeStore } from '../../../core/stores/public-home.store';
import { AddressModel } from '../../../models/address.model';
import { ConvertUtils } from '../../shared/utils/convert.utils';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-public-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxSkeletonLoaderModule],
  templateUrl: './public-main-layout.component.html',
  styleUrl: './public-main-layout.component.scss',
  providers: [PublicHomeStore],
})
export class PublicMainLayoutComponent implements OnInit {
  isAllLoaded: boolean[] = [false, false];
  contacts!: SystemContactModel[];
  socialMedias!: SystemSocialMediaModel[];

  constructor(
    private publicHomeStore: PublicHomeStore,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  goTo(path: string): void {
    this.router.navigate([path], { relativeTo: this.activatedRoute });
  }
  ngOnInit(): void {
    this.publicHomeStore
      .getContactsActives()
      .pipe(alertApiError())
      .subscribe({
        next: (items) => (this.contacts = items),
      });
    this.publicHomeStore
      .getSocialMediasActives()
      .pipe(alertApiError())
      .subscribe({
        next: (items) => (this.socialMedias = items),
      });
  }
  getAddressAsString(address: AddressModel): string {
    return ConvertUtils.addressToString(address);
  }
  formatPhoneNumber(phone: string): string {
    if (phone.length == 8) {
      return phone.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else if (phone.length == 9) {
      return phone.replace(/(\d{5})(\d{4})/, '$1-$2');
    } else if (phone.length == 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (phone.length == 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length == 12) {
      return phone.replace(new RegExp('(d{2})(d{2})(d{4})(d{4})'), '+$1 ($2) $3-$4');
    } else if (phone.length > 12) {
      return phone.replace(
        new RegExp('(d{' + (phone.length - 11) + '})(d{2})(d{5})(d{4})'),
        '+$1 ($2) $3-$4'
      );
    } else {
      return phone;
    }
  }
}
