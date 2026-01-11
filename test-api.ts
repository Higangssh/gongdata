import 'dotenv/config';
import { createClient, JmCode } from './src/index.js';

const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;

if (!serviceKey) {
  throw new Error('DATA_GO_KR_SERVICE_KEY 환경변수가 필요합니다. .env 파일을 확인하세요.');
}

const client = createClient({ serviceKey });

async function main() {
  try {
    // JmCode 상수 사용 예시
    console.log('=== 정보처리기사 시험일정 ===');
    const schedules = await client.qualification.getSchedules(
      { year: 2026, jmCode: JmCode.INFORMATION_PROCESSING_ENGINEER },
      { numOfRows: 3 }
    );
    console.log('pagination:', schedules.pagination);
    console.log('data:', schedules.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
