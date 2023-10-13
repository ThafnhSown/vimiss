import { ServerAPIError } from "@/common/errors";
import { failureResponse, serverErrorResponse } from "@/common/responses";

/**
 * 
 * @param {Error} err 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export function handleAPIError(err, req, res, next) {
  if (err) {
    if (err instanceof ServerAPIError) {
      const { status, message, data } = err;
      if (status === 200) {
        return failureResponse(res, { message, data });
      } else {
        return serverErrorResponse(res, status, { message, data });
      }
    } else {
      console.error(err);
      return serverErrorResponse(res, 500, { message: 'Internal Server Error' });
    }
  }
  return next();
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export function handleNotFoundError(req, res, next) {
  serverErrorResponse(res, 404, { message: `Endpoint ${req.method} ${req.url} not found` });
  return next();
}