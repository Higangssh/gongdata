# gongdata

TypeScript SDK for Korea Public Data Portal (data.go.kr) APIs

## Installation

```bash
npm install gongdata
# or
pnpm add gongdata
```

## Quick Start

```typescript
import { createClient } from 'gongdata';

const client = createClient({
  serviceKey: process.env.DATA_GO_KR_SERVICE_KEY,
});

// Get 2026 qualification exam schedules
const result = await client.qualification.getSchedules({ year: 2026 });

// Normalized data (SDK guaranteed interface)
console.log(result.data[0].writtenExam.registrationStart); // '2026-01-24'

// Raw data (original API response)
console.log(result.rawData[0].docRegStartDt); // '20260124'
```

## Features

| Feature | Description |
|---------|-------------|
| Type Safety | Full TypeScript types for all API responses |
| Dual Data Access | `data` (normalized) + `rawData` (original) |
| Auto Pagination | `getAllSchedules()` fetches all pages automatically |
| Error Handling | Unified `GongdataError` for all API error codes |
| Retry Logic | Automatic retry on network failures |

## API Reference

### createClient(config)

```typescript
const client = createClient({
  serviceKey: string,      // Required: data.go.kr service key
  timeout?: number,        // Optional: timeout in ms (default: 10000)
  retry?: {
    maxRetries: number,    // Optional: max retries (default: 3)
    delay: number,         // Optional: retry delay in ms (default: 1000)
  },
});
```

### client.qualification

Qualification exam schedule service

#### getSchedules(params, options?)

Get exam schedules (single page)

```typescript
const result = await client.qualification.getSchedules(
  {
    year: 2026,                                    // Required: exam year
    category: QualificationCategory.NATIONAL_TECHNICAL,  // Optional
    jmCode: JmCode.INFORMATION_PROCESSING_ENGINEER,      // Optional
  },
  { pageNo: 1, numOfRows: 10 }  // Optional: pagination
);

// Returns: ScheduleResponse
result.data;        // ExamSchedule[] - normalized data
result.rawData;     // RawExamSchedule[] - original data
result.pagination;  // { pageNo, numOfRows, totalCount }
result.hasNextPage();
```

#### getAllSchedules(params)

Get all exam schedules (auto pagination)

```typescript
const result = await client.qualification.getAllSchedules({ year: 2026 });

// Returns: AllSchedulesResponse
result.data;    // ExamSchedule[] - all data
result.count(); // total count
```

#### getSubjects()

Get all qualification subject codes

```typescript
const result = await client.qualification.getSubjects();

// Returns: SubjectResponse
result.data;                        // Subject[]
result.findByCode('1320');          // find by code
result.findByName('정보처리기사');    // find by name
result.filterByCategory('T');       // filter by category
```

## Type Definitions

### ExamSchedule (Normalized)

```typescript
interface ExamSchedule {
  year: number;              // exam year
  round: number;             // round number
  category: {
    code: string;            // 'T' | 'C' | 'W' | 'S'
    name: string;            // category name in Korean
  };
  description: string;       // schedule description
  writtenExam: ExamPeriod;   // written exam period
  practicalExam: ExamPeriod; // practical exam period
}

interface ExamPeriod {
  registrationStart: string; // 'YYYY-MM-DD'
  registrationEnd: string;
  examStart: string;
  examEnd: string;
  resultDate: string;
}
```

### Subject (Normalized)

```typescript
interface Subject {
  code: string;              // '1320'
  name: string;              // '정보처리기사'
  category: { code: string; name: string };
  series: { code: string; name: string };
  majorJobField: { code: string; name: string };
  minorJobField: { code: string; name: string };
}
```

## Constants

### QualificationCategory

```typescript
import { QualificationCategory } from 'gongdata';

QualificationCategory.NATIONAL_TECHNICAL;    // 'T' - National Technical
QualificationCategory.COURSE_EVALUATION;     // 'C' - Course Evaluation
QualificationCategory.WORK_LEARNING;         // 'W' - Work-Learning Dual
QualificationCategory.NATIONAL_PROFESSIONAL; // 'S' - National Professional
```

### JmCode (Subject Codes)

```typescript
import { JmCode } from 'gongdata';

// IT
JmCode.INFORMATION_PROCESSING_ENGINEER;           // '1320'
JmCode.INFORMATION_PROCESSING_INDUSTRIAL_ENGINEER; // '2290'

// Electrical
JmCode.ELECTRICAL_ENGINEER;   // '1150'
JmCode.ELECTRICAL_TECHNICIAN; // '7780'

// Culinary
JmCode.KOREAN_CUISINE_TECHNICIAN;  // '7910'
JmCode.WESTERN_CUISINE_TECHNICIAN; // '7911'
```

## Error Handling

```typescript
import { GongdataError, ResultCode } from 'gongdata';

try {
  const result = await client.qualification.getSchedules({ year: 2026 });
} catch (error) {
  if (GongdataError.isGongdataError(error)) {
    console.log(error.code);    // '30'
    console.log(error.message); // 'Unregistered service key'

    if (error.code === ResultCode.UNREGISTERED_SERVICE_KEY) {
      // Handle invalid service key
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

## Environment Setup

```bash
# .env
DATA_GO_KR_SERVICE_KEY=your_service_key_here
```

```typescript
import 'dotenv/config';

const client = createClient({
  serviceKey: process.env.DATA_GO_KR_SERVICE_KEY!,
});
```

## Getting a Service Key

1. Sign up at [data.go.kr](https://www.data.go.kr)
2. Apply for [Qualification Exam Schedule API](https://www.data.go.kr/data/15074408/openapi.do)
3. Copy the **Decoding Key** from My Page

## License

MIT

## Contributing

Issues and PRs are welcome.

- [GitHub Issues](https://github.com/Higangssh/gongdata/issues)
