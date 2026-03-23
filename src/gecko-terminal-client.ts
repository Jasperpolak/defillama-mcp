import { ApiError } from './defillama-client.js';

const BASE_URL = 'https://api.geckoterminal.com/api/v2';

export class GeckoTerminalClient {
  async get(path: string): Promise<any> {
    const url = `${BASE_URL}${path}`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      if (res.status === 429) {
        throw new ApiError(429,
          'GeckoTerminal rate limit reached (30 requests/minute on free tier). Wait a few seconds and try again.'
        );
      }
      console.error(`GeckoTerminal API error ${res.status} for ${url}`);
      throw new ApiError(res.status, `GeckoTerminal API returned status ${res.status}`);
    }
    try {
      return await res.json();
    } catch {
      console.error(`GeckoTerminal API returned non-JSON response for ${url}`);
      throw new Error('GeckoTerminal API returned an invalid response');
    }
  }
}
