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
export declare type koaErrorResponderMiddleware = (context: Context, next: () => Promise<void>) => Promise<void>;
/**
 * Catches errors thrown while handling requests and responds with the error message
 * using the status attached to the error. The status `500` is used if the error doesn't have
 * a `status` or `statusCode` field.
 */
export default function koaErrorResponder(options?: koaErrorResponderOptions): koaErrorResponderMiddleware;
//# sourceMappingURL=index.d.ts.map