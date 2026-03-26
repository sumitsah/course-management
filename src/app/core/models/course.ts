export class Course {
    constructor(
        public id: number,
        public title: string,
        public instructor: string,
        public rating: number,
        public reviews: number,
        public price: number,
        public image: string,
        public tags: string[],
        public description: string
    ) { }

}

export type CourseFormData = Omit<Course, 'id'>;