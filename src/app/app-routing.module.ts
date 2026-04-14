import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { HomeComponent } from './features/auth/pages/home/home.component';
import { ViewCourseComponent } from './features/course/pages/view-course/view-course.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { PagenotfoundComponent } from './shared/ui/components/pagenotfound/pagenotfound.component';

const routes: Routes = [
  { path: '', canActivate: [guestGuard], component: LoginComponent },
  { path: 'login', canActivate: [guestGuard], component: LoginComponent },
  { path: 'home', component: HomeComponent },
  // { path: 'courses', children: [{ path: 'view', component: ViewCourseComponent }] }
  {
    canMatch: [authGuard],
    path: 'courses', loadChildren: () => import('./features/course/course.module').then(m => m.CourseModule)
    // , data: { preload: true }
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forRoot(routes, {
  //   preloadingStrategy: PreloadAllModules
  // })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// export class CustomPreloadingStrategy implements PreloadingStrategy {
//   preload(route: Route, fn: () => Observable<any>) {
//     return route.data?.['preload'] ? fn() : of(null);
//   }
// }