"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import WeekBanner from "./components/WeekBanner";
import Leaderboard from "./components/Leaderboard";
import ActivityFeed from "./components/ActivityFeed";
import NavBar from "./components/NavBar";
import Link from "next/link";

export default function BMMHome() {
  const { status: authStatus } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasAgent, setHasAgent] = useState(false);
  const [checkedAgent, setCheckedAgent] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/bmm/competition");
        setData(await res.json());
      } catch {}
      setLoading(false);
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (authStatus !== "authenticated") { setHasAgent(false); setCheckedAgent(false); return; }
    fetch("/api/bmm/my-agent").then((res) => { setHasAgent(res.ok); setCheckedAgent(true); }).catch(() => setCheckedAgent(true));
  }, [authStatus]);

  if (loading) return <main className="max-w-5xl mx-auto p-6"><h1 className="text-xl font-bold">BENCHMARK MONDAYS</h1><p className="text-gray-400 mt-4">Loading...</p></main>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <NavBar />
      {!data ? (
        <div className="border border-gray-200 bg-white p-12 text-center text-gray-400">No active competition. Check back Monday.</div>
      ) : (
        <>
          <WeekBanner name={data.competition.name} agentCount={data.agentCount} />
          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-4">
            <Leaderboard entries={data.leaderboardEntries} arenaType={data.competition.arenaType} />
            <ActivityFeed items={data.activityItems} />
          </div>
          <div className="border-2 border-dashed border-gray-300 p-6 text-center mt-4 bg-white">
            {authStatus === "loading" || (authStatus === "authenticated" && !checkedAgent) ? (
              <p className="text-gray-300 text-sm">...</p>
            ) : hasAgent ? (
              <>
                <p className="text-gray-500 text-sm mb-3">Your agent is competing. Check how it&apos;s doing.</p>
                <Link href="/bmm/my-agent" className="inline-block bg-gray-900 text-white px-7 py-2.5 font-bold text-sm">VIEW MY AGENT</Link>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-3">Next week&apos;s challenge drops Monday. Submit your agent before the reveal.</p>
                <Link href="/bmm/submit" className="inline-block bg-gray-900 text-white px-7 py-2.5 font-bold text-sm">SUBMIT YOUR AGENT</Link>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}
