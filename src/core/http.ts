import type { GongdataConfig, RequestOptions, RawApiResult } from './types.js';
import { parseResponse } from './parser.js';
import { GongdataError, ResultCode } from './error.js';

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_NUM_OF_ROWS = 100;

export class HttpClient {
  private readonly serviceKey: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor(config: GongdataConfig) {
    this.serviceKey = config.serviceKey;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.maxRetries = config.retry?.maxRetries ?? 3;
    this.retryDelay = config.retry?.delay ?? 1000;
  }

  /**
   * 서비스 키 반환 (일부 API에서 직접 URL 구성 시 필요)
   */
  getServiceKey(): string {
    return this.serviceKey;
  }

  /**
   * URL 파라미터 빌드
   */
  private buildParams(params: Record<string, string | number | undefined>): URLSearchParams {
    const searchParams = new URLSearchParams();
    searchParams.set('serviceKey', this.serviceKey);

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }

    return searchParams;
  }

  /**
   * 단일 요청 실행 (재시도 포함)
   */
  async request<T>(baseUrl: string, options: RequestOptions): Promise<RawApiResult<T>> {
    const { path, params = {}, pageNo = 1, numOfRows = DEFAULT_NUM_OF_ROWS } = options;
    const url = `${baseUrl}${path}`;
    const searchParams = this.buildParams({
      ...params,
      pageNo,
      numOfRows,
      dataFormat: 'json', // 필수 파라미터
    });

    const fullUrl = `${url}?${searchParams.toString()}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(fullUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            Accept: 'application/json, application/xml',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new GongdataError(
            ResultCode.HTTP_ERROR,
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const contentType = response.headers.get('content-type');
        const text = await response.text();
        const parsed = parseResponse<T>(text, contentType);

        const { body } = parsed;

        return {
          data: body.items,
          pagination: {
            pageNo: body.pageNo,
            numOfRows: body.numOfRows,
            totalCount: body.totalCount,
          },
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // AbortError는 타임아웃
        if (lastError.name === 'AbortError') {
          lastError = new GongdataError(ResultCode.SERVICE_TIMEOUT, 'Request timeout');
        }

        // 재시도 불가능한 에러
        if (GongdataError.isGongdataError(lastError)) {
          const nonRetryableCodes = [
            ResultCode.UNREGISTERED_SERVICE_KEY,
            ResultCode.EXPIRED_SERVICE_KEY,
            ResultCode.SERVICE_ACCESS_DENIED,
            ResultCode.INVALID_REQUEST_PARAMETER,
            ResultCode.UNREGISTERED_IP,
            ResultCode.MISSING_REQUIRED_PARAMETER,
            ResultCode.INVALID_DATA_FORMAT,
          ];

          if (nonRetryableCodes.includes(lastError.code as (typeof nonRetryableCodes)[number])) {
            throw lastError;
          }
        }

        // 마지막 시도가 아니면 대기 후 재시도
        if (attempt < this.maxRetries) {
          await this.sleep(this.retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError ?? new GongdataError(ResultCode.APPLICATION_ERROR, 'Unknown error');
  }

  /**
   * 전체 페이지 데이터 수집
   */
  async requestAll<T>(
    baseUrl: string,
    options: RequestOptions,
    numOfRows: number = DEFAULT_NUM_OF_ROWS
  ): Promise<readonly T[]> {
    const allItems: T[] = [];
    let pageNo = 1;
    let totalCount = 0;

    do {
      const result = await this.request<T>(baseUrl, {
        ...options,
        pageNo,
        numOfRows,
      });

      allItems.push(...result.data);
      totalCount = result.pagination.totalCount;
      pageNo++;
    } while (allItems.length < totalCount);

    return allItems;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
