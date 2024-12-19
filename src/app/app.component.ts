import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'videoflix-frontend';
  constructor(public router: Router) {}

  shouldShowFooter(): boolean {
    const excludedRoutes = ['/legal-notice', '/privacy-policy'];
    const dynamicRoutePattern = /^\/videos\/.*$/; // Erlaubt alles nach "/videos/"
  
    return (
      !excludedRoutes.includes(this.router.url) &&
      !dynamicRoutePattern.test(this.router.url)
    );
  }
}
