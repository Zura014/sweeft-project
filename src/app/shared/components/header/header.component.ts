import { Component, inject, OnInit } from '@angular/core';
import { filter, map, merge, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
} from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    MatProgressBar,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  router = inject(Router);

  isLoading$!: Observable<boolean>; // loading state

  _showLoaderEvents$!: Observable<boolean>;
  _hideLoaderEvents$!: Observable<boolean>;

  onFetch(): void {
    this.isLoading$.pipe(map(() => false));
  }

  ngOnInit(): void {
    // Handling loading state as navigation happens for good UX
    this._showLoaderEvents$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      map(() => true)
    );
    this._hideLoaderEvents$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => false)
    );
    this.isLoading$ = merge(this._showLoaderEvents$, this._hideLoaderEvents$);
  }
}
