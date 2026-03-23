import { Component, inject, OnInit } from '@angular/core';
import { AuthFacade } from './features/auth/auth-facade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  authFacade = inject(AuthFacade);
  loading$ = this.authFacade.loading$;

  ngOnInit() {
    this.authFacade.autoLogin();
  }
}
