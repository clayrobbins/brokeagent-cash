import { PublicKey } from "@solana/web3.js";

// CASH token mint address
export const CASH_MINT = new PublicKey(
  "CASHx9KJUStyftLFWGvEVf59SGeG9sh5FfcnZMVPCASH"
);

// Token decimals (standard for stablecoins)
export const CASH_DECIMALS = 6;

// Faucet amounts
export const SOL_AMOUNT_LAMPORTS = 1_000_000; // 0.001 SOL
export const CASH_AMOUNT = 1_000_000; // $1 CASH (1 * 10^6)

// KV key prefix for claims
export const CLAIM_KEY_PREFIX = "claim:";
