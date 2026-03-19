import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient, ApiError } from '../defillama-client.js';
import { chainSchema, jsonResult, errorResult, infoResult } from './schemas.js';

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
        if (Array.isArray(data) && data.length === 0) {
          return infoResult(
            `No bridge volume data found for chain "${chain}". ` +
            `DeFi Llama may not have bridge tracking enabled for this chain yet.`
          );
        }
        return jsonResult(data);
      } catch (error) {
        if (error instanceof ApiError && (error.status === 404 || error.status === 500)) {
          return infoResult(
            `Bridge volume data is not available for chain "${chain}" on DeFi Llama. ` +
            `This chain may not have any tracked bridges indexed in DeFi Llama's bridge aggregator yet.`
          );
        }
        return errorResult(error);
      }
    }
  );
}
