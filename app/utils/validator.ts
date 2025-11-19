// creating a funtion to valifdaiton takes zod schema and data input
import { z, ZodType } from 'zod';

export const validateSchema = async <T>(
    schema: ZodType<T>,
    data: unknown
): Promise<T> => {
    try {
        const parsedData = await schema.parseAsync(data);
        return parsedData; // return the validated data
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw {
                status: 400,
                errors: error.issues.map(({ path, message }) => ({ path, message })),
                error: "validation error"
            };
        }
        throw error; // rethrow if it's not a ZodError
    }
};