# Koa Error Responder

[![Build Status](https://travis-ci.com/jmeyers91/koa-error-responder.svg?branch=master)](https://travis-ci.com/jmeyers91/koa-error-responder)

Koa middleware for handling errors thrown while handling a request.

## Install

```
npm install koa-error-responder
```

## Usage

```ts
import koaErrorResponder from 'koa-error-responder';

app.use(
  koaErrorResponder({
    debug: process.env.NODE_ENV !== 'production'
  })
);

app.use(() => {
  // This error will be handled by `koaErrorResponder`.
  const error = new Error('Something went wrong');
  error.statusCode = 403;
  throw error;
});
```

## Options

- `debug` - When enabled, internal server error messages will be included in responses. This should be turned off in production to avoid leaking server implementation details.
