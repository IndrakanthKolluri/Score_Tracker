import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { ThemeWrapper } from "../components/ThemeWrapper";
import { ScoreProgress } from "../components/ScoreProgress";
import { processGameRound } from "../utils/rankingEngine";
import { Plus, Undo, Award, ClipboardList, Swords } from "lucide-react";

export const GameBoard = () => {
  const navigate = useNavigate();
  const { 
    gameMode, deadlineScore, players, setPlayers, 
    rounds, setRounds, setWinner, rankings, setRankings 
  } = useGame();

  const [currentRoundScores, setCurrentRoundScores] = useState({});

  useEffect(() => {
    if (!players || players.length === 0) {
      navigate("/create");
    }
  }, [players, navigate]);

  const handleScoreInput = (pId, val) => {
    setCurrentRoundScores({ ...currentRoundScores, [pId]: val });
  };

  const handleCommitRound = (e) => {
    e.preventDefault();

    const nextRoundNo = rounds.length + 1;
    const scoresMap = {};
    
    // Default unset rows safely to 0
    players.forEach(p => {
      scoresMap[p.id] = Number(currentRoundScores[p.id] || 0);
    });

    // Mutate overall match standings matrix
    const totalizedPlayers = players.map(p => ({
      ...p,
      totalScore: p.totalScore + (p.eliminated ? 0 : scoresMap[p.id])
    }));

    const roundData = {
      id: `round-${Date.now()}`,
      roundNo: nextRoundNo,
      scores: scoresMap
    };

    const nextRoundsStack = [...rounds, roundData];

    // Evaluate win parameters globally
    const { updatedPlayers, isGameOver, detectedWinner, computedRankings } = processGameRound(
      totalizedPlayers, deadlineScore, gameMode, nextRoundNo
    );

    setPlayers(updatedPlayers);
    setRounds(nextRoundsStack);
    setRankings(computedRankings);

    setCurrentRoundScores({});

    if (isGameOver) {
      setWinner(detectedWinner);
      navigate("/results");
    }
  };

  const handleRollbackLastRound = () => {
    if (rounds.length === 0) return;
    
    const nextRoundsStack = [...rounds];
    const extractedPoppedRound = nextRoundsStack.pop();

    const unrolledPlayers = players.map(p => {
      const addedAmt = extractedPoppedRound.scores[p.id] || 0;
      return {
        ...p,
        totalScore: Math.max(0, p.totalScore - (p.eliminated && p.eliminatedRound !== extractedPoppedRound.roundNo ? 0 : addedAmt)),
        eliminated: p.eliminatedRound === extractedPoppedRound.roundNo ? false : p.eliminated,
        eliminatedRound: p.eliminatedRound === extractedPoppedRound.roundNo ? null : p.eliminatedRound,
        rank: null
      };
    });

    const fallbackSorting = [...unrolledPlayers].sort((a, b) => {
      if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
      return a.totalScore - b.totalScore;
    });

    setPlayers(unrolledPlayers);
    setRounds(nextRoundsStack);
    setRankings(fallbackSorting);
  };

  return (
    <ThemeWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Area: Interactive Round Tracker Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Current Iteration</span>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <Swords className="w-5 h-5 text-pink-400" /> Log Round #{rounds.length + 1}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Limit Rule Target</span>
                <p className="font-mono text-lg font-bold text-white mt-0.5">{deadlineScore} pts</p>
              </div>
            </div>

            <form onSubmit={handleCommitRound} className="space-y-4">
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {players.map((p) => (
                  <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    p.eliminated ? "bg-rose-950/20 opacity-40 border border-rose-900/30" : "bg-slate-900/40 border border-slate-800/80"
                  }`}>
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        {p.name} {p.eliminated && <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md border border-rose-500/20">OUT</span>}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Current Stack: <span className="font-mono font-medium">{p.totalScore}</span></p>
                    </div>
                    
                    {!p.eliminated && (
                      <input 
                        type="number"
                        placeholder="0"
                        value={currentRoundScores[p.id] || ""}
                        onChange={(e) => handleScoreInput(p.id, e.target.value)}
                        className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-right font-mono focus:outline-none focus:border-purple-500 text-white"
                        min="0"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={rounds.length === 0}
                  onClick={handleRollbackLastRound}
                  className="glass-panel border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent p-4 rounded-xl text-slate-300 transition-all"
                  title="Undo Last Round"
                >
                  <Undo className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 font-bold py-4 rounded-xl text-white shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-5 h-5" /> Commit Round Ledger
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column Area: Realtime Leaderboard Grid Widget */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Award className="w-5 h-5 text-yellow-400" /> Realtime Standings
            </h2>
            <div className="space-y-4">
              {rankings.map((p, index) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-300">
                      #{index + 1} <span className="text-white font-bold ml-1">{p.name}</span>
                    </span>
                    <span className={`font-mono font-bold ${p.eliminated ? 'text-rose-400' : 'text-slate-200'}`}>
                      {p.totalScore} pts {p.eliminated && "❌"}
                    </span>
                  </div>
                  <ScoreProgress score={p.totalScore} deadline={deadlineScore} />
                </div>
              ))}
            </div>
          </div>

          {/* Historical Round Summary Component Card */}
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold tracking-wide uppercase text-slate-300 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-cyan-400" /> Match History Logs
            </h3>
            {rounds.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No historical log entries recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {[...rounds].reverse().map((r) => (
                  <div key={r.id} className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Round Ledger #{r.roundNo}</span>
                    <div className="flex gap-2 text-slate-400 font-mono">
                      {Object.entries(r.scores).slice(0, 3).map(([pId, score]) => {
                        const matchedName = players.find(p => p.id === pId)?.name || "User";
                        return <span key={pId}>{matchedName[0]}:{score}</span>;
                      })}
                      {Object.keys(r.scores).length > 3 && <span>...</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </ThemeWrapper>
  );
};