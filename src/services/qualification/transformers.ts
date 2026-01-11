import type { RawExamSchedule, ExamSchedule, RawSubject, Subject, ExamPeriod } from './types.js';

/**
 * YYYYMMDD → YYYY-MM-DD 변환
 */
function formatDate(yyyymmdd: string): string {
  if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd;
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

/**
 * Raw 시험일정 → 정규화된 시험일정
 */
export function transformExamSchedule(raw: RawExamSchedule): ExamSchedule {
  const writtenExam: ExamPeriod = {
    registrationStart: formatDate(raw.docRegStartDt),
    registrationEnd: formatDate(raw.docRegEndDt),
    examStart: formatDate(raw.docExamStartDt),
    examEnd: formatDate(raw.docExamEndDt),
    resultDate: formatDate(raw.docPassDt),
  };

  const practicalExam: ExamPeriod = {
    registrationStart: formatDate(raw.pracRegStartDt),
    registrationEnd: formatDate(raw.pracRegEndDt),
    examStart: formatDate(raw.pracExamStartDt),
    examEnd: formatDate(raw.pracExamEndDt),
    resultDate: formatDate(raw.pracPassDt),
  };

  return {
    year: Number(raw.implYy),
    round: raw.implSeq,
    category: {
      code: raw.qualgbCd,
      name: raw.qualgbNm,
    },
    description: raw.description,
    writtenExam,
    practicalExam,
  };
}

/**
 * Raw 시험일정 배열 → 정규화된 시험일정 배열
 */
export function transformExamSchedules(
  rawList: readonly RawExamSchedule[]
): readonly ExamSchedule[] {
  return rawList.map(transformExamSchedule);
}

/**
 * Raw 종목 → 정규화된 종목
 */
export function transformSubject(raw: RawSubject): Subject {
  return {
    code: raw.jmcd,
    name: raw.jmfldnm,
    category: {
      code: raw.qualgbcd,
      name: raw.qualgbnm,
    },
    series: {
      code: raw.seriescd,
      name: raw.seriesnm,
    },
    majorJobField: {
      code: raw.obligfldcd,
      name: raw.obligfldnm,
    },
    minorJobField: {
      code: raw.mdobligfldcd,
      name: raw.mdobligfldnm,
    },
  };
}

/**
 * Raw 종목 배열 → 정규화된 종목 배열
 */
export function transformSubjects(rawList: readonly RawSubject[]): readonly Subject[] {
  return rawList.map(transformSubject);
}
