import { BaseService } from '../base.js';
import { parseXml, validateResponse, normalizeXmlItems } from '../../core/parser.js';
import type { RawExamSchedule, RawSubject, GetSchedulesParams } from './types.js';
import { transformExamSchedules, transformSubjects } from './transformers.js';
import { ScheduleResponse, AllSchedulesResponse, SubjectResponse } from './response.js';

/** 시험일정 API 베이스 URL */
const SCHEDULE_API_BASE_URL = 'http://apis.data.go.kr/B490007/qualExamSchd';

/** 종목 목록 API 베이스 URL */
const SUBJECT_API_BASE_URL =
  'http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC';

/** 종목 목록 API XML 응답 구조 */
interface SubjectXmlResponse {
  readonly response: {
    readonly header: { readonly resultCode: string; readonly resultMsg: string };
    readonly body: {
      readonly items: { readonly item: RawSubject | readonly RawSubject[] } | '';
    };
  };
}

/**
 * 자격증 시험일정 서비스
 * @see https://www.data.go.kr/data/15074408/openapi.do
 */
export class QualificationService extends BaseService {
  protected readonly baseUrl = SCHEDULE_API_BASE_URL;

  /**
   * 시험일정 목록 조회 (단일 페이지)
   *
   * @example
   * ```typescript
   * const result = await client.qualification.getSchedules({ year: 2026 });
   *
   * // 정규화된 데이터 (SDK 보장)
   * result.getData()[0].writtenExam.registrationStart  // '2026-01-24'
   *
   * // 원본 데이터 (공공 API 그대로)
   * result.getRawData()[0].docRegStartDt  // '20260124'
   * ```
   */
  async getSchedules(
    params: GetSchedulesParams,
    options?: { readonly pageNo?: number; readonly numOfRows?: number }
  ): Promise<ScheduleResponse> {
    const result = await this.request<RawExamSchedule>({
      path: '/getQualExamSchdList',
      params: {
        implYy: params.year,
        qualgbCd: params.category,
        jmCd: params.jmCode,
      },
      pageNo: options?.pageNo,
      numOfRows: options?.numOfRows,
    });

    return new ScheduleResponse(
      result.data,
      transformExamSchedules(result.data),
      result.pagination
    );
  }

  /**
   * 시험일정 전체 조회 (모든 페이지 자동 수집)
   */
  async getAllSchedules(params: GetSchedulesParams): Promise<AllSchedulesResponse> {
    const raw = await this.requestAll<RawExamSchedule>({
      path: '/getQualExamSchdList',
      params: {
        implYy: params.year,
        qualgbCd: params.category,
        jmCd: params.jmCode,
      },
    });

    return new AllSchedulesResponse(raw, transformExamSchedules(raw));
  }

  /**
   * 국가자격 종목 전체 목록 조회
   *
   * @example
   * ```typescript
   * const result = await client.qualification.getSubjects();
   *
   * // 정규화된 데이터
   * result.getData()[0].name  // '정보처리기사'
   *
   * // 편의 메서드
   * result.findByName('정보처리기사')  // Subject
   * result.filterByCategory('T')  // 국가기술자격만
   * ```
   */
  async getSubjects(): Promise<SubjectResponse> {
    const url = `${SUBJECT_API_BASE_URL}/getList?serviceKey=${this.http.getServiceKey()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/xml' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xml = await response.text();
    const parsed = parseXml<SubjectXmlResponse>(xml);

    validateResponse(parsed.response.header);

    const raw = normalizeXmlItems(parsed.response.body.items) as readonly RawSubject[];

    return new SubjectResponse(raw, transformSubjects(raw));
  }
}
