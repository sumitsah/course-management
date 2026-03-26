import { Component, inject, OnInit } from '@angular/core';
import { ModalFacade } from '../../../../core/services/modal-facade.service';
import { Observable } from 'rxjs';
import { CourseFacade } from '../../facade/course.facade';

@Component({
  selector: 'view-course',
  standalone: false,
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.css'
})
export class ViewCourseComponent implements OnInit {
  modalFacade = inject(ModalFacade);
  courseFacade = inject(CourseFacade);

  courses$!: Observable<any>;
  loading$!: Observable<any>;

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

  ngOnInit() {
    this.courses$ = this.courseFacade.courses$;
    // this.courses$ = this.courseFacade.getCourses(); 
    this.loading$ = this.courseFacade.loading$;
  }

  viewForm() {
    this.modalFacade.openModal();
    // this.modalFacade.open({
    //   component: CreateCourseComponent,
    //   data: { editMode: false }
    // });
  }

  createCourse() {
    console.log('Create course');
  }

  viewCourse(id: number) {
    console.log('View course', id);
  }

  deleteCourse(id: number) {
    console.log('Delete course', id);
  }
}

// 👉 How to dynamically load images from backend (S3/CDN) in Angular
// 👉 Or optimize images for performance (LCP, lazy loading, caching)