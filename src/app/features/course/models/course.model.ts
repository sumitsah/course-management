export interface Course {
    id: string;
    title: string;
    instructor: string;
    price: number;
    image: string;
    tags: string[];
    description: string;
    rating?: number;
    reviews?: number;
}

export interface CourseDto {
    title: string;
    instructor: string;
    price: number;
    image: string;
    tags: string[];
    description: string;
    rating?: number;
    reviews?: number;
}