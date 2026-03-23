import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthResponse, User, UserAuth } from '../models/user';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signinUrl: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`;
  signupUrl: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`;

  private userBehaviorSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$ = this.userBehaviorSubject.asObservable();

  isAuthenticated$ = this.user$.pipe(map(user => !!user?.token));
  private logoutTimer: any;

  constructor(private http: HttpClient) { }

  doLogin(credentials: UserAuth): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.signinUrl, { ...credentials, returnSecureToken: true }).pipe(
      tap((res: AuthResponse) => {
        const expirationDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
        const user = new User(res.email, res.localId, res.idToken, expirationDate);
        this.userBehaviorSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        const expirationDuration = new Date(user.expirationDate).getTime() - Date.now();
        this.doAutoLogout(expirationDuration);
      })
    );
  }

  doLogout() {
    this.userBehaviorSubject.next(null);
    localStorage.removeItem('user');
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  doAutoLogin() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return;
    }
    const user = JSON.parse(userData);
    const loadedUser = new User(user.email, user.localId, user._idToken, new Date(user._expirationDate));

    // Check token validity via getter
    if (loadedUser.token) {
      this.userBehaviorSubject.next(loadedUser);
    }

    const expirationDuration = new Date(loadedUser.expirationDate).getTime() - Date.now();
    this.doAutoLogout(expirationDuration);
  }

  doAutoLogout(expirationDuration: number) {
    this.logoutTimer = setTimeout(() => {
      this.userBehaviorSubject.next(null);
      localStorage.removeItem('user');
    }, expirationDuration); // Set to 10 seconds for testing, should be expirationDuration in production
  }

}

// Todo:

// Auto logout timer using expirationDate
// Silent token refresh pattern (advanced)
// Interceptor that skips expired tokens

// These are real production auth patterns 👍
