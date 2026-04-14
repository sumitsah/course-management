import { Component, inject, Input, input, OnChanges, OnInit } from '@angular/core';
import { ModalFacade } from '../../../../core/services/modal-facade.service';
import { Observable } from 'rxjs';
import { CourseFacade } from '../../facade/course.facade';
import { Course } from '../../models/course.model';
import { ConfirmationDialogService } from '../../../../shared/ui/service/confirmation-dialog.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'view-course',
  standalone: false,
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.css'
})
export class ViewCourseComponent implements OnInit {

  modalFacade = inject(ModalFacade);
  courseFacade = inject(CourseFacade);
  router = inject(Router);
  store = inject(Store<Course[]>)

  confirmationDialogService = inject(ConfirmationDialogService);

  courses$!: Observable<any>;
  loading$!: Observable<any>;
  selectedCourse!: Course;
  mode: 'create' | 'edit' = 'create';

  ngOnInit() {
    this.courses$ = this.courseFacade.courses$;
    this.loading$ = this.courseFacade.loading$;
    this.courseFacade.loadCourses();
  }

  viewForm(mode: 'create' | 'edit', course?: Course) {
    this.mode = mode;
    this.selectedCourse = course!;
    this.modalFacade.openModal({ course, mode });
    // this.modalFacade.open({ component: CreateCourseComponent, data: { editMode: false }});
  }

  viewCourse(course: Course) {
    this.router.navigate(['/courses', course.id], { state: { course } })
  }

  /*  Why use async await and not rxjs simple UI yes and no control
   1. UI is inherently sequential
   1. UI is inherently sequential
   3. No nested subscriptions (without extra effort)
   4. Easier error handling
   5. Better readability for teams
   6. UI events are NOT streams (important insight) */
  async deleteCourse(course: Course) {
    const confirmed = await this.confirmationDialogService.confirmAsync({
      title: 'Delete Course',
      message: `Are you sure you want to delete this course ${course.title}?`,
      confirmText: 'Delete'
    });

    if (!confirmed) return;

    this.courseFacade.deleteCourse(course.id).subscribe({
      next: () => { this.courseFacade.refreshCourses() }
    });
  }
}

// End
// 👉 How to dynamically load images from backend (S3/CDN) in Angular
// 👉 Or optimize images for performance (LCP, lazy loading, caching)

// courses = [
//   {
//     id: 1,
//     title: 'Angular Mastery',
//     instructor: 'John Doe',
//     rating: 4.5,
//     reviews: 1200,
//     price: 999,
//     image: 'assets/images/angular.jpg',
//     tags: ['Angular', 'Frontend'],
//     description: 'Learn Angular from scratch and become a master in frontend development. This course covers everything from basic concepts to advanced techniques, including components, services, routing, and state management. By the end of this course, you will be able to build complex and performant web applications using Angular.'
//   },
//   {
//     id: 2,
//     title: 'Node.js API Development',
//     instructor: 'Jane Smith',
//     rating: 4.7,
//     reviews: 900,
//     price: 799,
//     image: 'assets/images/nodejs.png',
//     tags: ['Backend', 'API'],
//     description: 'Master Node.js and learn how to build scalable and efficient APIs. This course covers the fundamentals of Node.js, including event-driven programming, asynchronous programming, and working with databases. You will also learn how to use popular frameworks like Express.js to create RESTful APIs and real-time applications.'
//   },
//   {
//     id: 3,
//     title: 'Angular Mastery',
//     instructor: 'John Doe',
//     rating: 4.5,
//     reviews: 1200,
//     price: 999,
//     image: 'assets/images/angular.jpg',
//     tags: ['Angular', 'Frontend']
//   },
//   {
//     id: 4,
//     title: 'Node.js API Development',
//     instructor: 'Jane Smith',
//     rating: 4.7,
//     reviews: 900,
//     price: 799,
//     image: 'assets/images/nodejs.png',
//     tags: ['Backend', 'API']
//   },
//   {
//     id: 5,
//     title: 'Angular Mastery',
//     instructor: 'John Doe',
//     rating: 4.5,
//     reviews: 1200,
//     price: 999,
//     image: 'assets/images/angular.jpg',
//     tags: ['Angular', 'Frontend']
//   },
//   {
//     id: 6,
//     title: 'Node.js API Development',
//     instructor: 'Jane Smith',
//     rating: 4.7,
//     reviews: 900,
//     price: 799,
//     image: 'assets/images/nodejs.png',
//     tags: ['Backend', 'API']
//   },
//   {
//     id: 7,
//     title: 'Angular Mastery',
//     instructor: 'John Doe',
//     rating: 4.5,
//     reviews: 1200,
//     price: 999,
//     image: 'assets/images/angular.jpg',
//     tags: ['Angular', 'Frontend']
//   },
//   {
//     id: 8,
//     title: 'Node.js API Development',
//     instructor: 'Jane Smith',
//     rating: 4.7,
//     reviews: 900,
//     price: 799,
//     image: 'assets/images/nodejs.png',
//     tags: ['Backend', 'API']
//   },
//   {
//     id: 9,
//     title: 'Angular Mastery',
//     instructor: 'John Doe',
//     rating: 4.5,
//     reviews: 1200,
//     price: 999,
//     image: 'assets/images/angular.jpg',
//     tags: ['Angular', 'Frontend']
//   },
//   {
//     id: 10,
//     title: 'Node.js API Development',
//     instructor: 'Jane Smith',
//     rating: 4.7,
//     reviews: 900,
//     price: 799,
//     image: 'assets/images/nodejs.png',
//     tags: ['Backend', 'API']
//   }
// ];
