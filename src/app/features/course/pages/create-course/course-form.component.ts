import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalFacade } from '../../../../core/services/modal-facade.service';
import { CourseFacade } from '../../facade/course.facade';
import { finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { Course } from '../../../../core/models/course';

@Component({
  selector: 'course-form',
  standalone: false,
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css'
})
export class CourseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: Course | null = null;
  @Input() mode: 'create' | 'edit' = 'create';

  isOpen = false;
  courseForm!: FormGroup;
  selectedFile!: File;
  loading = false;
  controls!: any;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
    private modalFacade: ModalFacade,
    private courseFacade: CourseFacade,
    // @Inject(MODAL_DATA) public data: any,
  ) {
  }

  // this.loading$ = this.courseFacade.loading$;
  ngOnInit() {
    this.createCourseForm();

    this.modalFacade.closeModalObs$.
      pipe(takeUntil(this.destroy$)).
      subscribe(() => this.isOpen = false);

    this.modalFacade.openModalObs$.
      pipe(takeUntil(this.destroy$)).
      subscribe(() => this.isOpen = true);
  }

  ngOnChanges() {
    if (this.mode === 'edit' && this.data) {
      this.courseForm.patchValue(this.data);
    } else {
      this.courseForm?.reset();
    }
  }

  ngAfterViewInit() {
    this.controls = {
      title: this.courseForm.get('title'),
      description: this.courseForm.get('description'),
      price: this.courseForm.get('price'),
    };
  }


  // editCourseForm() {
  //   this.courseForm.patchValue({
  //     title: this.courseForm.title,
  //     description: this.courseForm.description,
  //     price: this.courseForm.price,
  //     tags: 
  //   });
  // }

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
    if (this.mode === 'create') {
      if (this.courseForm.valid) {
        this.loading = true;
        this.courseFacade.uploadFile(this.selectedFile).pipe(
          switchMap((res: any) => {
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
    } else {
      this.loading = true;
      this.courseFacade.updateCourse({ ...this.courseForm.value, id: this.data?.id }).pipe(
        finalize(() => this.loading = false)
      ).subscribe(() => { this.close(); this.courseFacade.refreshCourses() })
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

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
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

