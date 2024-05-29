/**
 * HTTP Status Codes Enum
 *
 * Enum representing standard HTTP status codes.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status} for more details.
 * @see {@link https://www.rfc-editor.org/rfc/rfc2616} for the original HTTP/1.1 standard.
 * @see {@link https://www.ieee.org} for IEEE documentation.
 */
export enum HttpStatusCode {
  /**
   * 100 Continue
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100}
   */
  Continue = 100,

  /**
   * 101 Switching Protocols
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101}
   */
  SwitchingProtocols = 101,

  /**
   * 200 OK
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200}
   */
  OK = 200,

  /**
   * 201 Created
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201}
   */
  Created = 201,

  /**
   * 202 Accepted
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202}
   */
  Accepted = 202,

  /**
   * 204 No Content
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204}
   */
  NoContent = 204,

  /**
   * 301 Moved Permanently
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301}
   */
  MovedPermanently = 301,

  /**
   * 302 Found
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302}
   */
  Found = 302,

  /**
   * 304 Not Modified
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304}
   */
  NotModified = 304,

  /**
   * 400 Bad Request
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400}
   */
  BadRequest = 400,

  /**
   * 401 Unauthorized
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401}
   */
  Unauthorized = 401,

  /**
   * 403 Forbidden
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403}
   */
  Forbidden = 403,

  /**
   * 404 Not Found
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404}
   */
  NotFound = 404,

  /**
   * 409 Conflict
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409}
   */
  Conflict = 409,

  /**
   * 422 Unprocessable Entity
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422}
   */
  UnprocessableEntity = 422,

  /**
   * 500 Internal Server Error
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500}
   */
  InternalServerError = 500,

  /**
   * 502 Bad Gateway
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502}
   */
  BadGateway = 502,

  /**
   * 503 Service Unavailable
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503}
   */
  ServiceUnavailable = 503,

  /**
   * 504 Gateway Timeout
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504}
   */
  GatewayTimeout = 504,
}
