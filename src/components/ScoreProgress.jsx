import React from "react";

export const ScoreProgress = ({ score, deadline }) => {
  const pct = Math.min((score / deadline) * 100, 100);
  
  let barColor = "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]";
  if (pct >= 90) barColor = "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]";
  else if (pct >= 70) barColor = "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]";

  return (
    <div className="w-full bg-slate-800/80 rounded-full h-2 mt-2 overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};