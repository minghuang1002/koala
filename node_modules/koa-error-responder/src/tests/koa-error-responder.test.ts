import { Context } from 'koa';

import koaErrorResponder from '../index';

describe('koa-error-responder', () => {
  test('Should catch errors thrown downstream', async () => {
    const middleware = koaErrorResponder({ debug: false });
    const context = {
      response: {
        body: {},
        status: 0
      }
    } as Context;

    await middleware(context as Context, async () => {
      const error = new Error('test');
      (error as any).statusCode = 400;
      throw error;
    }).catch(() => {});

    expect(context.response.body.error).toEqual({
      message: 'test',
      statusCode: 400
    });
  });

  test('Should hide error message when debug is false and a 500 error is thrown', async () => {
    const middleware = koaErrorResponder({ debug: false });
    const context = {
      response: {
        body: {},
        status: 0
      }
    } as Context;

    await middleware(context as Context, async () => {
      const error = new Error('test');
      (error as any).statusCode = 500;
      throw error;
    }).catch(() => {});

    expect(context.response.body.error).toEqual({
      message: 'Internal server error.',
      statusCode: 500
    });
  });

  test('Should include error message when debug is true and a 500 error is thrown', async () => {
    const middleware = koaErrorResponder({ debug: true });
    const context = {
      response: {
        body: {},
        status: 0
      }
    } as Context;

    await middleware(context as Context, async () => {
      const error = new Error('test');
      (error as any).statusCode = 500;
      throw error;
    }).catch(() => {});

    expect(context.response.body.error).toEqual({
      message: 'Internal server error - test',
      statusCode: 500
    });
  });

  test('Should handle missing status codes as internal server errors', async () => {
    const middleware = koaErrorResponder({ debug: true });
    const context = {
      response: {
        body: {},
        status: 0
      }
    } as Context;

    await middleware(context as Context, async () => {
      throw new Error('test');
    }).catch(() => {});

    expect(context.response.body.error).toEqual({
      message: 'Internal server error - test',
      statusCode: 500
    });
  });
});
