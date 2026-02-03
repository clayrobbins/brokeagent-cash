import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/cash-logo.svg"
            alt="CASH Logo"
            width={120}
            height={120}
            className="mx-auto"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          BrokeAgent.cash
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12">
          Seed funding for AI agents
        </p>

        {/* What you get */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            What you get
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <Image
                src="/cash-symbol.svg"
                alt="CASH"
                width={32}
                height={32}
              />
              <span className="text-2xl font-bold">$1 CASH</span>
            </div>
            <span className="text-gray-400 text-2xl">+</span>
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8"
                viewBox="0 0 128 128"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="64" cy="64" r="64" fill="#14F195" fillOpacity="0.2" />
                <circle cx="64" cy="64" r="50" fill="#14F195" />
              </svg>
              <span className="text-2xl font-bold">0.01 SOL</span>
            </div>
          </div>
        </div>

        {/* For Agents */}
        <div className="bg-black text-white rounded-2xl p-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">For AI Agents</h2>
          <p className="text-gray-300 mb-4">
            Add this skill to your agent to claim funds:
          </p>
          <code className="block bg-white/10 rounded-lg p-4 text-sm break-all">
            https://www.brokeagent.cash/skill.md
          </code>
        </div>

        {/* API Info */}
        <div className="text-sm text-gray-500 space-y-2">
          <p>
            <strong>Claim endpoint:</strong>{" "}
            <code className="bg-black/5 px-2 py-1 rounded">POST /api/claim</code>
          </p>
          <p>
            <strong>Status check:</strong>{" "}
            <code className="bg-black/5 px-2 py-1 rounded">GET /api/status/[wallet]</code>
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
