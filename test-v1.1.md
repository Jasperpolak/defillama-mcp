# DeFi Llama MCP v1.1 — Test Script (Graceful Error Handling)

Regression + new tests for v1.1 changes. Focused on graceful handling of missing upstream data. Run in a Cowork session connected to the DeFi Llama MCP.

---

## Part 1: Graceful Empty Results

### 1.1 Yield Pools — MANTRA (empty upstream)
> Show me the yield pools on MANTRA chain.

Expected: Returns a **helpful message** explaining that no yield pools are indexed for MANTRA on DeFi Llama, and suggests using `get_protocol_tvl` or `get_protocols` to verify the chain exists. Should NOT return a raw empty array `[]`.

### 1.2 Yield Pools — Non-existent chain
> Show me the yield pools on FakeChain.

Expected: Returns a helpful "no yield pools found" message, not a raw empty array.

### 1.3 Yield Pools — Working chain (regression)
> Show me the yield pools on Ethereum for the Aave project.

Expected: Returns actual yield pool data with APY, TVL, and reward info. This should still work as before.

---

## Part 2: Graceful API Errors (500/404)

### 2.1 Chain Fees — MANTRA (500 upstream)
> Show me the fees overview for MANTRA chain.

Expected: Returns a **helpful message** explaining that fee data is not available for MANTRA on DeFi Llama, and suggests trying `get_protocol_fees` instead. Should NOT return a raw "Error: DeFi Llama API returned status 500".

### 2.2 Chain Fees — Working chain (regression)
> Show me the fees overview for Ethereum.

Expected: Returns actual fee data for Ethereum protocols. This should still work as before.

### 2.3 Bridge Volume — MANTRA (404 upstream)
> Show me the bridge volume for MANTRA chain.

Expected: Returns a **helpful message** explaining that bridge volume data is not available for MANTRA. Should NOT return a raw "Error: DeFi Llama API returned status 404".

### 2.4 Bridge Volume — Working chain (regression)
> Show me the bridge volume for Ethereum.

Expected: Returns actual bridge deposit/withdrawal volume data.

### 2.5 DEX Volumes — Non-indexed chain
> Show me the DEX volumes on MANTRA.

Expected: If MANTRA has DEX volume data, returns it. If not, returns a helpful message (not a raw error).

---

## Part 3: Upstream Data Verification

### 3.1 Protocol Fees — QuickSwap V4
> Show me the fee breakdown for QuickSwap V4.

Expected: Returns fee data. Note which chains appear in the breakdown. Currently Base, Soneium, and Somnia are present — MANTRA is absent. This is a DeFi Llama adapter gap, not an MCP bug. The MCP should return the data as-is without filtering.

### 3.2 Protocol TVL — QuickSwap V4 (control test)
> Show me the TVL breakdown for QuickSwap V4 by chain.

Expected: Returns TVL data including MANTRA (~$638K). This confirms MANTRA is known to DeFi Llama for this protocol, even though fees aren't reported.

### 3.3 Protocols on MANTRA
> List all protocols on MANTRA chain.

Expected: Returns protocols including QuickSwap V4, MANTRA Swap, Fluxtra, KAIO, LuckyStake, LotusDex V2.

---

## Part 4: Protocol Fees Edge Cases

### 4.1 Protocol Fees — Non-existent protocol
> Show me the fees for a protocol called "nonexistent-protocol-xyz".

Expected: Returns a helpful "fee data not available" message, not a raw API error.

### 4.2 Protocol Fees — Fluxtra
> Show me the fees for Fluxtra.

Expected: Either returns fee data or a helpful message explaining fee data isn't available for this protocol.

---

## Test Results

| # | Test | Tool | Expected Behavior | Pass/Fail |
|---|------|------|-------------------|-----------|
| 1.1 | Yield Pools — MANTRA | get_yield_pools | Helpful "not indexed" message | |
| 1.2 | Yield Pools — FakeChain | get_yield_pools | Helpful "not found" message | |
| 1.3 | Yield Pools — Ethereum/Aave | get_yield_pools | Returns data (regression) | |
| 2.1 | Chain Fees — MANTRA | get_chain_fees | Helpful "not available" message | |
| 2.2 | Chain Fees — Ethereum | get_chain_fees | Returns data (regression) | |
| 2.3 | Bridge Volume — MANTRA | get_bridge_volume | Helpful "not available" message | |
| 2.4 | Bridge Volume — Ethereum | get_bridge_volume | Returns data (regression) | |
| 2.5 | DEX Volumes — MANTRA | get_dex_volumes | Helpful message or data | |
| 3.1 | Protocol Fees — QuickSwap V4 | get_protocol_fees | Data without MANTRA (upstream gap) | |
| 3.2 | Protocol TVL — QuickSwap V4 | get_protocol_tvl | Data with MANTRA (~$638K) | |
| 3.3 | Protocols on MANTRA | get_protocols | 6 protocols listed | |
| 4.1 | Protocol Fees — nonexistent | get_protocol_fees | Helpful "not available" message | |
| 4.2 | Protocol Fees — Fluxtra | get_protocol_fees | Data or helpful message | |

**Result: __ / 13 passed**

---

## Notes for Tester
- Tests 1.1, 2.1, 2.3 are the **key fixes** from Octavio's March 19 feedback (items #10, #11, #18)
- Test 3.1 verifies item #17 (MANTRA missing from QuickSwap V4 fee breakdown) — this is a DeFi Llama upstream gap, not fixable on MCP side
- Item #5 (yield indexing for Fluxtra/QuickSwap) is also upstream — no MCP fix possible
- The volumes tool (test 2.5) was hardened proactively with the same pattern
