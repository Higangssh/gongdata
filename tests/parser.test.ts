import { describe, it, expect } from 'vitest';
import {
  normalizeXmlItems,
  normalizeJsonItems,
  parseXml,
  validateResponse,
} from '../src/core/parser.js';
import { GongdataError } from '../src/index.js';
import type { XmlItemsWrapper } from '../src/core/types.js';

describe('normalizeJsonItems', () => {
  it('should return empty array for empty string', () => {
    const result = normalizeJsonItems<unknown>('');
    expect(result).toEqual([]);
  });

  it('should return array as-is', () => {
    const items = [{ id: 1 }, { id: 2 }];
    const result = normalizeJsonItems(items);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });
});

describe('normalizeXmlItems', () => {
  it('should return empty array for empty string', () => {
    const result = normalizeXmlItems<unknown>('');
    expect(result).toEqual([]);
  });

  it('should return array as-is when items.item is array', () => {
    const items: XmlItemsWrapper<{ id: number }> = {
      item: [{ id: 1 }, { id: 2 }],
    };

    const result = normalizeXmlItems(items);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should wrap single object in array', () => {
    const items: XmlItemsWrapper<{ id: number }> = {
      item: { id: 1 },
    };

    const result = normalizeXmlItems(items);
    expect(result).toEqual([{ id: 1 }]);
  });
});

describe('parseXml', () => {
  it('should parse XML to JSON', () => {
    const xml = `
      <response>
        <header>
          <resultCode>00</resultCode>
          <resultMsg>NORMAL_CODE</resultMsg>
        </header>
      </response>
    `;

    const result = parseXml<{ response: { header: { resultCode: string } } }>(xml);
    expect(result.response.header.resultCode).toBe('00');
  });
});

describe('validateResponse', () => {
  it('should not throw for success response', () => {
    const header = { resultCode: '00', resultMsg: 'NORMAL_CODE' };
    expect(() => validateResponse(header)).not.toThrow();
  });

  it('should throw GongdataError for error response', () => {
    const header = { resultCode: '30', resultMsg: 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR' };
    expect(() => validateResponse(header)).toThrow(GongdataError);
  });
});
