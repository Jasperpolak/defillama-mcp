# DeFi Llama MCP v1.0 — Test Script

Use this in a clean Cowork window connected to the DeFi Llama MCP. Run each test and note whether it passes or fails. Tests cover all 16 tools across TVL, prices, stablecoins, volumes, fees, yields, and bridges.

---

## Part 1: TVL Tools (4 tests)

### 1.1 Get Chains
> List the top 10 chains by TVL.

Expected: Returns a list including Ethereum, Solana, BSC, Tron, Arbitrum, etc. with TVL values in the billions.

### 1.2 Chain TVL (multi-chain)
> Compare the historical TVL of Ethereum and Solana over the last 7 days.

Expected: Returns daily TVL data for both chains. Ethereum should be in the $50B+ range, Solana in the $5-10B range.

### 1.3 Protocol TVL
> Get the detailed TVL breakdown for Aave, including which chains it's deployed on.

Expected: Returns Aave's TVL broken down by chain (Ethereum, Polygon, Arbitrum, Avalanche, etc.) with historical data.

### 1.4 Protocols by Chain
> List all protocols on the MANTRA chain with their TVL.

Expected: Returns protocols including KAIO, Quickswap V4, MANTRA Swap, LotusDex, and Fluxtra.

---

## Part 2: Price Tools (3 tests)

### 2.1 Current Prices
> What are the current prices of Ethereum, Solana, and MANTRA?

Expected: Returns prices for all three tokens. ETH should be in the thousands, SOL in the double/triple digits, MANTRA well below $1.

### 2.2 Historical Price
> What was the price of Ethereum on January 1st, 2025?

Expected: Returns ETH price at that timestamp (was approximately $3,300-3,400 at that time).

### 2.3 Price Chart
> Show me the price chart for MANTRA over the last 30 days with daily data points.

Expected: Returns a series of daily price data points for the coingecko:mantra identifier.

---

## Part 3: Stablecoin Tools (4 tests)

### 3.1 All Stablecoins
> What are the top 5 stablecoins by circulating supply?

Expected: Returns USDT, USDC, DAI, and others with their circulating amounts and chain distribution.

### 3.2 Stablecoin Chains
> Which chains have the most stablecoin liquidity?

Expected: Returns Ethereum at the top ($100B+), followed by Tron, BSC, Solana, etc.

### 3.3 Chain Stablecoins (MANTRA)
> Show me the historical stablecoin market cap on MANTRA chain.

Expected: Returns historical data showing mantraUSD and USDY growth from Jan 2025 onward.

### 3.4 Stablecoin Dominance
> What's the stablecoin dominance breakdown on Ethereum?

Expected: Returns USDT and USDC dominating, with smaller shares for DAI, FRAX, etc.

---

## Part 4: Volume Tools (1 test)

### 4.1 DEX Volumes
> What are the DEX trading volumes on Solana?

Expected: Returns volume data for Solana DEXes (Raydium, Orca, Jupiter, etc.) with 24h and total volumes.

---

## Part 5: Fee Tools (2 tests)

### 5.1 Chain Fees
> Show me the fees and revenue overview for Ethereum.

Expected: Returns fee data for protocols on Ethereum with daily/total breakdowns.

### 5.2 Protocol Fees
> What are Uniswap's fees and revenue?

Expected: Returns Uniswap's historical fee and revenue data with daily breakdown.

---

## Part 6: Extended Tools (2 tests)

### 6.1 Yield Pools
> Show me the top yield pools on Ethereum by APY, filtering for the Aave project.

Expected: Returns Aave lending pools on Ethereum with APY, TVL, and reward token info. May require Pro API — if so, should return a clear error message.

### 6.2 Bridge Volume
> Show me the bridge volume for MANTRA chain.

Expected: Returns bridge deposit/withdrawal history for MANTRA. May require Pro API — if so, should return a clear error message.

---

## Test Results

| # | Test | Tool | Pass/Fail |
|---|------|------|-----------|
| 1.1 | Get Chains | get_chains | |
| 1.2 | Chain TVL | get_chain_tvl | |
| 1.3 | Protocol TVL | get_protocol_tvl | |
| 1.4 | Protocols by Chain | get_protocols | |
| 2.1 | Current Prices | get_token_prices | |
| 2.2 | Historical Price | get_historical_prices | |
| 2.3 | Price Chart | get_price_chart | |
| 3.1 | All Stablecoins | get_stablecoins | |
| 3.2 | Stablecoin Chains | get_stablecoin_chains | |
| 3.3 | Chain Stablecoins | get_chain_stablecoins | |
| 3.4 | Stablecoin Dominance | get_stablecoin_dominance | |
| 4.1 | DEX Volumes | get_dex_volumes | |
| 5.1 | Chain Fees | get_chain_fees | |
| 5.2 | Protocol Fees | get_protocol_fees | |
| 6.1 | Yield Pools | get_yield_pools | |
| 6.2 | Bridge Volume | get_bridge_volume | |

**Result: __ / 16 passed**
