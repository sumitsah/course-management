import { inject, Injectable } from '@angular/core';
import { CourseService } from '../services/course.service';
import { BehaviorSubject, finalize, shareReplay, startWith, Subject, switchMap, take, tap } from 'rxjs';
import { ToastService } from '../../../shared/ui/service/toast.service';
import { Course, CourseDto } from '../models/course.model';
import { Store } from '@ngrx/store';
import { selectAllCourses, selectCourseById, selectCourseEntities, selectCourseLoaded, selectCourseLoading } from '../store/selectors/course.selectors';
import { CourseActions } from '../store/actions/course.action';

@Injectable({
  providedIn: 'any'
})

export class CourseFacade {
  toastService = inject(ToastService);
  courseService = inject(CourseService);
  store = inject(Store<Course[]>)

  refreshCourses$ = new Subject<void>();

  courses$ = this.store.select(selectAllCourses);
  loading$ = this.store.select(selectCourseLoading);

  courses1$ =
    this.refreshCourses$.pipe(
      startWith(null),
      switchMap(() => {
        this.loadingSubject.next(true);
        return this.courseService.doGetCourses().pipe(
          // catchError((err) => {
          //   this.handleError(err);
          //   return of([]); // Return a default value or rethrow the error as needed
          // }),
          finalize(() => this.loadingSubject.next(false))
        );
        // })
      }),
      // shareReplay({ bufferSize: 1, refCount: true }) this will automatically unsubscribe the observable API call will be evrytime( stream will be closed once there is no subscribers)
      shareReplay(1) // will store in cache, no multiple API calls on navigation but memory leak in a very small level
    )

  private loadingSubject = new BehaviorSubject<boolean>(false);
  // loading$ = this.loadingSubject.asObservable();

  // private coursesCache$?: Observable<any[]>;
  // Cache machenism not worth it for cross component
  // getCourses() {
  //   if (!this.coursesCache$) {
  //     this.loadingSubject.next(true);

  //     this.coursesCache$ = this.courseService.doGetCourses().pipe(
  //       catchError((err) => {
  //         this.handleError(err);
  //         return of([]);
  //       }),
  //       finalize(() => this.loadingSubject.next(false)),
  //       shareReplay(1)
  //     );
  //   }

  //   return this.coursesCache$;
  // }

  createCourse(course: CourseDto, file: File) {
    this.store.dispatch(CourseActions.createCourse({ course, file }))
  }

  deleteCourse(id: string) {
    this.store.dispatch(CourseActions.deleteCourse({ id }));
  }

  updateCourse(course: Course) {
    this.store.dispatch(CourseActions.updateCourse({ course }))
  }

  // getCourseById(id: any) {
  //   return this.courseService.doGetCourseById(id);
  // }

  getCourseById(id: string) {
    this.store.select(selectCourseEntities).pipe(take(1)).subscribe(entities => {
      if (!entities[id]) {
        this.store.dispatch(CourseActions.loadCourses()); // or loadCourseById
      }
    });

    return this.store.select(selectCourseById(id));
  }

  refreshCourses() {
    this.refreshCourses$.next();
  }

  uploadFile(file: File) {
    return this.courseService.doUploadFile(file)
  }

  loadCourses() {
    // It makes sure the shareReplay behaiour caching machenism and avoid uneccessary API call
    this.store.select(selectCourseLoaded).pipe(take(1)).subscribe((loaded) => {
      if (!loaded) {
        this.store.dispatch(CourseActions.loadCourses());
      }
    });
  }

  /*   getCourses() {
      following the pattern of other facades, we can directly call the service method and assign the observable to courses$
      this allows multiple components to subscribe to courses$ and get the latest data when a course is created
      this will also prevent multiple API calls in different components, as they will all subscribe to the same observable 
      ✔ Avoids manual subscribe()
      ✔ No Subjects needed
      ✔ Clean + declarative
      ✔ Works perfectly with async pipe
  
      this.getCourses$ = this.courseService.doGetCourses().pipe(
        tap(res => console.log(res))
      );
    } */

  // handleError(err: HttpErrorResponse) {
  //   console.error('An error occurred:', err);
  //   let error: AppError = {
  //     message: 'An error occurred!',
  //     status: `${err.status}`
  //   }
  //   switch (err.error.error) {
  //     case 'Permission denied':
  //       error.message = err.error.error;
  //       break;
  //   }
  //   this.toastService.show(error.message, 'error');
  // }
}



/* {
    "-Ooa9A7c4QXKeKQUktEt": {
        "description": "React Course for Beginners",
        "image": "https://res.cloudinary.com/dl6dnknto/image/upload/v1774460071/hrcyx7s94yxyjhylyljo.jpg",
        "instructor": "Sumit Sahu",
        "price": 4999,
        "tags": "React, Frontend, Javascript",
        "title": "React Course"
    },
    "-Ooa9zoG7C4x0rBx5U25": {
        "description": "React Advanced Course for Advanced topic",
        "image": "https://res.cloudinary.com/dl6dnknto/image/upload/v1774460071/hrcyx7s94yxyjhylyljo.jpg",
        "instructor": "Sumit Sahu",
        "price": 6999,
        "tags": "React, Frontend, Javascript",
        "title": "React Advanced Course"
    },
    "-OoaAu9rQy6aPW3aLoQp": {
        "description": "React More advanced course 2026",
        "image": "https://res.cloudinary.com/dl6dnknto/image/upload/v1774460071/hrcyx7s94yxyjhylyljo.jpg",
        "instructor": "Sumit Sahu",
        "price": 7999,
        "tags": "React, Advanced, Javascript",
        "title": "React More advanced course"
    }
} */