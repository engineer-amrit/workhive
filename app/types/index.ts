import type { ResponseError } from "~/classes/utils/globalFetchErrorHandler";
export interface ResponseSuccess<T> {
    status: number;
    data?: T;
    message: string;
}

export type Data<T> = ResponseSuccess<T> | ResponseError;

export type User = {
    id: string;
    fullName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

