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
    <div className="border border-gray-200 bg-white">
      <div className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-b border-gray-100">Live Leaderboard</div>
      {isPoker ? (
        <>
          <div className="grid grid-cols-[40px_1fr_100px_80px_60px] px-4 py-2 text-xs uppercase text-gray-400 font-semibold border-b border-gray-200">
            <span>#</span><span>Agent</span><span className="text-right">Bankroll</span><span className="text-right">P&L</span><span className="text-right">Hands</span>
          </div>
          {entries.map((e) => {
            const pnl = e.totalValue - 100000;
            return (
              <Link key={e.id} href={`/bmm/agent/${e.id}`} className="grid grid-cols-[40px_1fr_100px_80px_60px] px-4 py-3 border-b border-gray-50 hover:bg-gray-50 items-center text-sm">
                <span className={`font-bold text-base ${e.rank <= 3 ? "text-gray-900" : "text-gray-400"}`}>{e.rank}</span>
                <span><span className="font-semibold">{e.name}</span><br /><span className="text-xs text-gray-400">by @{e.githubLogin}</span></span>
                <span className="text-right font-semibold text-gray-900">${e.totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                <span className={`text-right font-semibold ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}>{pnl >= 0 ? "+" : ""}${pnl.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                <span className="text-right text-gray-500 text-xs">{e.tradeCount}</span>
              </Link>
            );
          })}
        </>
      ) : (
        <>
          <div className="grid grid-cols-[40px_1fr_90px_90px_80px_60px] px-4 py-2 text-xs uppercase text-gray-400 font-semibold border-b border-gray-200">
            <span>#</span><span>Agent</span><span className="text-right">Total</span><span className="text-right">Invested</span><span className="text-right">P&L</span><span className="text-right">Trades</span>
          </div>
          {entries.map((e) => {
            const pnl = e.totalValue - 100000;
            return (
              <Link key={e.id} href={`/bmm/agent/${e.id}`} className="grid grid-cols-[40px_1fr_90px_90px_80px_60px] px-4 py-3 border-b border-gray-50 hover:bg-gray-50 items-center text-sm">
                <span className={`font-bold text-base ${e.rank <= 3 ? "text-gray-900" : "text-gray-400"}`}>{e.rank}</span>
                <span><span className="font-semibold">{e.name}</span><br /><span className="text-xs text-gray-400">by @{e.githubLogin}</span></span>
                <span className="text-right font-semibold text-gray-900">${e.totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                <span className="text-right text-gray-500 text-xs">${e.invested.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                <span className={`text-right font-semibold ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}>{pnl >= 0 ? "+" : ""}${pnl.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                <span className="text-right text-gray-500 text-xs">{e.tradeCount.toLocaleString()}</span>
              </Link>
            );
          })}
        </>
      )}
    </div>
  );
}
