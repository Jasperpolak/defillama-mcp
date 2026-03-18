import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient } from '../defillama-client.js';
import { chainSchema, jsonResult, errorResult } from './schemas.js';

export function registerBridgeTools(server: McpServer, client: DefiLlamaClient) {

  server.tool(
    "get_bridge_volume",
    "Get bridge deposit and withdrawal volume for a specific chain over time. Note: this endpoint may require a DeFi Llama Pro API key.",
    {
      chain: chainSchema,
    },
    async ({ chain }) => {
      try {
        const data = await client.get('main', `/bridgevolume/${encodeURIComponent(chain)}`);
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
