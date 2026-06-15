import React from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { ThemeWrapper } from "../components/ThemeWrapper";
import { Play, RotateCcw, ShieldAlert, Award, Layers } from "lucide-react";

export const Home = () => {
  const navigate = useNavigate();
  const { players, theme, setTheme } = useGame();
  const hasActiveSession = players.length > 0;

  return (
    <ThemeWrapper>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex p-3 bg-purple-500/10 rounded-3xl border border-purple-500/20 mb-2">
            <Layers className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">
            Least <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Count</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-md mx-auto">
            The streamlined companion dashboard optimized for card games and scorekeeping math.
          </p>
        </div>

        {/* Theme Toggler Grid Control Section */}
        <div className="bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 flex gap-2">
          {["party", "dark", "neon"].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-1.5 rounded-xl font-medium text-sm uppercase tracking-wider transition-all ${
                theme === t ? "bg-purple-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          {hasActiveSession && (
            <button
              onClick={() => navigate("/game")}
              className="glass-panel hover:bg-white/10 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-white border border-white/20 transition-all"
            >
              <RotateCcw className="w-5 h-5" /> Resume Match
            </button>
          )}
          <button
            onClick={() => navigate("/create")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-white shadow-xl shadow-purple-950/50 transition-all"
          >
            <Play className="w-5 h-5 fill-current" /> Start New Session
          </button>
        </div>

        {/* Core Value Props Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12 text-left">
          <div className="glass-panel p-6 rounded-2xl space-y-2">
            <ShieldAlert className="w-6 h-6 text-pink-400" />
            <h3 className="font-bold text-lg text-white">Automated Drop Tracking</h3>
            <p className="text-slate-400 text-sm">Handles custom cross-over rules instantly for complex math variants without errors.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-2">
            <Award className="w-6 h-6 text-purple-400" />
            <h3 className="font-bold text-lg text-white">Dynamic Podiums</h3>
            <p className="text-slate-400 text-sm">Generates crisp responsive visual leaderboards instantly on end game thresholds.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">LocalStorage Persistence</h3>
            <p className="text-slate-400 text-sm">Protects active logs seamlessly from accidents or screen refreshes automatically.</p>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};