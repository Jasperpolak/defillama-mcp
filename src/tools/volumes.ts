import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient, ApiError } from '../defillama-client.js';
import { chainSchema, jsonResult, errorResult, infoResult } from './schemas.js';

export function registerVolumeTools(server: McpServer, client: DefiLlamaClient) {

  server.tool(
    "get_dex_volumes",
    "Get DEX trading volume overview for a specific chain. Shows all DEXes and their volumes.",
    {
      chain: chainSchema,
    },
    async ({ chain }) => {
      try {
        const data = await client.get('main', `/overview/dexs/${encodeURIComponent(chain)}`);
        return jsonResult(data);
      } catch (error) {
        if (error instanceof ApiError && (error.status === 500 || error.status === 404)) {
          return infoResult(
            `DEX volume data is not available for chain "${chain}" on DeFi Llama. ` +
            `This chain may not have DEX volume tracking enabled yet.`
          );
        }
        return errorResult(error);
      }
    }
  );
}
