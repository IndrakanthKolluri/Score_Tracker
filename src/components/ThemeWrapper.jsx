import React from "react";
import { useGame } from "../context/GameContext";

const themeGradients = {
  party: "from-indigo-900 via-purple-900 to-pink-900",
  dark: "from-slate-900 via-gray-900 to-zinc-950",
  neon: "from-neutral-950 via-cyan-950 to-emerald-950"
};

export const ThemeWrapper = ({ children }) => {
  const { theme } = useGame();
  const activeGradient = themeGradients[theme] || themeGradients.party;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeGradient} p-4 md:p-8 transition-all duration-700`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};