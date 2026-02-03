import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { CASH_MINT } from "@/lib/constants";

// Disable Vercel caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

const FAUCET_WALLET = "9ZWCK5JzfQjy2WUS6csCBPj9aeyZzBZyUhjJ9RaTnKz6";

export async function GET() {
  try {
    const rpcUrl = process.env.SOLANA_RPC_URL;
    if (!rpcUrl) {
      throw new Error("SOLANA_RPC_URL not set");
    }

    const connection = new Connection(rpcUrl, "confirmed");
    const walletPubkey = new PublicKey(FAUCET_WALLET);

    // Get SOL balance
    const solBalance = await connection.getBalance(walletPubkey);
    const solAmount = solBalance / 1_000_000_000; // Convert lamports to SOL

    // Get CASH token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPubkey,
      { mint: CASH_MINT }
    );

    let cashAmount = 0;
    if (tokenAccounts.value.length > 0) {
      const parsed = tokenAccounts.value[0].account.data.parsed;
      cashAmount = parsed.info.tokenAmount.uiAmount || 0;
    }

    return NextResponse.json(
      {
        success: true,
        sol: solAmount,
        cash: cashAmount,
        solFormatted: solAmount.toFixed(4),
        cashFormatted: cashAmount.toFixed(2),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Balance check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
