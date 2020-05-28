"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Catches errors thrown while handling requests and responds with the error message
 * using the status attached to the error. The status `500` is used if the error doesn't have
 * a `status` or `statusCode` field.
 */
function koaErrorResponder(options = {}) {
    const { debug = false, throwError = false } = options;
    return async function koaErrorResponderMiddleware(context, next) {
        try {
            await next();
        }
        catch (error) {
            const statusCode = error.statusCode || error.status || 500;
            let errorMessage;
            let errorData = null;
            if (statusCode === 500) {
                if (debug) {
                    errorMessage = `Internal server error - ${error.message}`;
                }
                else {
                    errorMessage = "Internal server error.";
                }
            }
            else {
                errorMessage = error.message || "Unknown error.";
                errorData = error;
            }
            context.response.message = errorMessage;
            context.response.status = statusCode;
            context.response.body = {
                error: errorData
                    ? { message: errorMessage, statusCode, ...errorData }
                    : { message: errorMessage, statusCode }
            };
            if (throwError) {
                throw error;
            }
        }
    };
}
exports.default = koaErrorResponder;
//# sourceMappingURL=index.js.map