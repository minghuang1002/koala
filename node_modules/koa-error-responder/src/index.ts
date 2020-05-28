import { Context } from "koa";

export interface koaErrorResponderOptions {
  /**
   * When `debug` is enabled, internal server error (status code `500`) messages will
   * be included in responses. Defaults to `false`.
   */
  debug?: boolean;

  /**
   * Whether or not to throw caught errors to allow handling upstream.
   * Defaults to `false`.
   */
  throwError?: boolean;
}

export type koaErrorResponderMiddleware = (
  context: Context,
  next: () => Promise<void>
) => Promise<void>;

/**
 * Catches errors thrown while handling requests and responds with the error message
 * using the status attached to the error. The status `500` is used if the error doesn't have
 * a `status` or `statusCode` field.
 */
export default function koaErrorResponder(
  options: koaErrorResponderOptions = {}
): koaErrorResponderMiddleware {
  const { debug = false, throwError = false } = options;

  return async function koaErrorResponderMiddleware(context, next) {
    try {
      await next();
    } catch (error) {
      const statusCode = error.statusCode || error.status || 500;
      let errorMessage: string;
      let errorData: Error | null = null;

      if (statusCode === 500) {
        if (debug) {
          errorMessage = `Internal server error - ${error.message}`;
        } else {
          errorMessage = "Internal server error.";
        }
      } else {
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
