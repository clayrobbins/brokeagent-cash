import { NextRequest, NextResponse } from "next/server";
import { isValidSolanaAddress, sendSol, sendCash } from "@/lib/solana";
import { hasClaimed, recordClaim } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    // Validate wallet address is provided
    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "no_wallet",
          message: "Create an AgentWallet first",
          setupUrl: "https://agentwallet.mcpay.tech/skill.md",
        },
        { status: 400 }
      );
    }

    // Validate Solana address format
    if (!isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: "invalid_wallet",
          message: "Invalid Solana wallet address",
        },
        { status: 400 }
      );
    }

    // Check if wallet has already claimed
    const claimed = await hasClaimed(walletAddress);
    if (claimed) {
      return NextResponse.json(
        {
          success: false,
          error: "already_claimed",
          message: "This wallet has already claimed from the faucet",
        },
        { status: 400 }
      );
    }

    // Send SOL first (needed for transaction fees)
    const solTx = await sendSol(walletAddress);

    // Send CASH tokens
    const cashTx = await sendCash(walletAddress);

    // Record the claim
    await recordClaim(walletAddress, solTx, cashTx);

    return NextResponse.json({
      success: true,
      solTx,
      cashTx,
      message: "Claimed $1 CASH + 0.001 SOL",
    });
  } catch (error) {
    console.error("Claim error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "server_error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
