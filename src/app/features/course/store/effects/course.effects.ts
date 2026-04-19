import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CourseService } from "../../services/course.service";
import { CourseActions } from "../actions/course.action";
import { catchError, filter, map, of, shareReplay, switchMap, tap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../store/app.state";
import { Course, CourseDto } from "../../models/course.model";
import { ToastService } from "../../../../shared/ui/service/toast.service";
import { ModalFacade } from "../../../../core/services/modal-facade.service";
import { Update } from "@ngrx/entity";

@Injectable()

export class CourseEffects {
    actions$ = inject(Actions);
    courseService = inject(CourseService);
    toastService = inject(ToastService);
    modalFacade = inject(ModalFacade);
    store = inject(Store<AppState>);

    loadCourses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CourseActions.loadCourses),

            // withLatestFrom(this.store.select(selectAllCourses)), [actions, courses]
            // filter(([_, courses]) => courses.length === 0), //✅ cache check

            switchMap(() =>
                this.courseService.doGetCourses().pipe(
                    map(courses => CourseActions.loadCoursesSuccess({ courses })),
                    catchError(err =>
                        of(CourseActions.loadCoursesFailure({ error: err.message }))
                    )
                )),
        )
    )

    createCourse$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CourseActions.createCourse),

            switchMap(({ course, file }) =>
                this.courseService.doUploadFile(file).pipe(

                    // Step 1: upload image
                    switchMap((res: any) => {
                        const payload: CourseDto = {
                            ...course,
                            image: res.secure_url
                        };

                        // Step 2: create course
                        return this.courseService.doCreateCourse(payload);
                    }),

                    // Step 3: success
                    map((created) =>
                        CourseActions.createCourseSuccess({ course: created })
                    ),

                    catchError(err =>
                        of(CourseActions.createCourseFailure({ error: err.message }))
                    )
                )
            )
        )
    );

    createCourseSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CourseActions.createCourseSuccess),
            tap(() => {
                this.toastService.show('Course Created Successfully!', 'success');
                this.modalFacade.closeModal() // or emit event
            })
        ), { dispatch: false }
    );

    updateCourse$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CourseActions.updateCourse),

            switchMap(({ course }) =>
                this.courseService.doUpdateCourse(course).pipe(
                    tap((res) => console.log(res)),
                    map((res) => {
                        // const updatedCourse: Update<Course> = {
                        //     id: res.id,
                        //     changes: { ...res }
                        // }
                        return CourseActions.updateCourseSuccess({ course: res })
                    }),
                    catchError(err => of(CourseActions.updateCourseFailure({ error: err.message })))
                ))
        )
    )

    updateCourseSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CourseActions.updateCourseSuccess),
            tap(() => {
                this.toastService.show('Course Updated Successfully!', 'success');
                this.modalFacade.closeModal()
            })
        ), { dispatch: false }
    );

    deleteCourse$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CourseActions.deleteCourse),
            switchMap(({ id }) =>
                this.courseService.doDeleteCourse(id).pipe(
                    map(() => CourseActions.deleteCourseSuccess({ id })),
                    catchError((err) => of(CourseActions.deleteCourseFailure({ error: err.message })))
                )
            )
        )
    )

    deleteCourseSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CourseActions.deleteCourseSuccess),
            tap(() => this.toastService.show('Course Deleted Successfully!', 'success'))
        ), { dispatch: false }
    )
}