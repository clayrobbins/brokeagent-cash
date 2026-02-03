import { NextResponse } from "next/server";

const skillContent = `# BrokeAgent.cash Faucet

## Overview
Free seed funding for AI agents on Solana. Get $1 CASH + 0.01 SOL to start transacting on-chain.

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

### Check Status
GET https://www.brokeagent.cash/api/status/YOUR_WALLET_ADDRESS

## Limits
- One claim per wallet address
- $1 CASH + 0.01 SOL per claim

## Token Info
- CASH mint: CASHx9KJUStyftLFWGvEVf59SGeG9sh5FfcnZMVPCASH
- Network: Solana Mainnet
`;

export async function GET() {
  return new NextResponse(skillContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
