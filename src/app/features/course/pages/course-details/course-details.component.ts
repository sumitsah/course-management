import { Component, inject, OnInit } from '@angular/core';
import { Course } from '../../../../core/models/course';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, filter, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { CourseFacade } from '../../facade/course.facade';

@Component({
  selector: 'course-details',
  standalone: false,
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
  course!: Course;
  course$!: Observable<any>;
  loading!: boolean;

  route = inject(ActivatedRoute)
  courseFacade = inject(CourseFacade)

  ngOnInit(): void {
    // this.route.paramMap.subscribe(params => console.log(params))
    // const id = this.route.snapshot.paramMap.get('id');

    // this.course$ = this.route.paramMap.pipe(
    //   map(params => params.get('id')),
    //   filter((id): id is string => !!id),
    //   switchMap(id => {
    //     this.loading = true;
    //     return this.courseFacade.getCourseById(id).pipe(
    //       finalize(() => this.loading = false)
    //     )
    //   })
    // )
    this.course$ = combineLatest([
      this.route.paramMap,
      this.courseFacade.courses$
    ]).pipe(
      map(([params, courses]) => {
        const id = params.get('id');
        return courses.find(c => c.id === id);
      })
    );
  }
}
