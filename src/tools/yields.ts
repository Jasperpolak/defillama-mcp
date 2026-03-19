import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient } from '../defillama-client.js';
import { chainSchema, jsonResult, errorResult, infoResult } from './schemas.js';
import { z } from 'zod';

export function registerYieldTools(server: McpServer, client: DefiLlamaClient) {

  server.tool(
    "get_yield_pools",
    "Get all yield pools with APY, TVL, and reward token info. Can filter by chain and/or project. Note: this endpoint may require a DeFi Llama Pro API key.",
    {
      chain: z.string().optional().describe("Optional: filter pools to a specific chain (e.g., 'Ethereum', 'MANTRA')."),
      project: z.string().optional().describe("Optional: filter pools to a specific project slug (e.g., 'aave', 'uniswap')."),
    },
    async ({ chain, project }) => {
      try {
        const data = await client.get('yields', '/pools');
        let pools = data.data || data;
        if (chain) {
          pools = pools.filter((p: any) => p.chain?.toLowerCase() === chain.toLowerCase());
        }
        if (project) {
          pools = pools.filter((p: any) => p.project?.toLowerCase() === project.toLowerCase());
        }
        if (pools.length === 0) {
          const filters = [chain && `chain "${chain}"`, project && `project "${project}"`].filter(Boolean).join(' and ');
          return infoResult(
            `No yield pools found for ${filters}. ` +
            `DeFi Llama may not have yield pool data indexed for this ${chain ? 'chain' : 'project'} yet. ` +
            `This typically means the yield adapters have not been added to DefiLlama's yield server. ` +
            `You can verify by checking the protocol's TVL with get_protocol_tvl or get_protocols — ` +
            `a protocol can have TVL indexed without yield data.`
          );
        }
        return jsonResult(pools);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
