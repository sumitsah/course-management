import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './features/auth/auth.module';
import { HeaderComponent } from './layout/header/header.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SharedUIModule } from './shared/ui/shared-ui.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    SharedUIModule
  ],
  // providers: [ provideHttpClient(withInterceptorsFromDi())],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
