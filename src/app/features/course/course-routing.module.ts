import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewCourseComponent } from "./pages/view-course/view-course.component";
import { CourseDetailsComponent } from "./pages/course-details/course-details.component";

const routes: Routes = [
    { path: '', component: ViewCourseComponent },
    { path: ':id', component: CourseDetailsComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CourseRoutingModule { }