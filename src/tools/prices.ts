import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient } from '../defillama-client.js';
import { coinsSchema, timestampSchema, jsonResult, errorResult, infoResult } from './schemas.js';
import { z } from 'zod';

export function registerPriceTools(server: McpServer, client: DefiLlamaClient) {

  server.tool(
    "get_token_prices",
    "Get current prices for one or more tokens. Coins use format {chain}:{address} or coingecko:{id}, comma-separated.",
    {
      coins: coinsSchema,
    },
    async ({ coins }) => {
      try {
        const data = await client.get('coins', `/prices/current/${encodeURIComponent(coins)}`);
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "get_historical_prices",
    "Get token prices at a specific historical timestamp. Useful for point-in-time valuations and reporting.",
    {
      timestamp: timestampSchema,
      coins: coinsSchema,
      searchWidth: z.string().optional().describe("Time window to search around timestamp if exact match unavailable (e.g., '4h', '1d'). Default: '6h'."),
    },
    async ({ timestamp, coins, searchWidth }) => {
      try {
        let path = `/prices/historical/${timestamp}/${encodeURIComponent(coins)}`;
        if (searchWidth) {
          path += `?searchWidth=${encodeURIComponent(searchWidth)}`;
        }
        const data = await client.get('coins', path);
        const returnedCoins = data?.coins;
        if (!returnedCoins || (typeof returnedCoins === 'object' && Object.keys(returnedCoins).length === 0)) {
          return infoResult(
            `No price data found for the requested coins at timestamp ${timestamp}. ` +
            `DeFi Llama's historical price lookback may be limited — older timestamps often return empty results. ` +
            `Try a more recent timestamp, increase the searchWidth parameter (e.g., '1d' or '2d'), ` +
            `or use get_price_chart for longer-term price trends.`
          );
        }
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "get_price_chart",
    "Get price chart data for tokens over time. Returns historical price series.",
    {
      coins: coinsSchema,
      period: z.string().optional().describe("Time period for data points (e.g., '1d', '1w', '1M'). Determines granularity."),
      span: z.number().optional().describe("Number of data points to return."),
    },
    async ({ coins, period, span }) => {
      try {
        const params = new URLSearchParams();
        if (period) params.set('period', period);
        if (span) params.set('span', String(span));
        const qs = params.toString();
        const path = `/chart/${encodeURIComponent(coins)}${qs ? `?${qs}` : ''}`;
        const data = await client.get('coins', path);
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
