// src/classes/CustomError.ts
export class CustomError extends Error {
    status: number;
    extraDetails?: any;

    constructor(config: { status: number, message?: string, extraDetails?: any }) {
        const { status, message, extraDetails } = config;
        super(message); // important: captures .message and .stack
        this.name = this.constructor.name; // optional: nice to have "CustomError" as name
        this.status = status;
        this.extraDetails = extraDetails;
        Object.setPrototypeOf(this, CustomError.prototype); // important: fixes instanceof checks
    }
}

