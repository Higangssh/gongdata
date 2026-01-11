import { describe, it, expect } from 'vitest';
import {
  transformExamSchedule,
  transformExamSchedules,
  transformSubject,
  transformSubjects,
} from '../src/services/qualification/transformers.js';
import type { RawExamSchedule, RawSubject } from '../src/services/qualification/types.js';

describe('transformExamSchedule', () => {
  const rawSchedule: RawExamSchedule = {
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

  it('should transform year from string to number', () => {
    const result = transformExamSchedule(rawSchedule);
    expect(result.year).toBe(2026);
    expect(typeof result.year).toBe('number');
  });

  it('should preserve round as number', () => {
    const result = transformExamSchedule(rawSchedule);
    expect(result.round).toBe(1);
  });

  it('should transform category info', () => {
    const result = transformExamSchedule(rawSchedule);
    expect(result.category).toEqual({
      code: 'T',
      name: '국가기술자격',
    });
  });

  it('should format written exam dates (YYYYMMDD → YYYY-MM-DD)', () => {
    const result = transformExamSchedule(rawSchedule);
    expect(result.writtenExam).toEqual({
      registrationStart: '2026-01-24',
      registrationEnd: '2026-01-27',
      examStart: '2026-02-22',
      examEnd: '2026-03-07',
      resultDate: '2026-03-12',
    });
  });

  it('should format practical exam dates (YYYYMMDD → YYYY-MM-DD)', () => {
    const result = transformExamSchedule(rawSchedule);
    expect(result.practicalExam).toEqual({
      registrationStart: '2026-03-14',
      registrationEnd: '2026-03-20',
      examStart: '2026-04-19',
      examEnd: '2026-05-09',
      resultDate: '2026-06-12',
    });
  });

  it('should preserve description', () => {
    const result = transformExamSchedule(rawSchedule);
    expect(result.description).toBe('2026년 제1회 시험');
  });

  it('should handle invalid date format gracefully', () => {
    const rawWithInvalidDate: RawExamSchedule = {
      ...rawSchedule,
      docRegStartDt: '', // empty
      docRegEndDt: '123', // too short
    };
    const result = transformExamSchedule(rawWithInvalidDate);
    expect(result.writtenExam.registrationStart).toBe('');
    expect(result.writtenExam.registrationEnd).toBe('123');
  });
});

describe('transformExamSchedules', () => {
  it('should transform array of raw schedules', () => {
    const rawSchedules: RawExamSchedule[] = [
      {
        implYy: '2026',
        implSeq: 1,
        qualgbCd: 'T',
        qualgbNm: '국가기술자격',
        description: '1회',
        docRegStartDt: '20260101',
        docRegEndDt: '20260110',
        docExamStartDt: '20260201',
        docExamEndDt: '20260210',
        docPassDt: '20260301',
        pracRegStartDt: '20260310',
        pracRegEndDt: '20260320',
        pracExamStartDt: '20260401',
        pracExamEndDt: '20260410',
        pracPassDt: '20260501',
      },
      {
        implYy: '2026',
        implSeq: 2,
        qualgbCd: 'T',
        qualgbNm: '국가기술자격',
        description: '2회',
        docRegStartDt: '20260601',
        docRegEndDt: '20260610',
        docExamStartDt: '20260701',
        docExamEndDt: '20260710',
        docPassDt: '20260801',
        pracRegStartDt: '20260810',
        pracRegEndDt: '20260820',
        pracExamStartDt: '20260901',
        pracExamEndDt: '20260910',
        pracPassDt: '20261001',
      },
    ];

    const result = transformExamSchedules(rawSchedules);
    expect(result).toHaveLength(2);
    expect(result[0].round).toBe(1);
    expect(result[1].round).toBe(2);
  });

  it('should return empty array for empty input', () => {
    const result = transformExamSchedules([]);
    expect(result).toEqual([]);
  });
});

describe('transformSubject', () => {
  const rawSubject: RawSubject = {
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

  it('should transform code and name', () => {
    const result = transformSubject(rawSubject);
    expect(result.code).toBe('1320');
    expect(result.name).toBe('정보처리기사');
  });

  it('should transform category info', () => {
    const result = transformSubject(rawSubject);
    expect(result.category).toEqual({
      code: 'T',
      name: '국가기술자격',
    });
  });

  it('should transform series info', () => {
    const result = transformSubject(rawSubject);
    expect(result.series).toEqual({
      code: '01',
      name: '기사',
    });
  });

  it('should transform major job field', () => {
    const result = transformSubject(rawSubject);
    expect(result.majorJobField).toEqual({
      code: '11',
      name: '정보통신',
    });
  });

  it('should transform minor job field', () => {
    const result = transformSubject(rawSubject);
    expect(result.minorJobField).toEqual({
      code: '01',
      name: '정보기술',
    });
  });
});

describe('transformSubjects', () => {
  it('should transform array of raw subjects', () => {
    const rawSubjects: RawSubject[] = [
      {
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
      },
      {
        jmcd: '2290',
        jmfldnm: '정보처리산업기사',
        qualgbcd: 'T',
        qualgbnm: '국가기술자격',
        seriescd: '02',
        seriesnm: '산업기사',
        obligfldcd: '11',
        obligfldnm: '정보통신',
        mdobligfldcd: '01',
        mdobligfldnm: '정보기술',
      },
    ];

    const result = transformSubjects(rawSubjects);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('정보처리기사');
    expect(result[1].name).toBe('정보처리산업기사');
  });

  it('should return empty array for empty input', () => {
    const result = transformSubjects([]);
    expect(result).toEqual([]);
  });
});
