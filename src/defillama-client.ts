import { BASE_URLS, ApiSection } from './config.js';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class DefiLlamaClient {
  async get(section: ApiSection, path: string): Promise<any> {
    const url = `${BASE_URLS[section]}${path}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`DeFi Llama API error ${res.status} for ${url}`);
      throw new ApiError(res.status, `DeFi Llama API returned status ${res.status}`);
    }
    try {
      return await res.json();
    } catch {
      console.error(`DeFi Llama API returned non-JSON response for ${url}`);
      throw new Error('DeFi Llama API returned an invalid response');
    }
  }
}
