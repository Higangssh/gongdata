/**
 * 자격구분 코드
 * @see https://www.data.go.kr/data/15074408/openapi.do
 */
export const QualificationCategory = {
  /** 국가기술자격 */
  NATIONAL_TECHNICAL: 'T',
  /** 과정평가형자격 */
  COURSE_EVALUATION: 'C',
  /** 일학습병행자격 */
  WORK_LEARNING: 'W',
  /** 국가전문자격 */
  NATIONAL_PROFESSIONAL: 'S',
} as const;

export type QualificationCategoryType =
  (typeof QualificationCategory)[keyof typeof QualificationCategory];

/**
 * 주요 종목코드 (자주 사용되는 자격증)
 * @see https://www.data.go.kr/data/15003024/openapi.do
 * @description getSubjects()로 전체 목록 조회 가능
 */
export const JmCode = {
  // === 정보통신 ===
  /** 정보처리기사 */
  INFORMATION_PROCESSING_ENGINEER: '1320',
  /** 정보처리산업기사 */
  INFORMATION_PROCESSING_INDUSTRIAL_ENGINEER: '2290',
  /** 정보관리기술사 */
  INFORMATION_MANAGEMENT_PROFESSIONAL_ENGINEER: '0601',
  /** 컴퓨터시스템응용기술사 */
  COMPUTER_SYSTEM_APPLICATION_PROFESSIONAL_ENGINEER: '0622',

  // === 전기/전자 ===
  /** 전기기사 */
  ELECTRICAL_ENGINEER: '1150',
  /** 전기기능사 */
  ELECTRICAL_TECHNICIAN: '7780',
  /** 전기공사기사 */
  ELECTRICAL_CONSTRUCTION_ENGINEER: '1160',
  /** 전자기사 */
  ELECTRONICS_ENGINEER: '1230',

  // === 기계 ===
  /** 기계기사 */
  MECHANICAL_ENGINEER: '1431',
  /** 용접기사 */
  WELDING_ENGINEER: '1022',
  /** 지게차운전기능사 */
  FORKLIFT_DRIVER_TECHNICIAN: '7875',

  // === 건설 ===
  /** 건축기사 */
  ARCHITECTURE_ENGINEER: '1190',
  /** 토목기사 */
  CIVIL_ENGINEERING_ENGINEER: '1080',

  // === 조리/서비스 ===
  /** 한식조리기능사 */
  KOREAN_CUISINE_TECHNICIAN: '7910',
  /** 양식조리기능사 */
  WESTERN_CUISINE_TECHNICIAN: '7911',
  /** 미용사(일반) */
  BEAUTICIAN_GENERAL: '7937',
} as const;

export type JmCodeType = (typeof JmCode)[keyof typeof JmCode];
