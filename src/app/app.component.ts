import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MatProgressBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
