import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GeckoTerminalClient } from '../gecko-terminal-client.js';
import { ApiError } from '../defillama-client.js';
import { jsonResult, errorResult, infoResult, flattenGeckoResponse } from './schemas.js';
import { z } from 'zod';

const DEFAULT_NETWORK = 'mantra-evm';

const networkSchema = z.string().optional().default(DEFAULT_NETWORK).describe(
  "GeckoTerminal network slug (e.g., 'mantra-evm', 'eth', 'base'). Defaults to 'mantra-evm'."
);

export function registerGeckoTerminalTools(server: McpServer, client: GeckoTerminalClient) {

  server.tool(
    "gt_get_pools",
    "Get DEX pools on a network from GeckoTerminal with volume, TVL, fees, and transaction data. " +
    "Covers EVM-based DEXes only (e.g., QuickSwap V4). CosmWasm-based pools (e.g., native MANTRA DEX) " +
    "are not indexed by GeckoTerminal — for CosmWasm pool data, use the MANTRA Chain MCP tools " +
    "dex-get-pools and dex-simulate-swap. Defaults to MANTRA EVM. " +
    "Use this when DeFi Llama's get_dex_volumes has no data for a chain.",
    {
      network: networkSchema,
      sort: z.enum(['h24_volume_usd_desc', 'h24_tx_count_desc'])
        .optional().default('h24_volume_usd_desc')
        .describe("Sort pools by: 24h volume (default) or 24h transaction count."),
      page: z.number().optional().default(1).describe("Page number for pagination (default: 1)."),
    },
    async ({ network, sort, page }) => {
      try {
        const data = await client.get(
          `/networks/${encodeURIComponent(network)}/pools?sort=${sort}&page=${page}&include=base_token,quote_token`
        );
        const pools = flattenGeckoResponse(data);
        if (Array.isArray(pools) && pools.length === 0) {
          return infoResult(
            `No DEX pools found on network "${network}" in GeckoTerminal. ` +
            `The network slug may be incorrect, or this network may not be indexed yet.`
          );
        }
        return jsonResult(pools);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return infoResult(
            `Network "${network}" was not found on GeckoTerminal. ` +
            `Check the network slug — for MANTRA, use "mantra-evm".`
          );
        }
        return errorResult(error);
      }
    }
  );

  server.tool(
    "gt_get_pool_detail",
    "Get detailed info for a specific DEX pool from GeckoTerminal including volume, TVL, fee tier, " +
    "token prices, and transaction counts across multiple timeframes (5m, 15m, 30m, 1h, 6h, 24h).",
    {
      network: networkSchema,
      pool_address: z.string().describe("The pool contract address (e.g., '0x2d88...1f0f')."),
    },
    async ({ network, pool_address }) => {
      try {
        const data = await client.get(
          `/networks/${encodeURIComponent(network)}/pools/${encodeURIComponent(pool_address)}?include=base_token,quote_token`
        );
        return jsonResult(flattenGeckoResponse(data));
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return infoResult(
            `Pool "${pool_address}" was not found on network "${network}" in GeckoTerminal. ` +
            `Check the pool address and network slug. Use gt_get_pools or gt_search_pools to find pools.`
          );
        }
        return errorResult(error);
      }
    }
  );

  server.tool(
    "gt_get_pool_trades",
    "Get the latest trades for a specific DEX pool from GeckoTerminal. Returns up to 300 trades from the last 24 hours.",
    {
      network: networkSchema,
      pool_address: z.string().describe("The pool contract address."),
    },
    async ({ network, pool_address }) => {
      try {
        const data = await client.get(
          `/networks/${encodeURIComponent(network)}/pools/${encodeURIComponent(pool_address)}/trades`
        );
        return jsonResult(flattenGeckoResponse(data));
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return infoResult(
            `Pool "${pool_address}" was not found on network "${network}" in GeckoTerminal. ` +
            `Use gt_get_pools or gt_search_pools to find valid pool addresses.`
          );
        }
        return errorResult(error);
      }
    }
  );

  server.tool(
    "gt_get_pool_ohlcv",
    "Get OHLCV (candlestick) price data for a DEX pool from GeckoTerminal. " +
    "Supports up to 6 months of history. Returns arrays of [timestamp, open, high, low, close, volume_usd].",
    {
      network: networkSchema,
      pool_address: z.string().describe("The pool contract address."),
      timeframe: z.enum(['day', 'hour', 'minute']).optional().default('day')
        .describe("Candle timeframe: 'day', 'hour', or 'minute'."),
      aggregate: z.number().optional()
        .describe("Aggregation multiplier. For day: 1. For hour: 1, 4, or 12. For minute: 1, 5, or 15."),
      limit: z.number().optional().default(100)
        .describe("Number of candles to return (default: 100, max: 1000)."),
      before_timestamp: z.number().optional()
        .describe("Unix timestamp in seconds — fetch candles before this time. For pagination through history."),
      currency: z.enum(['usd', 'token']).optional().default('usd')
        .describe("Price currency: 'usd' (default) or 'token' (quote token)."),
    },
    async ({ network, pool_address, timeframe, aggregate, limit, before_timestamp, currency }) => {
      try {
        const params = new URLSearchParams();
        if (aggregate) params.set('aggregate', String(aggregate));
        if (limit) params.set('limit', String(limit));
        if (before_timestamp) params.set('before_timestamp', String(before_timestamp));
        if (currency) params.set('currency', currency);
        const qs = params.toString();
        const path = `/networks/${encodeURIComponent(network)}/pools/${encodeURIComponent(pool_address)}/ohlcv/${timeframe}${qs ? `?${qs}` : ''}`;
        const data = await client.get(path);
        // OHLCV has a different structure — return attributes directly with meta
        const result: any = {};
        if (data?.data?.attributes?.ohlcv_list) {
          result.ohlcv = data.data.attributes.ohlcv_list;
        }
        if (data?.meta) {
          result.base_token = data.meta.base;
          result.quote_token = data.meta.quote;
        }
        return jsonResult(result);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return infoResult(
            `Pool "${pool_address}" was not found on network "${network}" in GeckoTerminal. ` +
            `Use gt_get_pools or gt_search_pools to find valid pool addresses.`
          );
        }
        return errorResult(error);
      }
    }
  );

  server.tool(
    "gt_get_token",
    "Get token data from GeckoTerminal including price, total liquidity across all pools, and 24h volume. " +
    "Also returns the token's top pools.",
    {
      network: networkSchema,
      token_address: z.string().describe(
        "The token contract address (e.g., '0xe3047710ef6cb36bcf1e58145529778ea7cb5598' for wMANTRA)."
      ),
    },
    async ({ network, token_address }) => {
      try {
        const data = await client.get(
          `/networks/${encodeURIComponent(network)}/tokens/${encodeURIComponent(token_address)}?include=top_pools`
        );
        return jsonResult(flattenGeckoResponse(data));
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return infoResult(
            `Token "${token_address}" was not found on network "${network}" in GeckoTerminal. ` +
            `Check the token address and network slug. Use gt_search_pools to search by token name or symbol.`
          );
        }
        return errorResult(error);
      }
    }
  );

  server.tool(
    "gt_search_pools",
    "Search for DEX pools on GeckoTerminal by token name, symbol, or address. " +
    "Can search across all networks or filter to a specific one.",
    {
      query: z.string().describe("Search term — token name, symbol, or address (e.g., 'MANTRA', 'wMANTRA', 'USDC')."),
      network: z.string().optional().describe(
        "Optional: filter search to a specific network (e.g., 'mantra-evm'). Omit to search all networks."
      ),
    },
    async ({ query, network }) => {
      try {
        const params = new URLSearchParams({ query });
        if (network) params.set('network', network);
        const data = await client.get(`/search/pools?${params.toString()}`);
        const pools = flattenGeckoResponse(data);
        if (Array.isArray(pools) && pools.length === 0) {
          return infoResult(
            `No pools found matching "${query}"${network ? ` on network "${network}"` : ''}. ` +
            `Try a different search term, or omit the network filter to search all networks.`
          );
        }
        return jsonResult(pools);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
