// Client
export { createClient, type GongdataClient } from './client.js';

// Core types and utilities
export {
  GongdataError,
  ResultCode,
  DataResponse,
  PaginatedResponse,
  type ResultCodeType,
  type GongdataConfig,
  type RetryConfig,
  type PaginationInfo,
} from './core/index.js';

// Qualification service
export {
  QualificationService,
  QualificationCategory,
  type QualificationCategoryType,
  JmCode,
  type JmCodeType,
  type GetSchedulesParams,
  type RawExamSchedule,
  type ExamSchedule,
  type RawSubject,
  type Subject,
  ScheduleResponse,
  AllSchedulesResponse,
  SubjectResponse,
} from './services/index.js';

// Base service for extensions
export { BaseService } from './services/base.js';
