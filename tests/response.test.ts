import { describe, it, expect } from 'vitest';
import {
  ScheduleResponse,
  AllSchedulesResponse,
  SubjectResponse,
} from '../src/services/qualification/response.js';
import type {
  RawExamSchedule,
  ExamSchedule,
  RawSubject,
  Subject,
} from '../src/services/qualification/types.js';

// Mock data
const mockRawSchedule: RawExamSchedule = {
  implYy: '2026',
  implSeq: 1,
  qualgbCd: 'T',
  qualgbNm: '국가기술자격',
  description: '2026년 제1회 시험',
  docRegStartDt: '20260124',
  docRegEndDt: '20260127',
  docExamStartDt: '20260222',
  docExamEndDt: '20260307',
  docPassDt: '20260312',
  pracRegStartDt: '20260314',
  pracRegEndDt: '20260320',
  pracExamStartDt: '20260419',
  pracExamEndDt: '20260509',
  pracPassDt: '20260612',
};

const mockSchedule: ExamSchedule = {
  year: 2026,
  round: 1,
  category: { code: 'T', name: '국가기술자격' },
  description: '2026년 제1회 시험',
  writtenExam: {
    registrationStart: '2026-01-24',
    registrationEnd: '2026-01-27',
    examStart: '2026-02-22',
    examEnd: '2026-03-07',
    resultDate: '2026-03-12',
  },
  practicalExam: {
    registrationStart: '2026-03-14',
    registrationEnd: '2026-03-20',
    examStart: '2026-04-19',
    examEnd: '2026-05-09',
    resultDate: '2026-06-12',
  },
};

const mockRawSubject: RawSubject = {
  jmcd: '1320',
  jmfldnm: '정보처리기사',
  qualgbcd: 'T',
  qualgbnm: '국가기술자격',
  seriescd: '01',
  seriesnm: '기사',
  obligfldcd: '11',
  obligfldnm: '정보통신',
  mdobligfldcd: '01',
  mdobligfldnm: '정보기술',
};

const mockSubject: Subject = {
  code: '1320',
  name: '정보처리기사',
  category: { code: 'T', name: '국가기술자격' },
  series: { code: '01', name: '기사' },
  majorJobField: { code: '11', name: '정보통신' },
  minorJobField: { code: '01', name: '정보기술' },
};

describe('ScheduleResponse', () => {
  const response = new ScheduleResponse(
    [mockRawSchedule],
    [mockSchedule],
    { pageNo: 1, numOfRows: 10, totalCount: 1 }
  );

  it('should return normalized data via getData()', () => {
    expect(response.getData()).toEqual([mockSchedule]);
  });

  it('should return raw data via getRawData()', () => {
    expect(response.getRawData()).toEqual([mockRawSchedule]);
  });

  it('should return data via getter', () => {
    expect(response.data).toEqual([mockSchedule]);
  });

  it('should return rawData via getter', () => {
    expect(response.rawData).toEqual([mockRawSchedule]);
  });

  it('should return pagination info', () => {
    expect(response.pagination).toEqual({ pageNo: 1, numOfRows: 10, totalCount: 1 });
    expect(response.pageNo).toBe(1);
    expect(response.numOfRows).toBe(10);
    expect(response.totalCount).toBe(1);
  });

  it('should check hasNextPage correctly', () => {
    expect(response.hasNextPage()).toBe(false);

    const responseWithMore = new ScheduleResponse(
      [mockRawSchedule],
      [mockSchedule],
      { pageNo: 1, numOfRows: 10, totalCount: 100 }
    );
    expect(responseWithMore.hasNextPage()).toBe(true);
  });

  it('should check isEmpty correctly', () => {
    expect(response.isEmpty()).toBe(false);

    const emptyResponse = new ScheduleResponse([], [], { pageNo: 1, numOfRows: 10, totalCount: 0 });
    expect(emptyResponse.isEmpty()).toBe(true);
  });

  it('should return correct count', () => {
    expect(response.count()).toBe(1);
  });
});

describe('AllSchedulesResponse', () => {
  const response = new AllSchedulesResponse([mockRawSchedule], [mockSchedule]);

  it('should return normalized data via getData()', () => {
    expect(response.getData()).toEqual([mockSchedule]);
  });

  it('should return raw data via getRawData()', () => {
    expect(response.getRawData()).toEqual([mockRawSchedule]);
  });

  it('should return data via getter', () => {
    expect(response.data).toEqual([mockSchedule]);
  });

  it('should check isEmpty correctly', () => {
    expect(response.isEmpty()).toBe(false);
  });

  it('should return correct count', () => {
    expect(response.count()).toBe(1);
  });
});

describe('SubjectResponse', () => {
  const response = new SubjectResponse([mockRawSubject], [mockSubject]);

  it('should return normalized data via getData()', () => {
    expect(response.getData()).toEqual([mockSubject]);
  });

  it('should return raw data via getRawData()', () => {
    expect(response.getRawData()).toEqual([mockRawSubject]);
  });

  it('should find subject by code', () => {
    expect(response.findByCode('1320')).toEqual(mockSubject);
    expect(response.findByCode('9999')).toBeUndefined();
  });

  it('should find subject by name', () => {
    expect(response.findByName('정보처리기사')).toEqual(mockSubject);
    expect(response.findByName('없는종목')).toBeUndefined();
  });

  it('should filter by category', () => {
    expect(response.filterByCategory('T')).toEqual([mockSubject]);
    expect(response.filterByCategory('S')).toEqual([]);
  });
});
