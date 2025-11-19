export interface ResponseError {
    status: number;
    errors?: {
        path: string[];
        message: string;
    }[];
    error: string;
}

export interface ResponseSuccess<T> {
    status: number;
    data?: T;
    message: string;
}

export type User = {
    id: string;
    fullName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

