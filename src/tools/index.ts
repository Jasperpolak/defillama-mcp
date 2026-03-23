import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DefiLlamaClient } from '../defillama-client.js';
import { GeckoTerminalClient } from '../gecko-terminal-client.js';
import { registerTvlTools } from './tvl.js';
import { registerPriceTools } from './prices.js';
import { registerStablecoinTools } from './stablecoins.js';
import { registerVolumeTools } from './volumes.js';
import { registerFeeTools } from './fees.js';
import { registerYieldTools } from './yields.js';
import { registerBridgeTools } from './bridges.js';
import { registerGeckoTerminalTools } from './gecko-terminal.js';

export function registerAllTools(server: McpServer, client: DefiLlamaClient, gtClient: GeckoTerminalClient) {
  registerTvlTools(server, client);
  registerPriceTools(server, client);
  registerStablecoinTools(server, client);
  registerVolumeTools(server, client);
  registerFeeTools(server, client);
  registerYieldTools(server, client);
  registerBridgeTools(server, client);
  registerGeckoTerminalTools(server, gtClient);
}
