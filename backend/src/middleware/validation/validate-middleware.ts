import { NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { MediaController } from "@/classes/controllers/mediaController.js";

interface Schema {
  body?: ZodType,
  query?: ZodType,
  params?: ZodType,
}

class ValidatorController extends MediaController {
  protected async errorHandler(error: unknown, errorName: { value: string }, next: NextFunction) {
    if (error instanceof ZodError) {


      const errorPayload = {
        status: 400,
        message: errorName.value,
        errors: error.issues.map(({ path, message }) => ({ path, message })),
      };

      next(errorPayload);
    }
    else {
      next({
        status: 500,
        message: errorName.value,
        extraDetails: (error as Error).message,
      });
    }
  }
}

const Vcontroller = new ValidatorController();
export interface ValidReq extends Express.Request {
  ValidQuery?: unknown
}

const validator = (schema: Schema) => Vcontroller.createMiddleware(async (req) => {
  if (schema.body) {
    req.body = await schema.body.parseAsync(req.body || {});
  }
  if (schema.query) {
    // convert query "key.subkey" to nested object before validation
    const nestedQuery: Record<string, any> = {};
    for (const [key, value] of Object.entries(req.query || {})) {
      const path = key.split('.');
      let current = nestedQuery;
      for (let i = 0; i < path.length; i++) {
        const part = path[i];
        if (i === path.length - 1) {
          current[part] = value;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      }
    }
    (req as ValidReq).ValidQuery = await schema.query.parseAsync(nestedQuery || {});
  }
  if (schema.params) {
    req.params = await schema.params.parseAsync(req.params || {}) as any;
  }
}).errorMessage("Validation Error")

export default validator;
