import { EntityState } from '@ngrx/entity';
import { Course } from "../models/course.model";

export interface CoursesState extends EntityState<Course> {
    loading: boolean;
    loaded: boolean;
    error: string | null;
}