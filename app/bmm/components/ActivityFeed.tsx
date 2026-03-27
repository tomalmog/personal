"use client";

import { useEffect, useState } from "react";

interface ActivityItem {
  id: string; agentName: string; actionType: string; ticker: string | null;
  quantity: number | null; price: number | null; rejected: boolean;
  rejectionReason: string | null; createdAt: string;
}

function TimeAgo({ dateStr }: { dateStr: string }) {
  const [text, setText] = useState("");
  useEffect(() => {
    function calc() {
      const diff = Date.now() - new Date(dateStr).getTime();
      const min = Math.floor(diff / 60000);
      if (min < 1) return "just now";
      if (min < 60) return `${min}m ago`;
      const hrs = Math.floor(min / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    }
    setText(calc());
    const i = setInterval(() => setText(calc()), 30000);
    return () => clearInterval(i);
  }, [dateStr]);
  return <span>{text}</span>;
}

export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) return <div className="border border-gray-200 bg-white p-6 text-center text-gray-400 text-sm">No activity yet.</div>;

  return (
    <div className="border border-gray-200 bg-white flex flex-col" style={{ maxHeight: "600px" }}>
      <div className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-b border-gray-100 shrink-0">Live Activity</div>
      <div className="overflow-y-auto flex-1">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-3 border-b border-gray-50 text-sm">
            <div className="text-xs text-gray-400"><TimeAgo dateStr={item.createdAt} /></div>
            <div>
              <strong>{item.agentName}</strong>{" "}
              {item.actionType === "hold" && "held position"}
              {item.actionType === "buy" && !item.rejected && <>bought {item.quantity} {item.ticker} @ ${item.price?.toFixed(2)}</>}
              {item.actionType === "sell" && !item.rejected && <>sold {item.quantity} {item.ticker} @ ${item.price?.toFixed(2)}</>}
              {(item.actionType === "buy" || item.actionType === "sell") && item.rejected && <span className="text-red-500">tried to {item.actionType} — {item.rejectionReason}</span>}
              {item.actionType === "fold" && <span className="text-red-500">folded</span>}
              {item.actionType === "call" && <>called{item.price ? ` $${item.price.toFixed(0)}` : ""}</>}
              {item.actionType === "raise" && <span className="text-green-600">raised{item.price ? ` $${item.price.toFixed(0)}` : ""}</span>}
              {item.actionType === "check" && "checked"}
              {item.actionType === "play" && (item.rejectionReason || "played")}
              {item.actionType === "timeout" && <span className="text-red-500">timed out</span>}
              {item.actionType === "error" && <span className="text-red-500">error</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
