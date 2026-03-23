import { NgModule } from "@angular/core";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from './pages/home/home.component';
import { SharedFormsModule } from "../../shared/forms/shared-forms.module";

@NgModule({
    declarations: [LoginComponent, HomeComponent],
    imports: [SharedFormsModule],
    exports: [LoginComponent]
})
export class AuthModule {

}