# DeFi Llama MCP

A [Model Context Protocol](https://modelcontextprotocol.io) server that gives Claude and other MCP clients direct access to DeFi Llama and GeckoTerminal data — TVL, token prices, stablecoins, DEX volumes, protocol fees, yield pools, bridge volumes, and live pool analytics across 200+ blockchains.

## Tools

**TVL**
| Tool | Description |
|------|-------------|
| `get_chains` | List all chains with their current TVL |
| `get_chain_tvl` | Historical TVL for a specific chain |
| `get_protocol_tvl` | Detailed TVL breakdown for a protocol by chain |
| `get_protocols` | List protocols, optionally filtered by chain |

**Prices**
| Tool | Description |
|------|-------------|
| `get_token_prices` | Current prices for tokens (`{chain}:{address}` or `coingecko:{id}`) |
| `get_historical_prices` | Token price at a specific timestamp |
| `get_price_chart` | Historical price series with configurable period and span |

**Stablecoins**
| Tool | Description |
|------|-------------|
| `get_stablecoins` | All stablecoins with supply, price, and chain distribution |
| `get_stablecoin_chains` | Stablecoin market cap per chain |
| `get_chain_stablecoins` | Historical stablecoin market cap for a chain |
| `get_stablecoin_dominance` | Current stablecoin dominance snapshot for a chain |

**Volumes, Fees & Bridges**
| Tool | Description |
|------|-------------|
| `get_dex_volumes` | DEX trading volumes for a chain |
| `get_chain_fees` | Fee overview for all protocols on a chain |
| `get_protocol_fees` | Historical fees and revenue for a protocol |
| `get_yield_pools` | Yield pools filtered by chain and/or project |
| `get_bridge_volume` | Bridge deposit and withdrawal volumes |

**GeckoTerminal**
| Tool | Description |
|------|-------------|
| `gt_get_pools` | DEX pools on a network, sortable by volume/TVL/price change |
| `gt_get_pool_detail` | Pool info including volume, TVL, fees, prices, and tx counts |
| `gt_get_pool_trades` | Last 24h trades for a pool (up to 300) |
| `gt_get_pool_ohlcv` | Candlestick data (day/hour/minute, up to 6 months) |
| `gt_get_token` | Token data including price, liquidity, 24h volume, and top pools |
| `gt_search_pools` | Search pools by token name, symbol, or address across all networks |

## Installation

### Claude Desktop (stdio)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "defillama": {
      "command": "npx",
      "args": ["-y", "defillama-mcp"]
    }
  }
}
```

### HTTP server

```bash
npm install
npm run build
npm run start-http        # listens on port 3000
```

Or with Docker:

```bash
docker build -t defillama-mcp .
docker run -p 3000:3000 defillama-mcp
```

Then point your MCP client at `http://localhost:3000/mcp`.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port (HTTP mode only) |
| `CORS_ORIGIN` | — | Comma-separated allowed origins (HTTP mode only) |

## Development

```bash
npm install
npm run dev          # stdio, TypeScript direct
npm run dev-http     # HTTP mode
npm run debug        # MCP Inspector UI
```

## License

MIT
