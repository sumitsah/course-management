import { NgModule } from '@angular/core';
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
    CoreModule
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))],
  // providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }