import Redis from "ioredis";
import { CLAIM_KEY_PREFIX } from "./constants";

export interface ClaimRecord {
  walletAddress: string;
  solTx: string;
  cashTx: string;
  claimedAt: string;
}

function getRedis(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL environment variable not set");
  }
  return new Redis(url);
}

export async function hasClaimed(walletAddress: string): Promise<boolean> {
  const redis = getRedis();
  try {
    const record = await redis.get(`${CLAIM_KEY_PREFIX}${walletAddress}`);
    return record !== null;
  } finally {
    redis.disconnect();
  }
}

export async function getClaimRecord(
  walletAddress: string
): Promise<ClaimRecord | null> {
  const redis = getRedis();
  try {
    const record = await redis.get(`${CLAIM_KEY_PREFIX}${walletAddress}`);
    if (!record) return null;
    return JSON.parse(record) as ClaimRecord;
  } finally {
    redis.disconnect();
  }
}

export async function recordClaim(
  walletAddress: string,
  solTx: string,
  cashTx: string
): Promise<void> {
  const redis = getRedis();
  try {
    const record: ClaimRecord = {
      walletAddress,
      solTx,
      cashTx,
      claimedAt: new Date().toISOString(),
    };
    await redis.set(
      `${CLAIM_KEY_PREFIX}${walletAddress}`,
      JSON.stringify(record)
    );
  } finally {
    redis.disconnect();
  }
}
