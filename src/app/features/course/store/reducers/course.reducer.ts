import { createReducer, on } from "@ngrx/store";
import { CoursesState } from "../models/courses-state.model";
import { coursesApiActions, coursesPageActions } from "../actions/course.action";

export const initialState: CoursesState = {
    courses: [],
    loading: false,
    error: null
}

export const courseReducer = createReducer(
    initialState,
    on(coursesApiActions.loadSuccess, (state, action) => {
        console.log(action)
        return {
            ...state,
            courses: action.courses
        }
    })
)