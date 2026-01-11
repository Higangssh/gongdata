import { HttpClient, type GongdataConfig } from './core/index.js';
import { QualificationService } from './services/qualification/index.js';

/**
 * Gongdata 클라이언트 인터페이스
 */
export interface GongdataClient {
  /** 자격증 시험일정 서비스 */
  readonly qualification: QualificationService;
}

/**
 * Gongdata 클라이언트 생성
 *
 * @example
 * ```typescript
 * const client = createClient({
 *   serviceKey: process.env.DATA_GO_KR_KEY!,
 * });
 *
 * const schedules = await client.qualification.getSchedules({ year: 2026 });
 * ```
 */
export function createClient(config: GongdataConfig): GongdataClient {
  const http = new HttpClient(config);

  return {
    qualification: new QualificationService(http),
  };
}
