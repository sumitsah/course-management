import { NgModule } from '@angular/core';
import { ViewCourseComponent } from './pages/view-course/view-course.component';
import { CourseRoutingModule } from './course-routing.module';
import { CreateCourseComponent } from './pages/create-course/create-course.component';
import { SharedFormsModule } from '../../shared/forms/shared-forms.module';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { SharedUIModule } from '../../shared/ui/shared-ui.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
    declarations: [ViewCourseComponent, CreateCourseComponent],
    imports: [CourseRoutingModule, SharedFormsModule, TitleCasePipe, SharedUIModule, CommonModule, CoreModule],
    exports: [ViewCourseComponent]
})
export class CourseModule { }
