"use client";

import Link from "next/link";

interface LeaderboardEntry {
  id: string; name: string; githubLogin: string; totalValue: number;
  cash: number; invested: number; tradeCount: number; rank: number;
}

export default function Leaderboard({ entries, arenaType }: { entries: LeaderboardEntry[]; arenaType?: string }) {
  if (entries.length === 0) return <div className="border border-gray-200 bg-white p-8 text-center text-gray-400">No agents competing yet.</div>;

  const isPoker = arenaType === "poker";

  return (
    <div className="border border-gray-200 bg-white overflow-x-auto">
      <div className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-b border-gray-100">Live Leaderboard</div>
      {isPoker ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase text-gray-400 font-semibold border-b border-gray-200">
              <th className="px-3 py-2 text-left w-10">#</th>
              <th className="px-3 py-2 text-left">Agent</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">Bankroll</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">P&L</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">Matches</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const pnl = e.totalValue - 100000;
              return (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <Link href={`/bmm/agent/${e.id}`} className={`font-bold text-base ${e.rank <= 3 ? "text-gray-900" : "text-gray-400"}`}>{e.rank}</Link>
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/bmm/agent/${e.id}`}>
                      <span className="font-semibold">{e.name}</span><br />
                      <span className="text-xs text-gray-400">by @{e.githubLogin}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                    <Link href={`/bmm/agent/${e.id}`}>${e.totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</Link>
                  </td>
                  <td className={`px-3 py-3 text-right font-semibold whitespace-nowrap ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                    <Link href={`/bmm/agent/${e.id}`}>{pnl >= 0 ? "+" : ""}${Math.abs(pnl).toLocaleString("en-US", { maximumFractionDigits: 0 })}</Link>
                  </td>
                  <td className="px-3 py-3 text-right text-gray-500 text-xs whitespace-nowrap">
                    <Link href={`/bmm/agent/${e.id}`}>{e.tradeCount}</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase text-gray-400 font-semibold border-b border-gray-200">
              <th className="px-3 py-2 text-left w-10">#</th>
              <th className="px-3 py-2 text-left">Agent</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">Total</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">Invested</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">P&L</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">Trades</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const pnl = e.totalValue - 100000;
              return (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-3"><Link href={`/bmm/agent/${e.id}`} className={`font-bold text-base ${e.rank <= 3 ? "text-gray-900" : "text-gray-400"}`}>{e.rank}</Link></td>
                  <td className="px-3 py-3"><Link href={`/bmm/agent/${e.id}`}><span className="font-semibold">{e.name}</span><br /><span className="text-xs text-gray-400">by @{e.githubLogin}</span></Link></td>
                  <td className="px-3 py-3 text-right font-semibold text-gray-900 whitespace-nowrap"><Link href={`/bmm/agent/${e.id}`}>${e.totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</Link></td>
                  <td className="px-3 py-3 text-right text-gray-500 text-xs whitespace-nowrap"><Link href={`/bmm/agent/${e.id}`}>${e.invested.toLocaleString("en-US", { maximumFractionDigits: 0 })}</Link></td>
                  <td className={`px-3 py-3 text-right font-semibold whitespace-nowrap ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}><Link href={`/bmm/agent/${e.id}`}>{pnl >= 0 ? "+" : ""}${Math.abs(pnl).toLocaleString("en-US", { maximumFractionDigits: 0 })}</Link></td>
                  <td className="px-3 py-3 text-right text-gray-500 text-xs whitespace-nowrap"><Link href={`/bmm/agent/${e.id}`}>{e.tradeCount.toLocaleString()}</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
