import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient, ApiError } from '../defillama-client.js';
import { chainSchema, protocolSchema, jsonResult, errorResult, infoResult, findSimilarSlugs } from './schemas.js';
import { z } from 'zod';

export function registerTvlTools(server: McpServer, client: DefiLlamaClient) {

  server.tool(
    "get_chains",
    "Get all chains tracked by DeFi Llama with their current TVL, chainId, and gecko_id. Use this to discover available chain names for other tools.",
    {},
    async () => {
      try {
        const data = await client.get('main', '/v2/chains');
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "get_chain_tvl",
    "Get historical TVL data for a specific chain. Returns daily TVL values over time.",
    {
      chain: chainSchema,
    },
    async ({ chain }) => {
      try {
        const data = await client.get('main', `/v2/historicalChainTvl/${encodeURIComponent(chain)}`);
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "get_protocol_tvl",
    "Get detailed protocol data including historical TVL broken down by chain, token composition, and metadata. If the slug doesn't match exactly, similar slugs will be suggested. Use get_protocols to discover valid protocol slugs.",
    {
      protocol: protocolSchema,
    },
    async ({ protocol }) => {
      try {
        const data = await client.get('main', `/protocol/${encodeURIComponent(protocol)}`);
        return jsonResult(data);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          let message = `Protocol "${protocol}" was not found on DeFi Llama.`;
          try {
            const allProtocols = await client.get('main', '/protocols');
            const similar = findSimilarSlugs(protocol, allProtocols, 'slug');
            if (similar.length > 0) {
              message += ` Did you mean one of these protocol slugs? ${similar.join(', ')}`;
            } else {
              message += ` Use get_protocols to see all available protocol slugs.`;
            }
          } catch {
            message += ` Use get_protocols to see all available protocol slugs.`;
          }
          return infoResult(message);
        }
        return errorResult(error);
      }
    }
  );

  server.tool(
    "get_protocols",
    "List all protocols tracked by DeFi Llama with their current TVL, chains, category, and other metadata. Can be filtered by chain client-side.",
    {
      chain: z.string().optional().describe("Optional: filter results to only show protocols on this chain (e.g., 'Ethereum', 'MANTRA'). Filtering is done client-side."),
    },
    async ({ chain }) => {
      try {
        let data = await client.get('main', '/protocols');
        if (chain) {
          data = data.filter((p: any) =>
            p.chains?.some((c: string) => c.toLowerCase() === chain.toLowerCase())
          );
        }
        return jsonResult(data);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
