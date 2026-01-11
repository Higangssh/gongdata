import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from '../src/core/http.js';
import { GongdataError } from '../src/core/error.js';

describe('HttpClient', () => {
  const config = {
    serviceKey: 'test-service-key',
    timeout: 5000,
    retry: { maxRetries: 2, delay: 100 },
  };

  let client: HttpClient;
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    client = new HttpClient(config);
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('getServiceKey', () => {
    it('should return the service key', () => {
      expect(client.getServiceKey()).toBe('test-service-key');
    });
  });

  describe('request', () => {
    it('should make GET request with correct URL and params', async () => {
      const mockResponse = {
        header: { resultCode: '00', resultMsg: 'NORMAL_CODE' },
        body: {
          items: [{ id: 1 }],
          pageNo: 1,
          numOfRows: 10,
          totalCount: 1,
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await client.request('https://api.example.com', {
        path: '/test',
        params: { year: 2026 },
        pageNo: 1,
        numOfRows: 10,
      });

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(calledUrl).toContain('https://api.example.com/test');
      expect(calledUrl).toContain('serviceKey=test-service-key');
      expect(calledUrl).toContain('year=2026');
      expect(calledUrl).toContain('pageNo=1');
      expect(calledUrl).toContain('numOfRows=10');
      expect(calledUrl).toContain('dataFormat=json');
    });

    it('should return data and pagination from response', async () => {
      const mockResponse = {
        header: { resultCode: '00', resultMsg: 'NORMAL_CODE' },
        body: {
          items: [{ id: 1 }, { id: 2 }],
          pageNo: 1,
          numOfRows: 10,
          totalCount: 100,
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await client.request('https://api.example.com', {
        path: '/test',
      });

      expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
      expect(result.pagination).toEqual({
        pageNo: 1,
        numOfRows: 10,
        totalCount: 100,
      });
    });

    it('should throw GongdataError on HTTP error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(
        client.request('https://api.example.com', { path: '/test' })
      ).rejects.toThrow(GongdataError);
    });

    it('should retry on failure and succeed', async () => {
      const mockResponse = {
        header: { resultCode: '00', resultMsg: 'NORMAL_CODE' },
        body: { items: [], pageNo: 1, numOfRows: 10, totalCount: 0 },
      };

      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          text: () => Promise.resolve(JSON.stringify(mockResponse)),
        });

      globalThis.fetch = mockFetch;

      const result = await client.request('https://api.example.com', {
        path: '/test',
      });

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result.data).toEqual([]);
    });

    it('should not retry on non-retryable API errors', async () => {
      const mockResponse = {
        header: { resultCode: '30', resultMsg: 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR' },
        body: { items: [], pageNo: 1, numOfRows: 10, totalCount: 0 },
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      globalThis.fetch = mockFetch;

      await expect(
        client.request('https://api.example.com', { path: '/test' })
      ).rejects.toThrow(GongdataError);

      // Should not retry for invalid service key
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('requestAll', () => {
    it('should fetch all pages automatically', async () => {
      const mockFetch = vi.fn()
        // First page
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          text: () => Promise.resolve(JSON.stringify({
            header: { resultCode: '00', resultMsg: 'NORMAL_CODE' },
            body: {
              items: [{ id: 1 }, { id: 2 }],
              pageNo: 1,
              numOfRows: 2,
              totalCount: 4,
            },
          })),
        })
        // Second page
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          text: () => Promise.resolve(JSON.stringify({
            header: { resultCode: '00', resultMsg: 'NORMAL_CODE' },
            body: {
              items: [{ id: 3 }, { id: 4 }],
              pageNo: 2,
              numOfRows: 2,
              totalCount: 4,
            },
          })),
        });

      globalThis.fetch = mockFetch;

      const result = await client.requestAll('https://api.example.com', {
        path: '/test',
      }, 2);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(4);
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    });
  });
});
