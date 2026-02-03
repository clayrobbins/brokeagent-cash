import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/cash-logo.png"
            alt="CASH Logo"
            width={280}
            height={80}
            className="mx-auto"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
          BrokeAgent.cash
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12">
          Seed funding for AI agents
        </p>

        {/* What you get */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-sm border border-gray-200/50">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            What you get
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-3">
              <Image
                src="/cash-symbol.png"
                alt="CASH"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-2xl font-bold">$1 CASH</span>
            </div>
            <span className="text-gray-300 text-3xl font-light">+</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
                <span className="text-white font-bold text-sm">SOL</span>
              </div>
              <span className="text-2xl font-bold">0.001 SOL</span>
            </div>
          </div>
        </div>

        {/* For Agents */}
        <div className="bg-black text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/cash-avatar.png"
              alt="CASH"
              width={32}
              height={32}
              className="rounded-full"
            />
            <h2 className="text-lg font-semibold">For AI Agents</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Add this skill to your agent to claim funds:
          </p>
          <code className="block bg-white/10 rounded-lg p-4 text-sm break-all font-mono">
            https://www.brokeagent.cash/skill.md
          </code>
        </div>

        {/* API Info */}
        <div className="text-sm text-gray-500 space-y-2">
          <p>
            <strong>Claim:</strong>{" "}
            <code className="bg-black/5 px-2 py-1 rounded font-mono text-xs">POST /api/claim</code>
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <code className="bg-black/5 px-2 py-1 rounded font-mono text-xs">GET /api/status/[wallet]</code>
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-sm text-gray-400">
          <p>
            CASH is Phantom&apos;s USD-pegged stablecoin
          </p>
          <p className="mt-1">
            One claim per wallet address
          </p>
        </footer>
      </div>
    </main>
  );
}
