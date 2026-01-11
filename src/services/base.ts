import type { HttpClient, RequestOptions, RawApiResult } from '../core/index.js';

/**
 * 모든 서비스의 기본 추상 클래스
 * 새 서비스 추가 시 이 클래스를 상속받아 구현
 */
export abstract class BaseService {
  protected readonly http: HttpClient;

  /** 서비스 기본 URL */
  protected abstract readonly baseUrl: string;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * 단일 페이지 요청
   */
  protected async request<T>(options: RequestOptions): Promise<RawApiResult<T>> {
    return this.http.request<T>(this.baseUrl, options);
  }

  /**
   * 전체 페이지 자동 수집
   */
  protected async requestAll<T>(
    options: RequestOptions,
    numOfRows?: number
  ): Promise<readonly T[]> {
    return this.http.requestAll<T>(this.baseUrl, options, numOfRows);
  }
}
