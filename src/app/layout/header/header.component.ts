import { Component, inject } from '@angular/core';
import { AuthFacade } from '../../features/auth/auth-facade.service';

@Component({
  selector: 'header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  authfacade = inject(AuthFacade);
  isLoggedIn$ = this.authfacade.isLoggedIn$;
  user$ = this.authfacade.user$;

  onLogout() {
    this.authfacade.logout();
  }
}
