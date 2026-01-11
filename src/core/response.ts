import type { PaginationInfo } from './types.js';

/**
 * API 응답 기본 추상 클래스
 * @template TRaw - 공공 API 원본 타입
 * @template T - SDK 정규화 타입
 */
export abstract class DataResponse<TRaw, T> {
  /**
   * 정규화된 데이터 (SDK 보장 인터페이스)
   * @description 버전 업그레이드 시에도 인터페이스 호환성 보장
   */
  abstract getData(): readonly T[];

  /**
   * 원본 데이터 (공공 API 응답 그대로)
   * @description 공공 API 스펙 변경 시 같이 변경될 수 있음
   */
  abstract getRawData(): readonly TRaw[];

  /** 정규화된 데이터 (getter) */
  get data(): readonly T[] {
    return this.getData();
  }

  /** 원본 데이터 (getter) */
  get rawData(): readonly TRaw[] {
    return this.getRawData();
  }

  /**
   * 데이터가 비어있는지 확인
   */
  isEmpty(): boolean {
    return this.data.length === 0;
  }

  /**
   * 데이터 개수
   */
  count(): number {
    return this.data.length;
  }
}

/**
 * 페이지네이션이 있는 API 응답 추상 클래스
 */
export abstract class PaginatedResponse<TRaw, T> extends DataResponse<TRaw, T> {
  /**
   * 페이지네이션 정보
   */
  abstract getPagination(): PaginationInfo;

  /** 페이지네이션 정보 (getter) */
  get pagination(): PaginationInfo {
    return this.getPagination();
  }

  /** 전체 데이터 개수 */
  get totalCount(): number {
    return this.pagination.totalCount;
  }

  /** 현재 페이지 번호 */
  get pageNo(): number {
    return this.pagination.pageNo;
  }

  /** 페이지 당 항목 수 */
  get numOfRows(): number {
    return this.pagination.numOfRows;
  }

  /**
   * 다음 페이지 존재 여부
   */
  hasNextPage(): boolean {
    const { pageNo, numOfRows, totalCount } = this.pagination;
    return pageNo * numOfRows < totalCount;
  }
}
