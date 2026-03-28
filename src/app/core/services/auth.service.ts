import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthResponse, User, UserAuth } from '../models/user';
import { BehaviorSubject, distinctUntilChanged, map, Observable, Subject, Subscription, switchMap, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlConfig = environment.firebaseConfig;
  signinUrl: string = `${this.urlConfig.authUrl}signInWithPassword?key=${this.urlConfig.apiKey}`;
  signupUrl: string = `${this.urlConfig.authUrl}signUp?key=${this.urlConfig.apiKey}`;

  // private userBehaviorSubject: Subject<User | null> = new Subject<User | null>(); very important
  // while view course page load user$ will not have any value because subject is live broadcast it does not remember the previous value
  // so it page will be loading forever since there is no value emition and interceptor will be waiting similarly we need 
  // use take(1) to complete the stream otherwise behaviour subject is hot obs it will be listnening forever  
  private userBehaviorSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$ = this.userBehaviorSubject.asObservable();

  isRefreshing = false;
  refreshSubject = new BehaviorSubject<string | null>(null);

  isAuthenticated$ = this.user$.pipe(map(user => !!user?.token), distinctUntilChanged());
  // isAuthenticated$ = this.user$.pipe(map(user => !!user?.token));
  private logoutTimer: any;

  private refreshSub?: Subscription;

  constructor(private http: HttpClient) { }

  get user() {
    return this.userBehaviorSubject.value;
  }

  doLogin(credentials: UserAuth): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.signinUrl, { ...credentials, returnSecureToken: true }).pipe(
      tap((res: AuthResponse) => {
        // const expirationDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
        const expirationDate = new Date(new Date().getTime() + 120 * 1000);
        const user = new User(res.email, res.localId, res.idToken, expirationDate, res.refreshToken);
        this.setUser(user);
        this.doAutoRefreshToken(+res.expiresIn);

        // const expirationDuration = new Date(user.expirationDate).getTime() - Date.now();
        // this.doAutoLogout(expirationDuration);
        // expirationDuration === res.expiresIn
      })
    );
  }

  doLogout() {
    this.userBehaviorSubject.next(null);
    localStorage.removeItem('user');
    // Auto logout is disabled instead app uses auto refresh token 
    // if (this.logoutTimer) {
    //   clearTimeout(this.logoutTimer);
    // }
    if (this.refreshSub) {
      this.refreshSub.unsubscribe(); // must
    }
  }

  // This is Page refresh auto login so user subject will loose the user object so we need to fetch from localstorage
  doAutoLogin() {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user) {
      return
    }

    // remember one thing from localStorage will only have _idToken (private User Property) 
    // But User object will be having token (getter)

    const loadedUser = new User(user.email, user.localId, user._idToken, new Date(user._expirationDate), user._refreshToken);
    console.log(loadedUser)
    // Check token validity via getter
    if (loadedUser.token) {
      console.log('Inside auto login authService')
      this.userBehaviorSubject.next(loadedUser);
    }

    const expirationDuration = new Date(loadedUser.expirationDate).getTime() - Date.now();
    this.doAutoRefreshToken(expirationDuration);
    // this.doAutoLogout(expirationDuration);
  }

  doAutoLogout(expirationDuration: number) {
    this.logoutTimer = setTimeout(() => {
      this.userBehaviorSubject.next(null);
      localStorage.removeItem('user');
    }, expirationDuration); // Set to 10 seconds for testing, should be expirationDuration in production
  }


  doRefreshTokenInExchangeIdToken() {
    return this.http.post(`${this.urlConfig.refreshTokenUrl}${this.urlConfig.apiKey}`, {
      grant_type: 'refresh_token',
      refresh_token: this.user?.refreshToken
    }).pipe(
      tap((res: any) => {
        if (this.user) {
          const updatedUser = new User(this.user.email, this.user.localId, this.user.token, this.user.expirationDate, this.user.refreshToken)
          this.setUser(updatedUser);
        }
        this.doAutoRefreshToken(+res.expires_in)
      })
    )
  }

  doAutoRefreshToken(expiresIn: number) {
    //  const refreshTime = expiresIn * 1000 - 60 * 1000; // 1 min before expiry
    const refreshTime = (expiresIn - 60) * 1000; // 1 min before expiry
    if (this.refreshSub) {
      this.refreshSub.unsubscribe(); // important
    }

    this.refreshSub = timer(refreshTime).pipe(
      switchMap(() => this.doRefreshTokenInExchangeIdToken())
    ).subscribe({
      next: () => console.log('Token refreshed automatically'),
      error: () => this.doLogout() // fallback
    });
  }

  setUser(user: User) {
    this.userBehaviorSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    // const expirationDuration = new Date(user.expirationDate).getTime() - Date.now();
    // this.doAutoLogout(expirationDuration);
  }

}

// Todo:

// Auto logout timer using expirationDate
// Silent token refresh pattern (advanced)
// Interceptor that skips expired tokens

// These are real production auth patterns 👍
