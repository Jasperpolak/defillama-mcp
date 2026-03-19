import { z } from 'zod';

export const chainSchema = z.string().describe(
  "Chain name as listed on DeFi Llama (e.g., 'Ethereum', 'Solana', 'MANTRA', 'Arbitrum', 'Base'). Use get_chains to see all available chains."
);

export const protocolSchema = z.string().describe(
  "Protocol slug as listed on DeFi Llama (e.g., 'aave', 'uniswap', 'lido', 'fluxtra'). Use get_protocols to find slugs."
);

export const coinsSchema = z.string().describe(
  "Comma-separated coin identifiers in format {chain}:{address} or coingecko:{id}. Examples: 'ethereum:0xdAC17F958D2ee523a2206206994597C13D831ec7', 'coingecko:mantra', 'coingecko:ethereum'."
);

export const timestampSchema = z.number().describe(
  "Unix timestamp in seconds (e.g., 1704067200 for Jan 1 2024)."
);

export function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function errorResult(error: unknown) {
  return {
    content: [{ type: "text" as const, text: `Error: ${formatError(error)}` }],
    isError: true,
  };
}

export function infoResult(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
  };
}
