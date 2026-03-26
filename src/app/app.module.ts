import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './features/auth/auth.module';
import { HeaderComponent } from './layout/header/header.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SharedUIModule } from './shared/ui/shared-ui.module';
import { CoreModule } from './core/core.module';
import { CommonModule } from '@angular/common';

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
  ],
  // providers: [ provideHttpClient(withInterceptorsFromDi())],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
