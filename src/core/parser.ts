import { XMLParser } from 'fast-xml-parser';
import type { DataGoKrResponse, DataGoKrXmlResponse, XmlItemsWrapper } from './types.js';
import { ResultCode, GongdataError } from './error.js';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: false, // '00' 같은 값을 숫자로 변환하지 않음
  trimValues: true,
});

/**
 * XML 문자열을 JSON으로 파싱
 */
export function parseXml<T>(xml: string): T {
  return xmlParser.parse(xml) as T;
}

/**
 * API 응답이 JSON인지 확인
 */
export function isJsonResponse(contentType: string | null): boolean {
  return contentType?.includes('application/json') ?? false;
}

/**
 * API 응답이 XML인지 확인
 */
export function isXmlResponse(contentType: string | null): boolean {
  return contentType?.includes('application/xml') ?? contentType?.includes('text/xml') ?? false;
}

/**
 * 응답 헤더 검증 및 에러 처리
 */
export function validateResponse(header: { resultCode: string; resultMsg: string }): void {
  const { resultCode, resultMsg } = header;

  if (resultCode !== ResultCode.SUCCESS) {
    throw GongdataError.fromResponse({ resultCode, resultMsg });
  }
}

/**
 * XML items.item을 배열로 정규화
 */
export function normalizeXmlItems<T>(items: XmlItemsWrapper<T> | ''): readonly T[] {
  if (items === '' || items === null || items === undefined) {
    return [];
  }

  const { item } = items;

  if (item === null || item === undefined) {
    return [];
  }

  if (Array.isArray(item)) {
    return item as readonly T[];
  }

  return [item as T];
}

/**
 * JSON items를 배열로 정규화
 */
export function normalizeJsonItems<T>(items: readonly T[] | ''): readonly T[] {
  if (items === '' || items === null || items === undefined) {
    return [];
  }

  if (Array.isArray(items)) {
    return items;
  }

  return [];
}

/**
 * API 응답을 파싱하고 정규화된 데이터 반환
 */
export function parseResponse<T>(
  data: unknown,
  contentType: string | null
): {
  header: { resultCode: string; resultMsg: string };
  body: { items: readonly T[]; numOfRows: number; pageNo: number; totalCount: number };
} {
  if (typeof data === 'string') {
    if (isXmlResponse(contentType)) {
      // XML 응답 처리
      const parsed = parseXml<DataGoKrXmlResponse<T>>(data);
      validateResponse(parsed.response.header);

      return {
        header: parsed.response.header,
        body: {
          items: normalizeXmlItems(parsed.response.body.items),
          numOfRows: Number(parsed.response.body.numOfRows),
          pageNo: Number(parsed.response.body.pageNo),
          totalCount: Number(parsed.response.body.totalCount),
        },
      };
    } else {
      // JSON 문자열 처리
      const parsed = JSON.parse(data) as DataGoKrResponse<T>;
      validateResponse(parsed.header);

      return {
        header: parsed.header,
        body: {
          items: normalizeJsonItems(parsed.body.items),
          numOfRows: parsed.body.numOfRows,
          pageNo: parsed.body.pageNo,
          totalCount: parsed.body.totalCount,
        },
      };
    }
  } else {
    // 이미 파싱된 JSON 객체
    const parsed = data as DataGoKrResponse<T>;
    validateResponse(parsed.header);

    return {
      header: parsed.header,
      body: {
        items: normalizeJsonItems(parsed.body.items),
        numOfRows: parsed.body.numOfRows,
        pageNo: parsed.body.pageNo,
        totalCount: parsed.body.totalCount,
      },
    };
  }
}
