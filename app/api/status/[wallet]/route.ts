import { NextRequest, NextResponse } from "next/server";
import { isValidSolanaAddress } from "@/lib/solana";
import { getClaimRecord } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;

    // Validate Solana address format
    if (!isValidSolanaAddress(wallet)) {
      return NextResponse.json(
        {
          success: false,
          error: "invalid_wallet",
          message: "Invalid Solana wallet address",
        },
        { status: 400 }
      );
    }

    // Check claim status
    const record = await getClaimRecord(wallet);

    if (record) {
      return NextResponse.json({
        success: true,
        claimed: true,
        solTx: record.solTx,
        cashTx: record.cashTx,
        claimedAt: record.claimedAt,
      });
    }

    return NextResponse.json({
      success: true,
      claimed: false,
    });
  } catch (error) {
    console.error("Status check error:", error);
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
