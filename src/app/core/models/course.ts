export class Course {
    constructor(
        public id: number,
        public title: string,
        public instructor: string,
        public price: number,
        public image: string,
        public tags: string[],
        public description: string,
        public rating?: number,
        public reviews?: number,

    ) { }

}

export type CourseFormData = Omit<Course, 'id'>;