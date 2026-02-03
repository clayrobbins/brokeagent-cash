import { Redis } from "@upstash/redis";
import { CLAIM_KEY_PREFIX } from "./constants";

export interface ClaimRecord {
  walletAddress: string;
  solTx: string;
  cashTx: string;
  claimedAt: string;
}

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables must be set");
  }

  return new Redis({ url, token });
}

export async function hasClaimed(walletAddress: string): Promise<boolean> {
  const redis = getRedis();
  const record = await redis.get(`${CLAIM_KEY_PREFIX}${walletAddress}`);
  return record !== null;
}

export async function getClaimRecord(
  walletAddress: string
): Promise<ClaimRecord | null> {
  const redis = getRedis();
  const record = await redis.get<ClaimRecord>(`${CLAIM_KEY_PREFIX}${walletAddress}`);
  return record;
}

export async function recordClaim(
  walletAddress: string,
  solTx: string,
  cashTx: string
): Promise<void> {
  const redis = getRedis();
  const record: ClaimRecord = {
    walletAddress,
    solTx,
    cashTx,
    claimedAt: new Date().toISOString(),
  };
  await redis.set(`${CLAIM_KEY_PREFIX}${walletAddress}`, record);
}
