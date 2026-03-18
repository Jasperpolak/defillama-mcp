export const BASE_URLS = {
  main: 'https://api.llama.fi',
  coins: 'https://coins.llama.fi',
  stablecoins: 'https://stablecoins.llama.fi',
  yields: 'https://yields.llama.fi',
} as const;

export type ApiSection = keyof typeof BASE_URLS;
