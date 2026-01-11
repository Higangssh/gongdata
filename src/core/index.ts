// Core exports
export { HttpClient } from './http.js';
export { GongdataError, ResultCode, type ResultCodeType } from './error.js';
export { DataResponse, PaginatedResponse } from './response.js';
export {
  parseXml,
  parseResponse,
  validateResponse,
  normalizeXmlItems,
  normalizeJsonItems,
} from './parser.js';
export type {
  GongdataConfig,
  RetryConfig,
  RequestOptions,
  RawApiResult,
  PaginationInfo,
  ResponseHeader,
  ResponseBody,
  DataGoKrResponse,
  DataGoKrXmlResponse,
  XmlItemsWrapper,
} from './types.js';
