/**
 * 시험일정 조회 파라미터
 */
export interface GetSchedulesParams {
  /** 시행년도 (YYYY) */
  readonly year: number;
  /** 자격구분코드 (T: 국가기술자격, C: 과정평가형, W: 일학습병행, S: 국가전문자격) */
  readonly category?: string;
  /** 종목코드 */
  readonly jmCode?: string;
}

// ============================================================================
// Raw Types (공공 API 원본 - 스펙 변경 시 같이 변경될 수 있음)
// ============================================================================

/**
 * 시험일정 원본 데이터 (공공 API 응답 그대로)
 * @see https://www.data.go.kr/data/15074408/openapi.do
 */
export interface RawExamSchedule {
  /** 시행년도 */
  readonly implYy: string;
  /** 시행회차 */
  readonly implSeq: number;
  /** 자격구분코드 (T/C/W/S) */
  readonly qualgbCd: string;
  /** 자격구분명 */
  readonly qualgbNm: string;
  /** 시행계획 설명 */
  readonly description: string;
  /** 필기시험 원서접수 시작일자 (YYYYMMDD) */
  readonly docRegStartDt: string;
  /** 필기시험 원서접수 종료일자 (YYYYMMDD) */
  readonly docRegEndDt: string;
  /** 필기시험 시작일자 (YYYYMMDD) */
  readonly docExamStartDt: string;
  /** 필기시험 종료일자 (YYYYMMDD) */
  readonly docExamEndDt: string;
  /** 필기시험 합격(예정)자 발표일자 (YYYYMMDD) */
  readonly docPassDt: string;
  /** 실기(작업)/면접 시험 원서접수 시작일자 (YYYYMMDD) */
  readonly pracRegStartDt: string;
  /** 실기(작업)/면접 시험 원서접수 종료일자 (YYYYMMDD) */
  readonly pracRegEndDt: string;
  /** 실기(작업)/면접 시험 시작일자 (YYYYMMDD) */
  readonly pracExamStartDt: string;
  /** 실기(작업)/면접 시험 종료일자 (YYYYMMDD) */
  readonly pracExamEndDt: string;
  /** 실기(작업)/면접 합격자 발표일자 (YYYYMMDD) */
  readonly pracPassDt: string;
}

// ============================================================================
// Normalized Types (SDK 보장 - 버전업해도 인터페이스 유지)
// ============================================================================

/**
 * 시험 기간 정보
 */
export interface ExamPeriod {
  /** 원서접수 시작일 (YYYY-MM-DD) */
  readonly registrationStart: string;
  /** 원서접수 종료일 (YYYY-MM-DD) */
  readonly registrationEnd: string;
  /** 시험 시작일 (YYYY-MM-DD) */
  readonly examStart: string;
  /** 시험 종료일 (YYYY-MM-DD) */
  readonly examEnd: string;
  /** 합격자 발표일 (YYYY-MM-DD) */
  readonly resultDate: string;
}

/**
 * 자격 구분 정보
 */
export interface QualificationCategoryInfo {
  /** 자격구분 코드 (T/C/W/S) */
  readonly code: string;
  /** 자격구분명 (국가기술자격, 과정평가형자격 등) */
  readonly name: string;
}

/**
 * 시험일정 정규화 데이터 (SDK 보장 인터페이스)
 */
export interface ExamSchedule {
  /** 시행년도 */
  readonly year: number;
  /** 시행회차 (1회, 2회, 3회 등) */
  readonly round: number;
  /** 자격구분 */
  readonly category: QualificationCategoryInfo;
  /** 시행계획 설명 */
  readonly description: string;
  /** 필기시험 일정 */
  readonly writtenExam: ExamPeriod;
  /** 실기시험 일정 */
  readonly practicalExam: ExamPeriod;
}

/**
 * 종목 원본 데이터 (공공 API 응답 그대로)
 * @see https://www.data.go.kr/data/15003024/openapi.do
 */
export interface RawSubject {
  /** 종목코드 */
  readonly jmcd: string;
  /** 종목명 */
  readonly jmfldnm: string;
  /** 자격구분코드 (T/C/W/S) */
  readonly qualgbcd: string;
  /** 자격구분명 */
  readonly qualgbnm: string;
  /** 계열코드 */
  readonly seriescd: string;
  /** 계열명 */
  readonly seriesnm: string;
  /** 대직무분야코드 */
  readonly obligfldcd: string;
  /** 대직무분야명 */
  readonly obligfldnm: string;
  /** 중직무분야코드 */
  readonly mdobligfldcd: string;
  /** 중직무분야명 */
  readonly mdobligfldnm: string;
}

/**
 * 직무분야 정보
 */
export interface JobField {
  /** 직무분야 코드 */
  readonly code: string;
  /** 직무분야명 */
  readonly name: string;
}

/**
 * 종목 정규화 데이터 (SDK 보장 인터페이스)
 */
export interface Subject {
  /** 종목코드 */
  readonly code: string;
  /** 종목명 */
  readonly name: string;
  /** 자격구분 */
  readonly category: QualificationCategoryInfo;
  /** 계열 (기술사, 기사, 기능사 등) */
  readonly series: {
    readonly code: string;
    readonly name: string;
  };
  /** 대직무분야 */
  readonly majorJobField: JobField;
  /** 중직무분야 */
  readonly minorJobField: JobField;
}
