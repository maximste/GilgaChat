/**
 * Стандартные коды ответа HTTP (избегаем «магических чисел» в сравнениях).
 * Объект вместо `enum` — совместимо с `erasableSyntaxOnly` в tsconfig.
 */
const HttpStatus = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  MultipleChoices: 300,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  InternalServerError: 500,
} as const;

type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

export { HttpStatus, type HttpStatusCode };
