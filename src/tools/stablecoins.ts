import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient } from '../defillama-client.js';
import { chainSchema, jsonResult, errorResult } from './schemas.js';

export function registerStablecoinTools(server: McpServer, client: DefiLlamaClient) {

  server.tool(
    "get_stablecoins",
    "Get all stablecoins with their circulating amounts, prices, and chain distribution.",
    {},
    async () => {
      try {
        const data = await client.get('stablecoins', '/stablecoins?includePrices=true');
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "get_stablecoin_chains",
    "Get current stablecoin market cap for every chain. Shows how much stablecoin liquidity exists on each chain.",
    {},
    async () => {
      try {
        const data = await client.get('stablecoins', '/stablecoinchains');
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "get_chain_stablecoins",
    "Get historical stablecoin market cap for a specific chain over time.",
    {
      chain: chainSchema,
    },
    async ({ chain }) => {
      try {
        const data = await client.get('stablecoins', `/stablecoincharts/${encodeURIComponent(chain)}`);
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "get_stablecoin_dominance",
    "Get current stablecoin dominance breakdown for a specific chain — shows which stablecoins hold the most market share. Returns a current snapshot only (not historical). For historical stablecoin data over time, use get_chain_stablecoins instead.",
    {
      chain: chainSchema,
    },
    async ({ chain }) => {
      try {
        const data = await client.get('stablecoins', `/stablecoindominance/${encodeURIComponent(chain)}`);
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
