"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "../../components/NavBar";

export default function EditAgentPage() {
  const { data: session, status: authStatus } = useSession();
  const [agentId, setAgentId] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(256);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authStatus !== "authenticated") { setLoading(false); return; }
    fetch("/api/bmm/my-agent").then(async (res) => {
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      setAgentId(data.id);
      const configRes = await fetch(`/api/bmm/agents/${data.id}/config`);
      if (configRes.ok) {
        const config = await configRes.json();
        setSystemPrompt(config.systemPrompt || "");
        setTemperature(config.temperature ?? 0.7);
        setTopP(config.topP ?? 0.9);
        setMaxTokens(config.maxTokens ?? 256);
        setRepetitionPenalty(config.repetitionPenalty ?? 1.1);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [authStatus]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/bmm/agents/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agentId, config: { systemPrompt, temperature, topP, maxTokens, repetitionPenalty } }) });
      const data = await res.json();
      setMessage(res.ok ? "Saved!" : data.error || "Failed");
    } catch { setMessage("Network error"); }
    setSaving(false);
  }

  if (authStatus === "loading" || loading) return <main className="max-w-2xl mx-auto p-6"><NavBar /><p className="text-gray-400">Loading...</p></main>;
  if (!session) return <main className="max-w-2xl mx-auto p-6"><NavBar /><p className="text-gray-500">Sign in to edit your agent.</p><button onClick={() => signIn("github")} className="mt-2 bg-gray-900 text-white px-4 py-2 text-sm">Sign in</button></main>;
  if (!agentId) return <main className="max-w-2xl mx-auto p-6"><NavBar /><p className="text-gray-500">No agent to edit. <Link href="/bmm/submit" className="underline">Submit one first.</Link></p></main>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <NavBar />
      <Link href={`/bmm/agent/${agentId}`} className="text-sm text-gray-400 hover:text-gray-900 mb-4 block">&larr; Back to my agent</Link>
      <h1 className="text-xl font-bold mb-4">Edit Agent</h1>
      <form onSubmit={handleSave} className="space-y-5">
        <div><label className="block text-sm font-semibold mb-1">System Prompt</label><textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={6} maxLength={10000} className="w-full border border-gray-300 px-3 py-2 text-sm" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-semibold mb-1 cursor-help" title="Controls randomness. Lower values (0.1-0.4) make responses focused and deterministic. Higher values (0.8-1.5) make responses more creative and varied.">
              Temperature <span className="font-mono text-gray-500">{temperature}</span>
            </label>
            <input type="range" min="0" max="2" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-gray-900" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>Focused</span><span>Creative</span></div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-semibold mb-1 cursor-help" title="Limits token selection to the top percentage of likely tokens. Lower values (0.5) make output more focused. Higher values (0.95) allow more diversity.">
              Top P <span className="font-mono text-gray-500">{topP}</span>
            </label>
            <input type="range" min="0.1" max="1" step="0.05" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full accent-gray-900" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>Narrow</span><span>Diverse</span></div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-semibold mb-1 cursor-help" title="Maximum number of tokens the model can generate per response. Higher values allow longer reasoning but use more compute time.">
              Max Tokens <span className="font-mono text-gray-500">{maxTokens}</span>
            </label>
            <input type="range" min="64" max="512" step="32" value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))} className="w-full accent-gray-900" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>Short</span><span>Long</span></div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-semibold mb-1 cursor-help" title="Penalizes the model for repeating the same tokens. Higher values (1.3+) force more varied responses. Lower values (1.0) allow natural repetition.">
              Repetition Penalty <span className="font-mono text-gray-500">{repetitionPenalty}</span>
            </label>
            <input type="range" min="1" max="2" step="0.05" value={repetitionPenalty} onChange={(e) => setRepetitionPenalty(parseFloat(e.target.value))} className="w-full accent-gray-900" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>Natural</span><span>Varied</span></div>
          </div>
        </div>
        {message && <div className={`p-3 text-sm ${message === "Saved!" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{message}</div>}
        <button type="submit" disabled={saving} className="w-full bg-gray-900 text-white py-2.5 font-bold text-sm disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
      </form>
    </main>
  );
}
