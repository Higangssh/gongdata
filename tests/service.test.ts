import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QualificationService } from '../src/services/qualification/service.js';
import { ScheduleResponse, AllSchedulesResponse } from '../src/services/qualification/response.js';
import type { HttpClient } from '../src/core/http.js';

// Mock HttpClient
const createMockHttpClient = () => ({
  getServiceKey: vi.fn().mockReturnValue('test-key'),
  request: vi.fn(),
  requestAll: vi.fn(),
});

describe('QualificationService', () => {
  let mockHttp: ReturnType<typeof createMockHttpClient>;
  let service: QualificationService;

  const mockRawSchedule = {
    implYy: '2026',
    implSeq: 1,
    qualgbCd: 'T',
    qualgbNm: '국가기술자격',
    description: '2026년 제1회',
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

  beforeEach(() => {
    mockHttp = createMockHttpClient();
    service = new QualificationService(mockHttp as unknown as HttpClient);
  });

  describe('getSchedules', () => {
    it('should call http.request with correct params', async () => {
      mockHttp.request.mockResolvedValueOnce({
        data: [mockRawSchedule],
        pagination: { pageNo: 1, numOfRows: 10, totalCount: 1 },
      });

      await service.getSchedules({ year: 2026 });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'http://apis.data.go.kr/B490007/qualExamSchd',
        expect.objectContaining({
          path: '/getQualExamSchdList',
          params: expect.objectContaining({ implYy: 2026 }),
        })
      );
    });

    it('should return ScheduleResponse', async () => {
      mockHttp.request.mockResolvedValueOnce({
        data: [mockRawSchedule],
        pagination: { pageNo: 1, numOfRows: 10, totalCount: 1 },
      });

      const result = await service.getSchedules({ year: 2026 });

      expect(result).toBeInstanceOf(ScheduleResponse);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].year).toBe(2026);
    });

    it('should transform raw data correctly', async () => {
      mockHttp.request.mockResolvedValueOnce({
        data: [mockRawSchedule],
        pagination: { pageNo: 1, numOfRows: 10, totalCount: 1 },
      });

      const result = await service.getSchedules({ year: 2026 });

      // Check normalized data
      expect(result.data[0].writtenExam.registrationStart).toBe('2026-01-24');
      // Check raw data preserved
      expect(result.rawData[0].docRegStartDt).toBe('20260124');
    });

    it('should pass optional params correctly', async () => {
      mockHttp.request.mockResolvedValueOnce({
        data: [],
        pagination: { pageNo: 1, numOfRows: 5, totalCount: 0 },
      });

      await service.getSchedules(
        { year: 2026, category: 'T', jmCode: '1320' },
        { pageNo: 2, numOfRows: 5 }
      );

      expect(mockHttp.request).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { implYy: 2026, qualgbCd: 'T', jmCd: '1320' },
          pageNo: 2,
          numOfRows: 5,
        })
      );
    });
  });

  describe('getAllSchedules', () => {
    it('should call http.requestAll', async () => {
      mockHttp.requestAll.mockResolvedValueOnce([mockRawSchedule]);

      await service.getAllSchedules({ year: 2026 });

      expect(mockHttp.requestAll).toHaveBeenCalledWith(
        'http://apis.data.go.kr/B490007/qualExamSchd',
        expect.objectContaining({
          path: '/getQualExamSchdList',
          params: { implYy: 2026, qualgbCd: undefined, jmCd: undefined },
        }),
        undefined
      );
    });

    it('should return AllSchedulesResponse', async () => {
      mockHttp.requestAll.mockResolvedValueOnce([mockRawSchedule, mockRawSchedule]);

      const result = await service.getAllSchedules({ year: 2026 });

      expect(result).toBeInstanceOf(AllSchedulesResponse);
      expect(result.data).toHaveLength(2);
    });
  });
});
