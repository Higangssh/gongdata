# gongdata

TypeScript SDK for Korea Public Data Portal (data.go.kr) APIs

## What You Can Do

| API | Description | Status |
|-----|-------------|--------|
| Exam Schedules | Query national qualification exam schedules (Engineer Information Processing, Electrical Engineer, etc.) | ✅ Supported |
| Subject List | Query all national qualification subject codes | ✅ Supported |

## Prerequisites

You need a **Service Key** to use this SDK.

1. Sign up at [data.go.kr](https://www.data.go.kr)
2. Apply for [Qualification Exam Schedule API](https://www.data.go.kr/data/15074408/openapi.do)
3. After approval, copy the **Decoding Key** from My Page

## Installation

```bash
npm install gongdata
```

## Quick Start

```typescript
import { createClient } from 'gongdata';

// 1. Create client
const client = createClient({
  serviceKey: 'YOUR_SERVICE_KEY', // Your decoding key
});

// 2. Get 2026 exam schedules
const result = await client.qualification.getSchedules({ year: 2026 });

// 3. Use the result
console.log(result.data[0].writtenExam.registrationStart); // '2026-01-24'
```

### Using Environment Variables (Recommended)

```bash
# .env
DATA_GO_KR_SERVICE_KEY=your_service_key_here
```

```typescript
import 'dotenv/config';
import { createClient } from 'gongdata';

const client = createClient({
  serviceKey: process.env.DATA_GO_KR_SERVICE_KEY!,
});
```

---

## API Reference

### createClient(config)

Creates an SDK client.

```typescript
const client = createClient({
  serviceKey: string,      // Required: data.go.kr service key
  timeout?: number,        // Optional: timeout in ms (default: 10000)
  retry?: {
    maxRetries: number,    // Optional: max retry count (default: 3)
    delay: number,         // Optional: retry delay in ms (default: 1000)
  },
});
```

---

### client.qualification.getSchedules(params, options?)

Get exam schedules (single page).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| params.year | number | ✅ | Exam year (e.g., 2026) |
| params.category | string | - | Category code (T/C/W/S) |
| params.jmCode | string | - | Subject code (e.g., '1320') |
| options.pageNo | number | - | Page number (default: 1) |
| options.numOfRows | number | - | Items per page (default: 10) |

**Examples:**

```typescript
// Basic query
const result = await client.qualification.getSchedules({ year: 2026 });

// Query specific subject (Engineer Information Processing)
const result = await client.qualification.getSchedules({
  year: 2026,
  jmCode: '1320',
});

// Query only National Technical Qualifications
const result = await client.qualification.getSchedules({
  year: 2026,
  category: 'T',
});
```

**Returns:**

```typescript
result.data          // ExamSchedule[] - Normalized data
result.rawData       // RawExamSchedule[] - Original API data
result.pagination    // { pageNo, numOfRows, totalCount }
result.hasNextPage() // Whether next page exists
result.count()       // Current page item count
```

---

### client.qualification.getAllSchedules(params)

Get all exam schedules (auto-fetches all pages).

```typescript
const result = await client.qualification.getAllSchedules({ year: 2026 });

result.data    // ExamSchedule[] - All data
result.count() // Total count
```

---

### client.qualification.getSubjects()

Get all national qualification subjects.

```typescript
const result = await client.qualification.getSubjects();

result.data                         // Subject[] - All subjects
result.findByCode('1320')           // Find by subject code
result.findByName('정보처리기사')    // Find by subject name
result.filterByCategory('T')        // Filter by category
```

---

## Data Types

### ExamSchedule

Normalized data accessed via `result.data`.

```typescript
interface ExamSchedule {
  year: number;              // Exam year (e.g., 2026)
  round: number;             // Round number (e.g., 1, 2, 3)
  category: {
    code: string;            // 'T' | 'C' | 'W' | 'S'
    name: string;            // Category name in Korean
  };
  description: string;       // Exam description
  writtenExam: ExamPeriod;   // Written exam schedule
  practicalExam: ExamPeriod; // Practical exam schedule
}

interface ExamPeriod {
  registrationStart: string; // Registration start 'YYYY-MM-DD'
  registrationEnd: string;   // Registration end
  examStart: string;         // Exam start date
  examEnd: string;           // Exam end date
  resultDate: string;        // Result announcement date
}
```

### RawExamSchedule

Original API data accessed via `result.rawData`.

```typescript
interface RawExamSchedule {
  implYy: string;         // '2026'
  implSeq: number;        // 1
  qualgbCd: string;       // 'T'
  qualgbNm: string;       // '국가기술자격'
  description: string;
  docRegStartDt: string;  // '20260124' (YYYYMMDD format)
  docRegEndDt: string;
  docExamStartDt: string;
  docExamEndDt: string;
  docPassDt: string;
  pracRegStartDt: string;
  pracRegEndDt: string;
  pracExamStartDt: string;
  pracExamEndDt: string;
  pracPassDt: string;
}
```

### Subject

```typescript
interface Subject {
  code: string;              // '1320'
  name: string;              // '정보처리기사'
  category: { code: string; name: string };
  series: { code: string; name: string };        // Engineer/Technician/etc.
  majorJobField: { code: string; name: string }; // Major job field
  minorJobField: { code: string; name: string }; // Minor job field
}
```

---

## Constants

### QualificationCategory

```typescript
import { QualificationCategory } from 'gongdata';

QualificationCategory.NATIONAL_TECHNICAL    // 'T' - National Technical
QualificationCategory.COURSE_EVALUATION     // 'C' - Course Evaluation
QualificationCategory.WORK_LEARNING         // 'W' - Work-Learning Dual
QualificationCategory.NATIONAL_PROFESSIONAL // 'S' - National Professional
```

### JmCode (Common Subject Codes)

Frequently used subject codes. Use `getSubjects()` for the complete list.

```typescript
import { JmCode } from 'gongdata';

// IT
JmCode.INFORMATION_PROCESSING_ENGINEER            // '1320'
JmCode.INFORMATION_PROCESSING_INDUSTRIAL_ENGINEER // '2290'

// Electrical
JmCode.ELECTRICAL_ENGINEER   // '1150'
JmCode.ELECTRICAL_TECHNICIAN // '7780'

// Culinary
JmCode.KOREAN_CUISINE_TECHNICIAN  // '7910'
JmCode.WESTERN_CUISINE_TECHNICIAN // '7911'
```

---

## Error Handling

```typescript
import { GongdataError, ResultCode } from 'gongdata';

try {
  const result = await client.qualification.getSchedules({ year: 2026 });
} catch (error) {
  if (GongdataError.isGongdataError(error)) {
    console.log(error.code);    // Error code
    console.log(error.message); // Error message

    // Handle specific errors
    if (error.code === ResultCode.UNREGISTERED_SERVICE_KEY) {
      console.log('Please check your service key');
    }
  }
}
```

### ResultCode

| Code | Constant | Description |
|------|----------|-------------|
| 00 | SUCCESS | Success |
| 1 | APPLICATION_ERROR | Application error |
| 22 | REQUEST_LIMIT_EXCEEDED | Request limit exceeded |
| 30 | UNREGISTERED_SERVICE_KEY | Unregistered service key |
| 31 | EXPIRED_SERVICE_KEY | Expired service key |

---

## Features

| Feature | Description |
|---------|-------------|
| Type Safety | Full TypeScript types for all API responses |
| Dual Data Access | `data` (normalized) + `rawData` (original) |
| Auto Pagination | `getAllSchedules()` fetches all pages automatically |
| Auto Retry | Automatic retry on network failures |
| Date Normalization | `20260124` → `2026-01-24` auto conversion |

---

## License

MIT

## Contributing

Issues and PRs are welcome.

- [GitHub Issues](https://github.com/Higangssh/gongdata/issues)
