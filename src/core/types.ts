/**
 * SDK Configuration
 */
export interface GongdataConfig {
  /** 공공데이터포털 API 서비스 키 */
  readonly serviceKey: string;
  /** 요청 타임아웃 (ms), 기본값: 10000 */
  readonly timeout?: number;
  /** 재시도 설정 */
  readonly retry?: RetryConfig;
}

export interface RetryConfig {
  /** 최대 재시도 횟수, 기본값: 3 */
  readonly maxRetries: number;
  /** 재시도 간격 (ms), 기본값: 1000 */
  readonly delay: number;
}

/**
 * 공공데이터 API 표준 응답 구조 (JSON)
 */
export interface DataGoKrResponse<T> {
  readonly header: ResponseHeader;
  readonly body: ResponseBody<T>;
}

export interface ResponseHeader {
  readonly resultCode: string;
  readonly resultMsg: string;
}

export interface ResponseBody<T> {
  readonly items: readonly T[] | '';
  readonly numOfRows: number;
  readonly pageNo: number;
  readonly totalCount: number;
}

/**
 * XML 응답용 items 래퍼 (XML은 items.item 구조)
 */
export interface XmlItemsWrapper<T> {
  readonly item: T | readonly T[];
}

/**
 * XML 응답 구조
 */
export interface DataGoKrXmlResponse<T> {
  readonly response: {
    readonly header: ResponseHeader;
    readonly body: {
      readonly items: XmlItemsWrapper<T> | '';
      readonly numOfRows: number;
      readonly pageNo: number;
      readonly totalCount: number;
    };
  };
}

/**
 * HTTP 요청 옵션
 */
export interface RequestOptions {
  readonly path: string;
  readonly params?: Record<string, string | number | undefined>;
  readonly pageNo?: number | undefined;
  readonly numOfRows?: number | undefined;
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  readonly pageNo: number;
  readonly numOfRows: number;
  readonly totalCount: number;
}

/**
 * 내부 API 응답 결과 (원본 데이터만)
 * @internal
 */
export interface RawApiResult<T> {
  readonly data: readonly T[];
  readonly pagination: PaginationInfo;
}

/**
 * API 응답 결과 (정규화 + 원본)
 * @template TRaw - 공공 API 원본 타입
 * @template T - SDK 정규화 타입
 */
export interface ApiResult<TRaw, T> {
  /** 정규화된 데이터 (SDK 보장 인터페이스) */
  readonly data: readonly T[];
  /** 원본 데이터 (공공 API 응답 그대로) */
  readonly raw: readonly TRaw[];
  /** 페이지네이션 정보 */
  readonly pagination: PaginationInfo;
}
