/**
 * 공공데이터포털 API 응답 코드
 * @see https://www.data.go.kr
 */
export const ResultCode = {
  /** 정상 */
  SUCCESS: '00',

  // === 공공데이터포털 공통 에러 ===
  /** 어플리케이션 에러 */
  APPLICATION_ERROR: '1',
  /** 잘못된 요청 파라미터 */
  INVALID_REQUEST_PARAMETER: '10',
  /** 해당 오픈API 서비스 없음 또는 폐기 */
  NO_OPENAPI_SERVICE: '12',
  /** 서비스 접근 거부 */
  SERVICE_ACCESS_DENIED: '20',
  /** 서비스 요청 제한 횟수 초과 */
  REQUEST_LIMIT_EXCEEDED: '22',
  /** 등록되지 않은 서비스키 */
  UNREGISTERED_SERVICE_KEY: '30',
  /** 서비스키 기한 만료 */
  EXPIRED_SERVICE_KEY: '31',
  /** 등록되지 않은 IP */
  UNREGISTERED_IP: '32',
  /** 기타 에러 */
  UNKNOWN_ERROR: '99',

  // === SDK 내부 에러 ===
  /** HTTP 에러 */
  HTTP_ERROR: 'HTTP_ERROR',
  /** 서비스 타임아웃 */
  SERVICE_TIMEOUT: 'SERVICE_TIMEOUT',

  // === HRDK(한국산업인력공단) 자체 에러 ===
  /** 게이트웨이 인증 오류 */
  GATEWAY_AUTH_ERROR: '900',
  /** 필수 파라미터 누락 */
  MISSING_REQUIRED_PARAMETER: '910',
  /** 잘못된 dataFormat (json/xml만 가능) */
  INVALID_DATA_FORMAT: '920',
  /** 최대 목록 수 초과 */
  MAX_ROWS_EXCEEDED: '930',
  /** 잘못된 토큰 파라미터 */
  INVALID_TOKEN: '940',
  /** 토큰 유효기한 만료 (1시간) */
  TOKEN_EXPIRED: '941',
  /** 파일을 찾을 수 없음 */
  FILE_NOT_FOUND: '950',
  /** HRDK 서버 에러 */
  HRDK_SERVER_ERROR: '990',
} as const;

export type ResultCodeType = (typeof ResultCode)[keyof typeof ResultCode];

const RESULT_MESSAGES: Readonly<Record<ResultCodeType, string>> = {
  [ResultCode.SUCCESS]: '정상',
  [ResultCode.APPLICATION_ERROR]: '어플리케이션 에러',
  [ResultCode.INVALID_REQUEST_PARAMETER]: '잘못된 요청 파라미터',
  [ResultCode.NO_OPENAPI_SERVICE]: '해당 오픈API 서비스 없음',
  [ResultCode.SERVICE_ACCESS_DENIED]: '서비스 접근 거부',
  [ResultCode.REQUEST_LIMIT_EXCEEDED]: '서비스 요청 제한 횟수 초과',
  [ResultCode.UNREGISTERED_SERVICE_KEY]: '등록되지 않은 서비스키',
  [ResultCode.EXPIRED_SERVICE_KEY]: '서비스키 기한 만료',
  [ResultCode.UNREGISTERED_IP]: '등록되지 않은 IP',
  [ResultCode.UNKNOWN_ERROR]: '기타 에러',
  [ResultCode.HTTP_ERROR]: 'HTTP 에러',
  [ResultCode.SERVICE_TIMEOUT]: '서비스 타임아웃',
  [ResultCode.GATEWAY_AUTH_ERROR]: '게이트웨이 인증 오류',
  [ResultCode.MISSING_REQUIRED_PARAMETER]: '필수 파라미터 누락',
  [ResultCode.INVALID_DATA_FORMAT]: '잘못된 dataFormat (json/xml만 가능)',
  [ResultCode.MAX_ROWS_EXCEEDED]: '최대 목록 수 초과',
  [ResultCode.INVALID_TOKEN]: '잘못된 토큰 파라미터',
  [ResultCode.TOKEN_EXPIRED]: '토큰 유효기한 만료',
  [ResultCode.FILE_NOT_FOUND]: '파일을 찾을 수 없음',
  [ResultCode.HRDK_SERVER_ERROR]: 'HRDK 서버 에러',
};

export class GongdataError extends Error {
  readonly code: ResultCodeType | string;
  readonly originalResponse?: unknown;

  constructor(code: ResultCodeType | string, message?: string, originalResponse?: unknown) {
    const errorMessage =
      message ?? RESULT_MESSAGES[code as ResultCodeType] ?? `Unknown error: ${code}`;
    super(errorMessage);
    this.name = 'GongdataError';
    this.code = code;
    this.originalResponse = originalResponse;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GongdataError);
    }
  }

  static isGongdataError(error: unknown): error is GongdataError {
    return error instanceof GongdataError;
  }

  static fromResponse(
    header: { readonly resultCode: string; readonly resultMsg: string },
    originalResponse?: unknown
  ): GongdataError {
    return new GongdataError(header.resultCode, header.resultMsg, originalResponse);
  }
}
