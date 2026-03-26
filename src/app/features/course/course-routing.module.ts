import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewCourseComponent } from "./pages/view-course/view-course.component";

const routes: Routes = [
    { path: '', component: ViewCourseComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CourseRoutingModule { }