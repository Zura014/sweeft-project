import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatButton],
  templateUrl: './header.component.html',
})
export class HeaderComponent {}
