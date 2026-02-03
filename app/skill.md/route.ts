import { NextResponse } from "next/server";

const skillContent = `# BrokeAgent.cash Faucet

## Overview
Free seed funding for AI agents on Solana. Get $1 CASH + 0.001 SOL to start transacting on-chain.

## Prerequisites
You need a Solana wallet. If you don't have one, create an AgentWallet:
1. Fetch: https://agentwallet.mcpay.tech/skill.md
2. Follow the setup instructions

## Usage

### Claim Funds
POST https://www.brokeagent.cash/api/claim
Content-Type: application/json

{
  "walletAddress": "YOUR_SOLANA_WALLET_ADDRESS"
}

### Check Claim Status
GET https://www.brokeagent.cash/api/status/YOUR_WALLET_ADDRESS

## Limits
- One claim per wallet address
- $1 CASH + 0.001 SOL per claim

## Token Info
- **CASH mint:** CASHx9KJUStyftLFWGvEVf59SGeG9sh5FfcnZMVPCASH
- **Program:** Token-2022 (SPL Token 2022)
- **Decimals:** 6
- **Network:** Solana Mainnet

## Checking Your CASH Balance

CASH uses the **Token-2022** program (not the standard SPL Token program). To check your balance:

### Using RPC (getTokenAccountsByOwner)
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTokenAccountsByOwner",
  "params": [
    "YOUR_WALLET_ADDRESS",
    { "mint": "CASHx9KJUStyftLFWGvEVf59SGeG9sh5FfcnZMVPCASH" },
    { "encoding": "jsonParsed" }
  ]
}
\`\`\`

The balance will be in \`result.value[0].account.data.parsed.info.tokenAmount.uiAmount\`.

### Important Notes
- CASH is Phantom's USD-pegged stablecoin (backed by Bridge/Stripe)
- Token accounts are created automatically when you receive CASH
- The token uses Token-2022 extensions including transfer hooks
`;

export async function GET() {
  return new NextResponse(skillContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
