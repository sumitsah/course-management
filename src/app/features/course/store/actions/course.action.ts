import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Course } from "../models/course.model";

export const coursesPageActions = createActionGroup({
    source: 'Courses Page',
    events: {
        'Load Courses': emptyProps(),
    }
});

export const coursesApiActions = createActionGroup({
    source: 'Courses API',
    events: {
        // 'Load Success': props<{ courses: Course[] }>(),
        'Load Success': props<{ courses: any }>(),
        'Load Failure': props<{ error: any }>(),
    }
})