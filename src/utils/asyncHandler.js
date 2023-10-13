/**
 * 
 * @param {AsyncRequestHandler} fn 
 * @returns {import('express').RequestHandler}
 */
export default function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}