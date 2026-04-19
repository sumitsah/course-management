import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter } from "../reducers/course.reducer";
import { CoursesState } from "../courses.state";
import { COURSE_FEATURE_KEY } from "../course.constant";

export const selectCourseState = createFeatureSelector<CoursesState>(COURSE_FEATURE_KEY);

const baseSelectors = adapter.getSelectors();

export const selectAllCourses = createSelector(
  selectCourseState,
  baseSelectors.selectAll
);

/* Different ways of using this 

export const selectAllCourses = createSelector(
  selectCourseState,
  (state) => baseSelectors.selectAll(state)
); */

export const selectCourseEntities = createSelector(
  selectCourseState,
  baseSelectors.selectEntities
);

export const selectCourseIds = createSelector(
  selectCourseState,
  baseSelectors.selectIds
);

// export const selectCourseById = createSelector(selectCourseState, (state, {id}) => baseSelectors.selectIds(state)[id]);

export const selectCourseById = (id: string) => createSelector(selectCourseEntities, (entities) => entities[id]);

export const selectCourseLoading = createSelector(selectCourseState, (state) => state.loading);

export const selectCourseLoaded = createSelector(selectCourseState, (state) => state.loaded);