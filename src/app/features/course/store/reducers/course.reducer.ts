import { createReducer, on } from "@ngrx/store";
import { CoursesState } from "../courses.state";
import { createEntityAdapter } from "@ngrx/entity";
import { CourseActions } from "../actions/course.action";
import { Course } from "../../models/course.model";

export const adapter = createEntityAdapter<Course>({
    selectId: (course: Course) => course.id,
    sortComparer: sortByTitle
});

export const initialState: CoursesState = adapter.getInitialState({
    loading: false,
    loaded: false,
    error: null
})

export const courseReducer = createReducer(
    initialState,

    //-------------- Get Courses ----------------------
    on(CourseActions.loadCourses, (state) => ({ ...state, loading: true })),

    on(CourseActions.loadCoursesSuccess, (state, { courses }) =>
        adapter.setAll(courses, {
            ...state,
            loading: false,
            loaded: true,
            error: null
        })
    ),

    on(CourseActions.loadCoursesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        // loaded: true,
        error
    })),
    // --------------------------------------------------

    //-------------- Create a Course -----------------
    on(CourseActions.createCourse, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(CourseActions.createCourseSuccess, (state, { course }) =>
        adapter.addOne(course, {
            ...state,
            loading: false,
            error: null
        })),

    on(CourseActions.createCourseFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    // -----------------------------------------------

    //------------ Update a course -------------------
    on(CourseActions.updateCourse, (state) => ({
        ...state,
        loading: true
    })),

    on(CourseActions.updateCourseSuccess, (state, { course }) =>
        adapter.updateOne({
            id: course.id,
            changes: course
        }, {
            ...state,
            loading: false,
        })
    ),

    on(CourseActions.updateCourseFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    // ---------------------------------------------------

    //-------------- Delete a Course---------------
    on(CourseActions.deleteCourse, (state) => ({
        ...state,
        loading: true
    })),

    on(CourseActions.deleteCourseSuccess, (state, { id }) =>
        adapter.removeOne(id, {
            ...state,
            loading: false
        })
    ),

    on(CourseActions.deleteCourseFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
    // --------------------------------------------------------------
)

export function sortByTitle(a: Course, b: Course): number {
    return a.title.localeCompare(b.title);
}
// export const courseReducer = createReducer(
//     initialState,
//     on(CourseActions.loadCourses, (state, action) => {
//         console.log(action)
//         return {
//             ...state,
//             courses: action.courses
//         }
//     })
// )