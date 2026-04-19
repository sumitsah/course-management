import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Course, CourseDto } from '../models/course.model';

@Injectable({
  providedIn: 'any'
})
export class CourseService {
  courseApiUrl = environment.firebaseConfig.databaseURL + '/courses.json'
  courseUpdateDeleteApiUrl = environment.firebaseConfig.databaseURL + '/courses/'
  uploadImageUrl = environment.cloudinary.baseUrl + environment.cloudinary.cloudName + '/upload';

  constructor(private http: HttpClient) { }

  doCreateCourse(courseData: CourseDto): Observable<Course> {
    return this.http.post<{ name: string }>(this.courseApiUrl, courseData).pipe(
      map(res => ({
        id: res.name,
        ...courseData
      }))
    );
  }

  doGetCourses(): Observable<Course[]> {
    return this.http
      .get<Record<string, CourseDto> | null>(this.courseApiUrl)
      .pipe(
        map((courses) =>
          courses
            ? Object.entries(courses).map(([id, value]) => ({
              id,
              ...value
            }))
            : []
        )
      );
  }

  doGetCourseById(id: string) {
    return this.http.get(environment.firebaseConfig.databaseURL + `/courses/${id}.json`)
  }

  doUpdateCourse(course: Course): Observable<Course> {
    return this.http.patch<Course>(this.courseUpdateDeleteApiUrl + `${course.id}.json`, course)
  }

  doDeleteCourse(courseId: string) {
    return this.http.delete(this.courseUpdateDeleteApiUrl + `${courseId}.json`)
  }

  doUploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file!);
    formData.append('upload_preset', environment.cloudinary.uploadReset);
    return this.http.post(this.uploadImageUrl, formData)
  }
}
