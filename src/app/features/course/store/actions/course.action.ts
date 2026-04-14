import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Course, CourseDto } from "../../models/course.model";


export const CourseActions = createActionGroup({
    source: 'Course',
    events: {
        'Load Courses': emptyProps(),
        'Load Courses Success': props<{ courses: Course[] }>(),
        'Load Courses Failure': props<{ error: string | null }>(),

        'Create Course': props<{ course: CourseDto; file: File }>(),
        'Create Course Success': props<{ course: Course }>(),
        'Create Course Failure': props<{ error: string | null }>(),

        'Update Course Success': props<{ course: Course }>(),
        'Delete Course Success': props<{ id: string }>(),
    }
})

// Seperation of actions based on UI and API call
// export const coursesPageActions = createActionGroup({
//     source: 'Courses Page',
//     events: {
//         'Load Courses': emptyProps(),
//     }
// });

// export const coursesApiActions = createActionGroup({
//     source: 'Courses API',
//     events: {
//         // 'Load Success': props<{ courses: Course[] }>(),
//         'Load Success': props<{ courses: any }>(),
//         'Load Failure': props<{ error: any }>(),
//     }
// })