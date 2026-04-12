import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthResponse, UserAuth } from '../models/user';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlConfig = environment.firebaseConfig;
  signinUrl: string = `${this.urlConfig.authUrl}signInWithPassword?key=${this.urlConfig.apiKey}`;
  signupUrl: string = `${this.urlConfig.authUrl}signUp?key=${this.urlConfig.apiKey}`;

  isRefreshing = false;
  refreshSubject = new BehaviorSubject<string | null>(null);
  private refreshSub?: Subscription;

  constructor(private http: HttpClient) { }

  doLogin(credentials: UserAuth): Observable<AuthResponse> {
    const { email, password } = credentials;
    return this.http.post<AuthResponse>(this.signinUrl, { email, password, returnSecureToken: true })
  }

  doLogout() {
    localStorage.clear();
    if (this.refreshSub) {
      this.refreshSub.unsubscribe(); // must
    }
  }

  doRefreshTokenInExchangeIdToken(refreshToken: string) {
    return this.http.post(`${this.urlConfig.refreshTokenUrl}${this.urlConfig.apiKey}`, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  }

}

// Todo:

// Auto logout timer using expirationDate
// Silent token refresh pattern (advanced)
// Interceptor that skips expired tokens

// These are real production auth patterns 👍
