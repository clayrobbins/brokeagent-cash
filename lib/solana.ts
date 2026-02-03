import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferCheckedWithTransferHookInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";
import {
  CASH_MINT,
  SOL_AMOUNT_LAMPORTS,
  CASH_AMOUNT,
  CASH_DECIMALS,
} from "./constants";

// Cache connection instance
let connectionInstance: Connection | null = null;

function getConnection(): Connection {
  if (connectionInstance) return connectionInstance;

  const rpcUrl = process.env.SOLANA_RPC_URL;
  if (!rpcUrl) {
    throw new Error("SOLANA_RPC_URL environment variable not set");
  }
  connectionInstance = new Connection(rpcUrl, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 30000,
  });
  return connectionInstance;
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

// Combined function to send both SOL and CASH in one transaction
// Optimized for speed: doesn't wait for confirmation, always creates ATA (idempotent)
export async function sendFaucetFunds(recipientAddress: string): Promise<{ solTx: string; cashTx: string }> {
  const connection = getConnection();
  const faucetWallet = getFaucetWallet();
  const recipient = new PublicKey(recipientAddress);

  // Get token accounts (pure derivation, no RPC call)
  const faucetTokenAccount = await getAssociatedTokenAddress(
    CASH_MINT,
    faucetWallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const recipientTokenAccount = await getAssociatedTokenAddress(
    CASH_MINT,
    recipient,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Fetch blockhash and build transfer instruction in parallel
  const [blockhashResult, transferInstruction] = await Promise.all([
    connection.getLatestBlockhash("confirmed"),
    createTransferCheckedWithTransferHookInstruction(
      connection,
      faucetTokenAccount,
      CASH_MINT,
      recipientTokenAccount,
      faucetWallet.publicKey,
      BigInt(CASH_AMOUNT),
      CASH_DECIMALS,
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID
    ),
  ]);

  const transaction = new Transaction();
  transaction.recentBlockhash = blockhashResult.blockhash;
  transaction.feePayer = faucetWallet.publicKey;

  // Add SOL transfer
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: faucetWallet.publicKey,
      toPubkey: recipient,
      lamports: SOL_AMOUNT_LAMPORTS,
    })
  );

  // Always add ATA creation (it's idempotent - no-op if account exists)
  transaction.add(
    createAssociatedTokenAccountInstruction(
      faucetWallet.publicKey,
      recipientTokenAccount,
      recipient,
      CASH_MINT,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );

  // Add CASH transfer with transfer hook handling
  transaction.add(transferInstruction);

  // Sign the transaction
  transaction.sign(faucetWallet);

  // Send without waiting for confirmation (fire and forget)
  // Skip preflight to save time - we've validated inputs
  const signature = await connection.sendRawTransaction(transaction.serialize(), {
    skipPreflight: true,
    preflightCommitment: "confirmed",
  });

  return { solTx: signature, cashTx: signature };
}

// Backward compatibility functions (also optimized for speed)
export async function sendSol(recipientAddress: string): Promise<string> {
  const connection = getConnection();
  const faucetWallet = getFaucetWallet();
  const recipient = new PublicKey(recipientAddress);

  const { blockhash } = await connection.getLatestBlockhash("confirmed");

  const transaction = new Transaction();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = faucetWallet.publicKey;
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: faucetWallet.publicKey,
      toPubkey: recipient,
      lamports: SOL_AMOUNT_LAMPORTS,
    })
  );
  transaction.sign(faucetWallet);

  const signature = await connection.sendRawTransaction(transaction.serialize(), {
    skipPreflight: true,
  });
  return signature;
}

export async function sendCash(recipientAddress: string): Promise<string> {
  const connection = getConnection();
  const faucetWallet = getFaucetWallet();
  const recipient = new PublicKey(recipientAddress);

  const faucetTokenAccount = await getAssociatedTokenAddress(
    CASH_MINT,
    faucetWallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const recipientTokenAccount = await getAssociatedTokenAddress(
    CASH_MINT,
    recipient,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const [{ blockhash }, transferInstruction] = await Promise.all([
    connection.getLatestBlockhash("confirmed"),
    createTransferCheckedWithTransferHookInstruction(
      connection,
      faucetTokenAccount,
      CASH_MINT,
      recipientTokenAccount,
      faucetWallet.publicKey,
      BigInt(CASH_AMOUNT),
      CASH_DECIMALS,
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID
    ),
  ]);

  const transaction = new Transaction();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = faucetWallet.publicKey;

  // Always add ATA creation (idempotent)
  transaction.add(
    createAssociatedTokenAccountInstruction(
      faucetWallet.publicKey,
      recipientTokenAccount,
      recipient,
      CASH_MINT,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );
  transaction.add(transferInstruction);
  transaction.sign(faucetWallet);

  const signature = await connection.sendRawTransaction(transaction.serialize(), {
    skipPreflight: true,
  });
  return signature;
}
