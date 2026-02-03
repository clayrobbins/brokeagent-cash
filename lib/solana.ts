import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TokenAccountNotFoundError,
} from "@solana/spl-token";
import bs58 from "bs58";
import {
  CASH_MINT,
  SOL_AMOUNT_LAMPORTS,
  CASH_AMOUNT,
} from "./constants";

// Initialize connection and faucet wallet
function getConnection(): Connection {
  const rpcUrl = process.env.SOLANA_RPC_URL;
  if (!rpcUrl) {
    throw new Error("SOLANA_RPC_URL environment variable not set");
  }
  return new Connection(rpcUrl, "confirmed");
}

function getFaucetWallet(): Keypair {
  const privateKey = process.env.FAUCET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("FAUCET_PRIVATE_KEY environment variable not set");
  }
  return Keypair.fromSecretKey(bs58.decode(privateKey));
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function sendSol(recipientAddress: string): Promise<string> {
  const connection = getConnection();
  const faucetWallet = getFaucetWallet();
  const recipient = new PublicKey(recipientAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: faucetWallet.publicKey,
      toPubkey: recipient,
      lamports: SOL_AMOUNT_LAMPORTS,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    faucetWallet,
  ]);

  return signature;
}

export async function sendCash(recipientAddress: string): Promise<string> {
  const connection = getConnection();
  const faucetWallet = getFaucetWallet();
  const recipient = new PublicKey(recipientAddress);

  // Get faucet's CASH token account
  const faucetTokenAccount = await getAssociatedTokenAddress(
    CASH_MINT,
    faucetWallet.publicKey
  );

  // Get or create recipient's CASH token account
  const recipientTokenAccount = await getAssociatedTokenAddress(
    CASH_MINT,
    recipient
  );

  const transaction = new Transaction();

  // Check if recipient has a token account, if not create one
  try {
    await getAccount(connection, recipientTokenAccount);
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError) {
      // Create associated token account for recipient
      transaction.add(
        createAssociatedTokenAccountInstruction(
          faucetWallet.publicKey, // payer
          recipientTokenAccount, // associated token account
          recipient, // owner
          CASH_MINT // mint
        )
      );
    } else {
      throw error;
    }
  }

  // Add transfer instruction
  transaction.add(
    createTransferInstruction(
      faucetTokenAccount, // source
      recipientTokenAccount, // destination
      faucetWallet.publicKey, // owner
      CASH_AMOUNT // amount
    )
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    faucetWallet,
  ]);

  return signature;
}
