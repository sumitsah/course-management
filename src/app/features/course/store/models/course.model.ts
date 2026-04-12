export interface Course {
    id: number;
    title: string;
    instructor: string;
    price: number;
    image: string;
    tags: string[];
    description: string;
    rating?: number;
    reviews?: number;
}