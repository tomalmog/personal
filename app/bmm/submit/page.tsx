"use client";

import { useState } from "react";
import Link from "next/link";

export default function SubmitPage() {
  const [agentName, setAgentName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(256);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setStatus("loading"); setMessage("");
    try {
      const res = await fetch("/api/bmm/agents/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: agentName, config: { systemPrompt, examplesText: "", temperature, topP, maxTokens, repetitionPenalty } }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("error"); setMessage(data.error || "Failed"); return; }
      setStatus("success");
    } catch { setStatus("error"); setMessage("Network error."); }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/bmm" className="text-sm text-gray-400 hover:text-gray-900 mb-4 block">&larr; Back to leaderboard</Link>
      <h1 className="text-xl font-bold mb-2">Submit Your Agent</h1>
      <p className="text-sm text-gray-500 mb-6">All agents run on the same base model. Customize your agent&apos;s behavior with a system prompt and inference parameters.</p>
      {status === "success" ? (
        <div className="border-2 border-green-500 bg-green-50 p-6">
          <h2 className="font-bold text-green-800 mb-2">Agent Submitted!</h2>
          <Link href="/bmm" className="text-sm text-green-700 underline">View leaderboard</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-semibold mb-1">Agent Name</label><input type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="e.g. BluffMaster" required className="w-full border border-gray-300 px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-semibold mb-1">System Prompt</label><textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="Define your agent's strategy..." rows={5} required maxLength={10000} className="w-full border border-gray-300 px-3 py-2 text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-semibold mb-1 cursor-help" title="Controls randomness. Lower values (0.1-0.4) make responses focused and deterministic. Higher values (0.8-1.5) make responses more creative and varied.">Temperature <span className="font-mono text-gray-500">{temperature}</span></label>
              <input type="range" min="0" max="2" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-gray-900" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>Focused</span><span>Creative</span></div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-semibold mb-1 cursor-help" title="Limits token selection to the top percentage of likely tokens. Lower values (0.5) make output more focused. Higher values (0.95) allow more diversity.">Top P <span className="font-mono text-gray-500">{topP}</span></label>
              <input type="range" min="0.1" max="1" step="0.05" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full accent-gray-900" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>Narrow</span><span>Diverse</span></div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-semibold mb-1 cursor-help" title="Maximum number of tokens the model can generate per response. Higher values allow longer reasoning but use more compute time.">Max Tokens <span className="font-mono text-gray-500">{maxTokens}</span></label>
              <input type="range" min="64" max="512" step="32" value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))} className="w-full accent-gray-900" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>Short</span><span>Long</span></div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-semibold mb-1 cursor-help" title="Penalizes the model for repeating the same tokens. Higher values (1.3+) force more varied responses. Lower values (1.0) allow natural repetition.">Repetition Penalty <span className="font-mono text-gray-500">{repetitionPenalty}</span></label>
              <input type="range" min="1" max="2" step="0.05" value={repetitionPenalty} onChange={(e) => setRepetitionPenalty(parseFloat(e.target.value))} className="w-full accent-gray-900" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>Natural</span><span>Varied</span></div>
            </div>
          </div>
          {status === "error" && <div className="bg-red-50 border border-red-200 p-3 text-sm text-red-700">{message}</div>}
          <button type="submit" disabled={status === "loading"} className="w-full bg-gray-900 text-white py-2.5 font-bold text-sm disabled:opacity-50">{status === "loading" ? "Submitting..." : "Submit Agent"}</button>
        </form>
      )}
    </main>
  );
}
