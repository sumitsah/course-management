import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { map } from 'rxjs';
import { Course } from '../../../core/models/course';

@Injectable({
  providedIn: 'any'
})
export class CourseService {
  courseApiUrl = environment.firebaseConfig.databaseURL + '/courses.json'
  courseUpdateDeleteApiUrl = environment.firebaseConfig.databaseURL + '/courses/'
  // ?auth=${this.localStorage._idToken}`;
  uploadImageUrl = environment.cloudinary.baseUrl + environment.cloudinary.cloudName + '/upload';

  constructor(private http: HttpClient) { }

  doCreateCourse(courseData: any) {
    return this.http.post(this.courseApiUrl, courseData);
  }

  doGetCourses() {
    return this.http
      .get<Record<string, any> | null>(this.courseApiUrl)
      .pipe(
        map((courses) =>
          courses
            ? Object.entries(courses).map(([id, value]) => ({
              id,
              ...(value as object)
            }))
            : []
        )
      );
  }

  doGetCourseById(id: string) {
    return this.http.get(environment.firebaseConfig.databaseURL + `/courses/${id}.json`)
  }

  doUpdateCourse(course: Course) {
    return this.http.patch(this.courseUpdateDeleteApiUrl + `${course.id}.json`, course)
  }

  doDeleteCourse(courseId: number) {
    return this.http.delete(this.courseUpdateDeleteApiUrl + `${courseId}.json`)
  }

  doUploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file!);
    formData.append('upload_preset', environment.cloudinary.uploadReset);
    return this.http.post(this.uploadImageUrl, formData)
  }
}
