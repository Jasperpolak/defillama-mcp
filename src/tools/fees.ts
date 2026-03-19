import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient, ApiError } from '../defillama-client.js';
import { chainSchema, protocolSchema, jsonResult, errorResult, infoResult } from './schemas.js';

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
        if (error instanceof ApiError && (error.status === 500 || error.status === 404)) {
          return infoResult(
            `Fee data is not available for chain "${chain}" on DeFi Llama. ` +
            `This chain may not have fee tracking enabled in DeFi Llama's fee adapters yet. ` +
            `You can try get_protocol_fees with a specific protocol slug instead — ` +
            `protocol-level fee data is sometimes available even when chain-level aggregation is not.`
          );
        }
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
        if (error instanceof ApiError && (error.status === 500 || error.status === 404)) {
          return infoResult(
            `Fee data is not available for protocol "${protocol}" on DeFi Llama. ` +
            `This protocol may not have a fee adapter configured in DeFi Llama yet. ` +
            `You can verify the protocol exists by using get_protocols or get_protocol_tvl.`
          );
        }
        return errorResult(error);
      }
    }
  );
}
