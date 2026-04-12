import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './features/auth/auth.module';
import { HeaderComponent } from './layout/header/header.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SharedUIModule } from './shared/ui/shared-ui.module';
import { CommonModule } from '@angular/common';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { CoreModule } from './core/core.module';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { retryInterceptor } from './core/interceptors/retry.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AUTH_FEATURE_KEY } from './store/auth/auth.constants';
import { authReducer } from './store/auth/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/auth/auth.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    AuthModule,
    SharedUIModule,
    CoreModule,
    StoreModule.forRoot({ [AUTH_FEATURE_KEY]: authReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([AuthEffects])
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))],
  // providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }