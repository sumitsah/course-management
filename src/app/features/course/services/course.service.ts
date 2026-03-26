import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class CourseService {
  localStorage = JSON.parse(localStorage.getItem('user') as string);

  courseApiUrl = environment.firebaseConfig.databaseURL + `/courses.json?auth=${this.localStorage._idToken}`;
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

  doUploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file!);
    formData.append('upload_preset', environment.cloudinary.uploadReset);
    return this.http.post(this.uploadImageUrl, formData)
  }
}
