import { DataResponse, PaginatedResponse } from '../../core/response.js';
import type { PaginationInfo } from '../../core/types.js';
import type { RawExamSchedule, ExamSchedule, RawSubject, Subject } from './types.js';

/**
 * 시험일정 조회 결과
 */
export class ScheduleResponse extends PaginatedResponse<RawExamSchedule, ExamSchedule> {
  private readonly _raw: readonly RawExamSchedule[];
  private readonly _data: readonly ExamSchedule[];
  private readonly _pagination: PaginationInfo;

  constructor(
    raw: readonly RawExamSchedule[],
    data: readonly ExamSchedule[],
    pagination: PaginationInfo
  ) {
    super();
    this._raw = raw;
    this._data = data;
    this._pagination = pagination;
  }

  getData(): readonly ExamSchedule[] {
    return this._data;
  }

  getRawData(): readonly RawExamSchedule[] {
    return this._raw;
  }

  getPagination(): PaginationInfo {
    return this._pagination;
  }
}

/**
 * 시험일정 전체 조회 결과 (페이지네이션 없음)
 */
export class AllSchedulesResponse extends DataResponse<RawExamSchedule, ExamSchedule> {
  private readonly _raw: readonly RawExamSchedule[];
  private readonly _data: readonly ExamSchedule[];

  constructor(raw: readonly RawExamSchedule[], data: readonly ExamSchedule[]) {
    super();
    this._raw = raw;
    this._data = data;
  }

  getData(): readonly ExamSchedule[] {
    return this._data;
  }

  getRawData(): readonly RawExamSchedule[] {
    return this._raw;
  }
}

/**
 * 종목 목록 조회 결과
 */
export class SubjectResponse extends DataResponse<RawSubject, Subject> {
  private readonly _raw: readonly RawSubject[];
  private readonly _data: readonly Subject[];

  constructor(raw: readonly RawSubject[], data: readonly Subject[]) {
    super();
    this._raw = raw;
    this._data = data;
  }

  getData(): readonly Subject[] {
    return this._data;
  }

  getRawData(): readonly RawSubject[] {
    return this._raw;
  }

  /**
   * 종목코드로 찾기
   */
  findByCode(code: string): Subject | undefined {
    return this._data.find((s) => s.code === code);
  }

  /**
   * 종목명으로 찾기
   */
  findByName(name: string): Subject | undefined {
    return this._data.find((s) => s.name === name);
  }

  /**
   * 자격구분으로 필터링
   */
  filterByCategory(categoryCode: string): readonly Subject[] {
    return this._data.filter((s) => s.category.code === categoryCode);
  }
}
