import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { ThemeWrapper } from "../components/ThemeWrapper";
import { Plus, Trash2, ArrowLeft, ArrowRight, Target, Users } from "lucide-react";

export const CreateGame = () => {
  const navigate = useNavigate();
  const { resetGame, setGameMode, setDeadlineScore, setPlayers, setRankings } = useGame();

  const [mode, setMode] = useState("FIRST_MAN_OUT");
  const [deadline, setDeadline] = useState(100);
  const [rawNames, setRawNames] = useState(["", ""]);

  const handleAddField = () => setRawNames([...rawNames, ""]);
  const handleRemoveField = (idx) => setRawNames(rawNames.filter((_, i) => i !== idx));
  
  const handleNameChange = (idx, val) => {
    const next = [...rawNames];
    next[idx] = val;
    setRawNames(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanNames = rawNames.map(n => n.trim()).filter(n => n !== "");
    
    if (cleanNames.length < 2) return alert("Please input a minimum of 2 participating players.");
    if (new Set(cleanNames).size !== cleanNames.length) return alert("Ensure all participating player names are unique.");
    if (deadline <= 0) return alert("Deadline threshold values must safely exceed zero entries.");

    resetGame();

    const initialPlayerObjects = cleanNames.map((name, i) => ({
      id: `p-${Date.now()}-${i}`,
      name,
      totalScore: 0,
      eliminated: false,
      eliminatedRound: null,
      rank: null
    }));

    setGameMode(mode);
    setDeadlineScore(Number(deadline));
    setPlayers(initialPlayerObjects);
    setRankings(initialPlayerObjects);
    navigate("/game");
  };

  return (
    <ThemeWrapper>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="glass-panel p-2 rounded-xl text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Setup Session Parameters</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rules Configuration Blocks */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <label className="text-sm font-semibold tracking-wide text-slate-300 uppercase block">Select Variant Rules</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setMode("FIRST_MAN_OUT")}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  mode === "FIRST_MAN_OUT" ? "bg-purple-600/20 border-purple-500" : "bg-slate-900/40 border-slate-800"
                }`}
              >
                <h3 className="font-bold text-white">First Man Out</h3>
                <p className="text-xs text-slate-400 mt-1">The match completes as soon as any singular player breaks across the target limit threshold.</p>
              </div>
              <div 
                onClick={() => setMode("LAST_MAN_WIN")}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  mode === "LAST_MAN_WIN" ? "bg-purple-600/20 border-purple-500" : "bg-slate-900/40 border-slate-800"
                }`}
              >
                <h3 className="font-bold text-white">Last Man Standing</h3>
                <p className="text-xs text-slate-400 mt-1">Players are systematically eliminated upon crossing. The last remaining survivor wins.</p>
              </div>
            </div>
          </div>

          {/* Core Deadline Targets Configuration Panel */}
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Target className="w-5 h-5" />
              <label className="text-sm font-semibold tracking-wide uppercase">Target Deadline Limit</label>
            </div>
            <input 
              type="number" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 font-mono text-lg focus:outline-none focus:border-purple-500 text-white"
              min="1"
              required
            />
          </div>

          {/* Interactive Player Register Entry Fields Area */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-5 h-5" />
                <label className="text-sm font-semibold tracking-wide uppercase">Active Roster</label>
              </div>
              <button 
                type="button" 
                onClick={handleAddField}
                className="bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 text-white"
              >
                <Plus className="w-3.5 h-3.5" /> Add Player
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {rawNames.map((name, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input 
                    type="text"
                    placeholder={`Player #${idx + 1}`}
                    value={name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white"
                    required
                  />
                  {rawNames.length > 2 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveField(idx)}
                      className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-white shadow-xl text-lg transition-all"
          >
            Launch Arena <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </ThemeWrapper>
  );
};