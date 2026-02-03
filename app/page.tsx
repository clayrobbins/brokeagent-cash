"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Balance {
  cash: number;
  sol: number;
  cashFormatted: string;
  solFormatted: string;
}

export default function Home() {
  const [balance, setBalance] = useState<Balance | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Add cache-busting timestamp
        const res = await fetch(`/api/balance?t=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success) {
          setBalance(data);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Image
            src="/cash-logo.png"
            alt="CASH"
            width={200}
            height={57}
            className="h-auto"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-semibold text-center mb-3 tracking-tight text-gray-900">
          BrokeAgent.cash
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-center text-gray-500 mb-16 font-light">
          Seed funding for AI agents
        </p>

        {/* What you get - Premium Card */}
        <div className="bg-white rounded-3xl p-10 mb-6 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-6 text-center font-medium">
            What you get
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <Image
                src="/cash-symbol.png"
                alt="CASH"
                width={44}
                height={44}
                className="rounded-full shadow-sm"
              />
              <div>
                <span className="text-3xl font-semibold text-gray-900">$1</span>
                <span className="text-lg text-gray-400 ml-1">CASH</span>
              </div>
            </div>
            <span className="text-gray-200 text-2xl">+</span>
            <div className="flex items-center gap-3">
              <Image
                src="/solana-logo.png"
                alt="SOL"
                width={44}
                height={44}
                className="rounded-full"
              />
              <div>
                <span className="text-3xl font-semibold text-gray-900">0.001</span>
                <span className="text-lg text-gray-400 ml-1">SOL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Faucet Balance */}
        {balance && (
          <div className="text-center mb-12">
            <p className="text-sm text-gray-400">
              Faucet balance:{" "}
              <span className="text-gray-600 font-medium">${balance.cashFormatted} CASH</span>
              {" · "}
              <span className="text-gray-600 font-medium">{balance.solFormatted} SOL</span>
            </p>
          </div>
        )}

        {/* For Agents - Dark Card */}
        <div className="bg-gray-900 text-white rounded-3xl p-10 mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <Image
              src="/cash-avatar.png"
              alt="CASH"
              width={28}
              height={28}
              className="rounded-full"
            />
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              For AI Agents
            </p>
          </div>
          <p className="text-gray-400 mb-5 text-center text-sm">
            Add this skill to claim funds
          </p>
          <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
            <code className="block text-sm text-gray-300 text-center font-mono">
              https://www.brokeagent.cash/skill.md
            </code>
          </div>
        </div>

        {/* API Reference */}
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-16">
          <div>
            <span className="text-gray-500">Claim</span>{" "}
            <code className="text-gray-400 font-mono text-xs bg-gray-100 px-2 py-1 rounded-md">
              POST /api/claim
            </code>
          </div>
          <div>
            <span className="text-gray-500">Status</span>{" "}
            <code className="text-gray-400 font-mono text-xs bg-gray-100 px-2 py-1 rounded-md">
              GET /api/status/*
            </code>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400">
          <p className="mb-1">
            CASH is Phantom&apos;s USD-pegged stablecoin
          </p>
          <p className="text-gray-300">
            One claim per wallet
          </p>
        </footer>
      </div>
    </main>
  );
}
