import { NgModule } from '@angular/core';
import { ViewCourseComponent } from './pages/view-course/view-course.component';
import { CourseRoutingModule } from './course-routing.module';
import { CourseFormComponent } from './pages/create-course/course-form.component';
import { SharedFormsModule } from '../../shared/forms/shared-forms.module';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { SharedUIModule } from '../../shared/ui/shared-ui.module';
import { CoreModule } from '../../core/core.module';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { StoreModule } from '@ngrx/store';
import { courseReducer } from './store/reducers/course.reducer';
import { COURSE_FEATURE_KEY } from './store/course.constant';
import { EffectsModule } from '@ngrx/effects';
import { CourseEffects } from './store/effects/course.effects';

@NgModule({
    declarations: [ViewCourseComponent, CourseFormComponent, CourseDetailsComponent],
    imports: [CourseRoutingModule, SharedFormsModule, TitleCasePipe, SharedUIModule, CommonModule, CoreModule,
        StoreModule.forFeature(COURSE_FEATURE_KEY, courseReducer),
        EffectsModule.forFeature([CourseEffects])
    ],
    exports: [ViewCourseComponent]
})
export class CourseModule { }
