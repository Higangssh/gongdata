import { describe, it, expect } from 'vitest';
import { createClient, QualificationService } from '../src/index.js';

describe('createClient', () => {
  it('should create client with qualification service', () => {
    const client = createClient({
      serviceKey: 'test-key',
    });

    expect(client.qualification).toBeInstanceOf(QualificationService);
  });

  it('should accept optional config', () => {
    const client = createClient({
      serviceKey: 'test-key',
      timeout: 5000,
      retry: {
        maxRetries: 5,
        delay: 2000,
      },
    });

    expect(client.qualification).toBeInstanceOf(QualificationService);
  });
});
