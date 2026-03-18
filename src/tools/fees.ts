import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient } from '../defillama-client.js';
import { chainSchema, protocolSchema, jsonResult, errorResult } from './schemas.js';

export function registerFeeTools(server: McpServer, client: DefiLlamaClient) {

  server.tool(
    "get_chain_fees",
    "Get fees and revenue overview for all protocols on a specific chain.",
    {
      chain: chainSchema,
    },
    async ({ chain }) => {
      try {
        const data = await client.get('main', `/overview/fees/${encodeURIComponent(chain)}`);
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "get_protocol_fees",
    "Get detailed fees and revenue data for a specific protocol, including historical breakdown.",
    {
      protocol: protocolSchema,
    },
    async ({ protocol }) => {
      try {
        const data = await client.get('main', `/summary/fees/${encodeURIComponent(protocol)}`);
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
