import { z } from 'zod';

export const chainSchema = z.string().describe(
  "Chain name as listed on DeFi Llama (e.g., 'Ethereum', 'Solana', 'MANTRA', 'Arbitrum', 'Base'). Use get_chains to see all available chains."
);

export const protocolSchema = z.string().describe(
  "Protocol slug as listed on DeFi Llama (e.g., 'aave', 'uniswap', 'lido', 'fluxtra'). Use get_protocols to find slugs."
);

export const coinsSchema = z.string().describe(
  "Comma-separated coin identifiers in format {chain}:{address} or coingecko:{id}. Examples: 'ethereum:0xdAC17F958D2ee523a2206206994597C13D831ec7', 'coingecko:mantra', 'coingecko:ethereum'."
);

export const timestampSchema = z.number().describe(
  "Unix timestamp in seconds (e.g., 1704067200 for Jan 1 2024)."
);

export function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function errorResult(error: unknown) {
  return {
    content: [{ type: "text" as const, text: `Error: ${formatError(error)}` }],
    isError: true,
  };
}

export function infoResult(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
  };
}

/** Find similar slugs using fuzzy substring matching. */
export function findSimilarSlugs(
  slug: string,
  allItems: any[],
  slugField: string = 'project',
  maxSuggestions: number = 5,
): string[] {
  const needle = slug.toLowerCase();
  const similar = new Set<string>();
  for (const item of allItems) {
    const s = item[slugField]?.toLowerCase();
    if (s && s !== needle && (s.startsWith(needle) || needle.startsWith(s) || s.includes(needle))) {
      similar.add(item[slugField]);
    }
    if (similar.size >= maxSuggestions) break;
  }
  return [...similar];
}

/** Flatten GeckoTerminal JSON:API response into clean objects. */
export function flattenGeckoItem(item: any): any {
  if (!item) return item;
  const flat: any = { id: item.id, ...item.attributes };
  if (item.relationships) {
    for (const [key, rel] of Object.entries(item.relationships) as [string, any][]) {
      if (rel?.data?.id) {
        flat[`${key}_id`] = rel.data.id;
      }
    }
  }
  return flat;
}

export function flattenGeckoResponse(data: any): any {
  if (!data) return data;
  if (Array.isArray(data.data)) {
    const items = data.data.map(flattenGeckoItem);
    // Include sideloaded related objects if present
    if (Array.isArray(data.included)) {
      const included: Record<string, any> = {};
      for (const inc of data.included) {
        included[inc.id] = flattenGeckoItem(inc);
      }
      // Attach resolved token data to pool items
      for (const item of items) {
        for (const key of Object.keys(item)) {
          if (key.endsWith('_id') && included[item[key]]) {
            const resolvedKey = key.replace(/_id$/, '');
            item[resolvedKey] = included[item[key]];
          }
        }
      }
    }
    return items;
  }
  if (data.data && typeof data.data === 'object') {
    const item = flattenGeckoItem(data.data);
    if (Array.isArray(data.included)) {
      const included: Record<string, any> = {};
      for (const inc of data.included) {
        included[inc.id] = flattenGeckoItem(inc);
      }
      for (const key of Object.keys(item)) {
        if (key.endsWith('_id') && included[item[key]]) {
          const resolvedKey = key.replace(/_id$/, '');
          item[resolvedKey] = included[item[key]];
        }
      }
    }
    return item;
  }
  return data;
}
