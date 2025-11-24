import { accessLogger } from "@/utils/logger.js";
import blockHandler from "@/classes/controllers/blockHandler.js";


export default blockHandler.createMiddleware(async (req, res) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const log = {
      status: res.statusCode,
      responseTime: duration,
      ...(res.locals.message && { message: res.locals.message }),
    };

    if (res.statusCode >= 500) {
      accessLogger.error(req, log);
    } else if (res.statusCode >= 400) {
      accessLogger.warn(req, log);
    } else {
      accessLogger.info(req, log);
    }
  });
}).errorMessage("Error in access logger middleware");

