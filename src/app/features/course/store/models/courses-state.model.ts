import { Course } from "./course.model";

export interface CoursesState {
    courses: Course[];
    loading: boolean;
    error: any;
}