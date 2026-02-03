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
  getAccount,
  TokenAccountNotFoundError,
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
export async function sendFaucetFunds(recipientAddress: string): Promise<{ solTx: string; cashTx: string }> {
  const connection = getConnection();
  const faucetWallet = getFaucetWallet();
  const recipient = new PublicKey(recipientAddress);

  // Get token accounts
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

  const transaction = new Transaction();

  // Add SOL transfer
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: faucetWallet.publicKey,
      toPubkey: recipient,
      lamports: SOL_AMOUNT_LAMPORTS,
    })
  );

  // Check if recipient has a token account, if not create one
  try {
    await getAccount(connection, recipientTokenAccount, "confirmed", TOKEN_2022_PROGRAM_ID);
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError) {
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
    } else {
      throw error;
    }
  }

  // Add CASH transfer with transfer hook handling
  const transferInstruction = await createTransferCheckedWithTransferHookInstruction(
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
  );
  transaction.add(transferInstruction);

  // Send single transaction with both transfers
  const signature = await sendAndConfirmTransaction(connection, transaction, [faucetWallet]);

  return { solTx: signature, cashTx: signature };
}

// Keep old functions for backward compatibility
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

  const signature = await sendAndConfirmTransaction(connection, transaction, [faucetWallet]);
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

  const transaction = new Transaction();

  try {
    await getAccount(connection, recipientTokenAccount, "confirmed", TOKEN_2022_PROGRAM_ID);
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError) {
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
    } else {
      throw error;
    }
  }

  const transferInstruction = await createTransferCheckedWithTransferHookInstruction(
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
  );
  transaction.add(transferInstruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [faucetWallet]);
  return signature;
}
