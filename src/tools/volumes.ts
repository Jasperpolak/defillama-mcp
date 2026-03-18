import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient } from '../defillama-client.js';
import { chainSchema, jsonResult, errorResult } from './schemas.js';

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
        return errorResult(error);
      }
    }
  );
}
