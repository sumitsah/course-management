import { NgModule } from '@angular/core';
import { ViewCourseComponent } from './pages/view-course/view-course.component';
import { CourseRoutingModule } from './course-routing.module';
import { CourseFormComponent } from './pages/create-course/course-form.component';
import { SharedFormsModule } from '../../shared/forms/shared-forms.module';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { SharedUIModule } from '../../shared/ui/shared-ui.module';
import { CoreModule } from '../../core/core.module';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';

@NgModule({
    declarations: [ViewCourseComponent, CourseFormComponent, CourseDetailsComponent],
    imports: [CourseRoutingModule, SharedFormsModule, TitleCasePipe, SharedUIModule, CommonModule, CoreModule],
    exports: [ViewCourseComponent]
})
export class CourseModule { }
