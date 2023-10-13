/**
 * @typedef {{ status?: number; message?: string; data?: any }} ServerAPIErrorConstructorArgs
 */

export class ServerAPIError extends Error {
  /**
   * 
   * @param {ServerAPIErrorConstructorArgs} args 
   */
  constructor(args) {
    super();
    this.status = args.status ?? 200;
    this.message = args.message;
    this.data = args.data;
  }
}

export class BadRequestError extends ServerAPIError {
  constructor({ ...payload } = {}) {
    super({ status: 400, message: 'Bad Request', ...payload });
  }
}

export class UnauthorizedError extends ServerAPIError {
  constructor({ ...payload } = {}) {
    super({ status: 401, message: 'Unauthorized', ...payload });
  }
}

export class ForbiddenError extends ServerAPIError {
  constructor({ ...payload } = {}) {
    super({ status: 403, message: 'Forbidden', ...payload });
  }
}

export class NotFoundError extends ServerAPIError {
  constructor({ ...payload } = {}) {
    super({ status: 404, message: 'Not Found', ...payload });
  }
}

export class InternalServerError extends ServerAPIError {
  constructor({ ...payload } = {}) {
    super({ status: 500, message: 'Internal Server Error', ...payload });
  }
}