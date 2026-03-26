import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalFacade } from '../../../../core/services/modal-facade.service';
import { CourseFacade } from '../../facade/course.facade';
import { finalize, switchMap } from 'rxjs';

@Component({
  selector: 'create-course',
  standalone: false,
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})
export class CreateCourseComponent implements OnInit, AfterViewInit {
  // @Output() closeForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  isOpen = false;
  courseForm!: FormGroup;
  selectedFile!: File;
  loading = false;
  controls!: any;

  constructor(private fb: FormBuilder,
    private modalFacade: ModalFacade,
    private courseFacade: CourseFacade,
    //  "firebase": "^12.11.0",
    // @Inject(MODAL_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    this.createCourseForm();
    // this.loading$ = this.courseFacade.loading$;

    this.modalFacade.closeModalObs$.subscribe(() => this.isOpen = false);
    this.modalFacade.openModalObs$.subscribe(() => this.isOpen = true);
  }

  ngAfterViewInit() {
    this.controls = {
      title: this.courseForm.get('title'),
      description: this.courseForm.get('description'),
      price: this.courseForm.get('price'),
    };
  }
  createCourseForm() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      instructor: ['', Validators.required],
      price: [99, [Validators.min(99), Validators.required]],
      image: [null],
      tags: ['']
    });
  }

  // this.courseForm.patchValue({ image: 'https://res.cloudinary.com/dl6dnknto/image/upload/v1774460071/hrcyx7s94yxyjhylyljo.jpg' });
  onSubmit() {
    if (this.courseForm.valid) {
      this.loading = true;
      this.courseFacade.uploadFile(this.selectedFile).pipe(
        switchMap((res: any) => {
          // console.log(res);
          let formData = {
            ...this.courseForm.value,
            image: res.secure_url
          }
          return this.courseFacade.createCourse(formData)
        }),
        finalize(() => this.loading = false)
      ).subscribe({
        next: () => {
          this.close();
          this.courseFacade.refreshCourses();
          // this.courses$ = this.courseFacade.getCourses();
        }
      });

      // .subscribe((res: any) => {
      //   this.courseForm.patchValue({ image: res.secure_url });
      // })
      // const formData = new FormData();
      // Object.entries(this.courseForm.value).forEach(([key, value]: [string, any]) => {
      //   formData.append(key, value);
      // });
      // console.log(this.courseForm.value);
      // this.courseFacade.createCourse(this.courseForm.value).subscribe((_) => this.close());
    } else {
      console.log('Form is invalid');
    }
  }

  onFileSelected(input: HTMLInputElement) {
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files?.[0];
      const fileNameSpan = document.querySelector('.file-name');
      if (fileNameSpan) {
        fileNameSpan.textContent = this.selectedFile.name;
      }
    }
  }

  close() {
    this.modalFacade.closeModal();
    // this.modalFacade.close({ success: true, data: this.courseForm.value });
    // this.modalFacade.close({ success: true });
  }
}

/*  createDynamicCourseForm() {
   fields = [
    { name: 'title', type: 'text' },
    { name: 'instructor', type: 'text' },
    { name: 'rating', type: 'number' },
    { name: 'reviews', type: 'number' },
    { name: 'price', type: 'number' },
    { name: 'image', type: 'image' },
    { name: 'tags', type: 'text' },
    { name: 'description', type: 'textarea' }
  ]; 
  // const controls: { [key: string]: FormControl } = {};
  const controls: Record<string, FormControl> = {};
  // let controls: CourseFormData;

  this.fields.forEach(field => {
    controls[field.name] = new FormControl('');
  });
  this.courseForm = new FormGroup(controls);
}
'https://res.cloudinary.com/dl6dnknto/image/upload/v1774460071/hrcyx7s94yxyjhylyljo.jpg' 


Response Object from cloudinary after upload image
{
    "asset_id": "b65ee6f368bd47f8c2a997f41a39af37",
    "public_id": "xr8xdcfjljpulruieame",
    "version": 1774523552,
    "version_id": "ce2ed2e600d7edbb3bfa811ed269ed8b",
    "signature": "a2fd41bd34e736a799e5e9941ef45596fe3b2d38",
    "width": 291,
    "height": 173,
    "format": "jpg",
    "resource_type": "image",
    "created_at": "2026-03-26T11:12:32Z",
    "tags": [],
    "bytes": 5019,
    "type": "upload",
    "etag": "41cf427878e21d4786a0ba21bf348652",
    "placeholder": false,
    "url": "http://res.cloudinary.com/dl6dnknto/image/upload/v1774523552/xr8xdcfjljpulruieame.jpg",
    "secure_url": "https://res.cloudinary.com/dl6dnknto/image/upload/v1774523552/xr8xdcfjljpulruieame.jpg",
    "asset_folder": "",
    "display_name": "angular",
    "original_filename": "angular"
}

*/

