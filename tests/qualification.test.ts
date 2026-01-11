import { describe, it, expect } from 'vitest';
import { JmCode, QualificationCategory } from '../src/index.js';

describe('QualificationCategory', () => {
  it('should have correct category codes', () => {
    expect(QualificationCategory.NATIONAL_TECHNICAL).toBe('T');
    expect(QualificationCategory.COURSE_EVALUATION).toBe('C');
    expect(QualificationCategory.WORK_LEARNING).toBe('W');
    expect(QualificationCategory.NATIONAL_PROFESSIONAL).toBe('S');
  });
});

describe('JmCode', () => {
  it('should have correct IT qualification codes', () => {
    expect(JmCode.INFORMATION_PROCESSING_ENGINEER).toBe('1320');
    expect(JmCode.INFORMATION_PROCESSING_INDUSTRIAL_ENGINEER).toBe('2290');
    expect(JmCode.INFORMATION_MANAGEMENT_PROFESSIONAL_ENGINEER).toBe('0601');
  });

  it('should have correct electrical qualification codes', () => {
    expect(JmCode.ELECTRICAL_ENGINEER).toBe('1150');
    expect(JmCode.ELECTRICAL_TECHNICIAN).toBe('7780');
    expect(JmCode.ELECTRICAL_CONSTRUCTION_ENGINEER).toBe('1160');
  });

  it('should have correct culinary qualification codes', () => {
    expect(JmCode.KOREAN_CUISINE_TECHNICIAN).toBe('7910');
    expect(JmCode.WESTERN_CUISINE_TECHNICIAN).toBe('7911');
  });

  it('should be readonly (as const)', () => {
    // TypeScript로 readonly 보장하므로 런타임 테스트는 값 확인만
    expect(typeof JmCode.INFORMATION_PROCESSING_ENGINEER).toBe('string');
  });
});
