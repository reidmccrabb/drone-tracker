import { FAARemoteIDLookupRequest, FAARemoteIDLookupResponse } from '@/types/faa';

export class FAARemoteIDService {
  private cache = new Map<string, FAARemoteIDLookupResponse>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  async lookupOperator(request: FAARemoteIDLookupRequest): Promise<FAARemoteIDLookupResponse> {
    const cacheKey = request.droneRegistration || request.operatorId;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached;
    }

    try {
      const response = await fetch('/api/faa/remote-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data: FAARemoteIDLookupResponse = await response.json();

      if (data.success) {
        this.cache.set(cacheKey, data);
      }

      return data;
    } catch {
      return {
        success: false,
        verified: false,
        error: 'Network error',
        timestamp: Date.now(),
      };
    }
  }
}

let instance: FAARemoteIDService | null = null;
export function getFAARemoteIDService(): FAARemoteIDService {
  if (!instance) instance = new FAARemoteIDService();
  return instance;
}
