import { Component, OnInit } from '@angular/core';
import { PublicHomeStore } from '../../core/stores/public-home.store';
import { CommonModule } from '@angular/common';
import { SystemLandingPageArticleModel } from '../../models/system-landing-page-article.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertService } from '../../core/services/alert.provided.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { alertApiError } from '../../core/operators/api-alert-error.operator';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './public-home.component.html',
  styleUrl: './public-home.component.scss',
  providers: [PublicHomeStore],
})
export class PublicHomeComponent implements OnInit {
  articles!: SystemLandingPageArticleModel[];
  constructor(
    private publicHomeStore: PublicHomeStore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.publicHomeStore
      .getArticles()
      .pipe(alertApiError())
      .subscribe({
        next: (items) => (this.articles = items),
      });
  }
  goTo(path: string): void {
    this.router.navigate([path], { relativeTo: this.activatedRoute });
  }
}
