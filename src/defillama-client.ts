import { BASE_URLS, ApiSection } from './config.js';

export class DefiLlamaClient {
  async get(section: ApiSection, path: string): Promise<any> {
    const url = `${BASE_URLS[section]}${path}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`DeFi Llama API error ${res.status} for ${url}`);
      throw new Error(`DeFi Llama API returned ${res.status} for ${path}`);
    }
    return res.json();
  }
}
