import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { ThemeWrapper } from "../components/ThemeWrapper";
import { generateWhatsAppText } from "../utils/rankingEngine";
import ReactConfetti from "react-confetti";
import { Home, RotateCcw, Share2, Award, Users, Trophy } from "lucide-react";

export const Results = () => {
  const navigate = useNavigate();
  const { winner, rankings, resetGame } = useGame();

  useEffect(() => {
    if (!winner) navigate("/");
  }, [winner, navigate]);

  const handleTriggerWhatsAppIntent = () => {
    const serializedShareUrl = `https://wa.me/?text=${generateWhatsAppText(rankings, winner)}`;
    window.open(serializedShareUrl, "_blank");
  };

  const handleRestartSession = () => {
    resetGame();
    navigate("/create");
  };

  return (
    <ThemeWrapper>
      {/* Canvas Confetti Explosion Asset Layer */}
      <ReactConfetti recycle={false} numberOfPieces={350} gravity={0.15} />

      <div className="max-w-3xl mx-auto text-center space-y-8 py-6">
        
        {/* Crown & Winner Profile Hero Widget */}
        <div className="space-y-2 relative">
          <div className="inline-flex p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20 mb-2 relative animate-bounce">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">CONGRATULATIONS!</h1>
          <p className="text-xl text-yellow-400 font-bold tracking-wide uppercase mt-1">
            👑 {winner?.name} completely dominated the field!
          </p>
        </div>

        {/* 3D Glassmorphism Styled Ranking Podium Blocks */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 text-left">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Users className="w-5 h-5 text-purple-400" /> Official Certified Placements
          </h2>
          <div className="space-y-3">
            {rankings.map((p, idx) => (
              <div 
                key={p.id} 
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  p.id === winner?.id 
                    ? "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
                    : "bg-slate-900/40 border-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? "bg-yellow-500 text-slate-950" : idx === 1 ? "bg-slate-400 text-slate-950" : "bg-amber-700 text-white"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white text-base">{p.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-slate-200">{p.totalScore} pts</span>
                  {p.eliminated && (
                    <p className="text-[10px] text-rose-400 tracking-wider font-semibold uppercase mt-0.5">Dropped Round {p.eliminatedRound}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Control Button Menu Array */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => { resetGame(); navigate("/"); }}
            className="glass-panel border border-white/10 hover:bg-white/5 py-4 rounded-2xl font-bold text-slate-300 flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-5 h-5" /> Exit Terminal
          </button>
          <button
            onClick={handleTriggerWhatsAppIntent}
            className="bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-5 h-5" /> WhatsApp Ledger
          </button>
          <button
            onClick={handleRestartSession}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 py-4 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-5 h-5" /> Rematch Deck
          </button>
        </div>

      </div>
    </ThemeWrapper>
  );
};