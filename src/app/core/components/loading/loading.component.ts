import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, NgxLoadingModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  @Input('isLoading')
  isLoading: boolean = false;
  ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
}
