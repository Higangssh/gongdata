import { describe, it, expect } from 'vitest';
import { GongdataError, ResultCode } from '../src/index.js';

describe('GongdataError', () => {
  it('should create error with code and message', () => {
    const error = new GongdataError(ResultCode.UNKNOWN_ERROR, '기타 에러 발생');

    expect(error.code).toBe('99');
    expect(error.message).toBe('기타 에러 발생');
    expect(error.name).toBe('GongdataError');
  });

  it('should use default message when not provided', () => {
    const error = new GongdataError(ResultCode.UNREGISTERED_SERVICE_KEY);

    expect(error.code).toBe('30');
    expect(error.message).toBe('등록되지 않은 서비스키');
  });

  it('should handle unknown error codes', () => {
    const error = new GongdataError('999', undefined);

    expect(error.code).toBe('999');
    expect(error.message).toBe('Unknown error: 999');
  });

  it('should store original response', () => {
    const originalResponse = { header: { resultCode: '1' } };
    const error = new GongdataError(ResultCode.APPLICATION_ERROR, '에러', originalResponse);

    expect(error.originalResponse).toEqual(originalResponse);
  });

  it('isGongdataError should return true for GongdataError', () => {
    const error = new GongdataError(ResultCode.SUCCESS);

    expect(GongdataError.isGongdataError(error)).toBe(true);
  });

  it('isGongdataError should return false for regular Error', () => {
    const error = new Error('regular error');

    expect(GongdataError.isGongdataError(error)).toBe(false);
  });

  it('fromResponse should create error from header', () => {
    const header = { resultCode: '30', resultMsg: 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR' };
    const error = GongdataError.fromResponse(header);

    expect(error.code).toBe('30');
    expect(error.message).toBe('SERVICE_KEY_IS_NOT_REGISTERED_ERROR');
  });
});

describe('ResultCode', () => {
  it('should have correct common error codes', () => {
    expect(ResultCode.SUCCESS).toBe('00');
    expect(ResultCode.APPLICATION_ERROR).toBe('1');
    expect(ResultCode.UNREGISTERED_SERVICE_KEY).toBe('30');
    expect(ResultCode.REQUEST_LIMIT_EXCEEDED).toBe('22');
  });

  it('should have HRDK specific error codes', () => {
    expect(ResultCode.GATEWAY_AUTH_ERROR).toBe('900');
    expect(ResultCode.MISSING_REQUIRED_PARAMETER).toBe('910');
    expect(ResultCode.INVALID_DATA_FORMAT).toBe('920');
    expect(ResultCode.HRDK_SERVER_ERROR).toBe('990');
  });
});
